import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Character } from '../../entities/Character.entity';
import { GameEvent } from '../../entities/GameEvent.entity';
import { GAME_QUEUE, JOB_NAME } from '../../config/constants';
import { StatsCalculatorService } from '../statsCalculator/stats-calculator.service'; // Added
import {
  CharacterBaseInfoDto,
  BaseAttributesDto,
} from '../dtos/character-stats.dto'; // Added

@Processor(GAME_QUEUE)
export class ProjectorWorker extends WorkerHost {
  private readonly logger = new Logger(ProjectorWorker.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly statsCalculator: StatsCalculatorService, // INJECTED CRITICAL DEPENDENCY
  ) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    if (job.name !== JOB_NAME.syncCharacterView) {
      return;
    }

    const { characterId } = job.data;
    await this.project(characterId);
  }

  private async project(aggregateId: string) {
    // 1. Load the CURRENT View State (The Bookmark)
    let charView: Character | null = await this.dataSource.manager.findOne(
      Character,
      {
        where: { id: aggregateId },
      },
    );

    const lastSeq = charView ? charView.lastSequenceNumber : 0;

    // 2. Load ONLY New Events (The Optimization)
    const events = await this.dataSource.manager
      .createQueryBuilder(GameEvent, 'event')
      .where('event.aggregateId = :id', { id: aggregateId })
      .andWhere('event.sequenceNumber > :seq', { seq: lastSeq })
      .orderBy('event.sequenceNumber', 'ASC')
      .getMany();

    if (events.length === 0) return;

    // The handler already creates the entity, so we assume charView exists.
    // If not, something catastrophic happened or the handler logic changed.
    if (!charView) {
      this.logger.error(
        `Character view not found for ID: ${aggregateId} during projection.`,
      );
      return;
    }

    // 4. Apply ONLY the Delta (The changes)
    for (const event of events) {
      if (event.type === 'XPGained') {
        charView.currXp = (charView.currXp || 0) + event.payload.amount;
      }

      // CRITICAL: Recalculate derived stats only on LevelUp
      if (event.type === 'LevelUp') {
        charView.level = event.payload.newLevel;

        const baseInfo: CharacterBaseInfoDto = {
          name: charView.name,
          race: charView.race,
          class: charView.class,
          height: charView.height,
          weight: charView.weight,
          age: charView.age,
        };

        const attributes: BaseAttributesDto = {
          strength: charView.strength,
          dexterity: charView.dexterity,
          agility: charView.agility,
          arcane: charView.arcane,
          vitality: charView.vitality,
          energy: charView.energy,
          constitution: charView.constitution,
        };

        const newDerivedStats = this.statsCalculator.calculate(
          baseInfo,
          attributes,
        );

        charView.maxHp = newDerivedStats.maxHp;
        charView.maxMp = newDerivedStats.maxMp;
        charView.maxStamina = newDerivedStats.maxStamina;
        charView.carryCapacity = newDerivedStats.carryCapacity;
      }

      // UPDATE THE BOOKMARK
      charView.lastSequenceNumber = event.sequenceNumber;
    }

    // 5. Save State + New Bookmark
    await this.dataSource.manager.save(Character, charView);

    this.logger.log(
      `Projected ${events.length} new events. Head at ${charView.lastSequenceNumber}`,
    );
  }
}

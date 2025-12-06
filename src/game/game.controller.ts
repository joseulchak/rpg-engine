import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseAttributesDto } from './dtos/character-stats.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateCharacterCommand } from './commands/create-character.command';
import { LevelUpCommand } from './commands/level-up.command';
import { InjectQueue } from '@nestjs/bullmq';
import { GAME_QUEUE, LEVEL_UP_COMMAND } from 'src/config/constants';
import { Queue } from 'bullmq';

@Controller('game')
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectQueue(GAME_QUEUE) private readonly gameQueue: Queue,
  ) {}

  @Post('character')
  async createCharacter(
    @Body('name') name: string,
    @Body('attributes') attributes: BaseAttributesDto,
  ) {
    const characterId = uuidv4();
    await this.commandBus.execute(
      new CreateCharacterCommand(characterId, name, attributes),
    );
    return { characterId };
  }

  @Post('character/:characterId/level-up')
  @HttpCode(HttpStatus.ACCEPTED)
  async levelUp(@Param('characterId') characterId: string) {
    const command = new LevelUpCommand(characterId);
    const job = await this.gameQueue.add(LEVEL_UP_COMMAND, command);

    return {
      status: 'queued',
      jobId: job.id,
      characterId,
    };
  }
}

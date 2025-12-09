import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  BaseAttributesDto,
  CharacterBaseDto,
} from './dtos/character-stats.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateCharacterCommand } from './commands/create-character.command';
import { GainXpCommand } from './commands/gain-xp.command';
import { GAME_QUEUE, JOB_NAME } from 'src/config/constants';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/User.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectQueue(GAME_QUEUE) private readonly gameQueue: Queue,
  ) {}

  @Post('character')
  async createCharacter(
    @Body('baseInfo') baseInfo: CharacterBaseDto,
    @Body('attributes') attributes: BaseAttributesDto,
    @CurrentUser() user: User,
  ) {
    const characterId = uuidv4();
    await this.commandBus.execute(
      new CreateCharacterCommand(characterId, baseInfo, attributes, user),
    );
    return { characterId };
  }

  @Post('character/:characterId/xp')
  @HttpCode(HttpStatus.ACCEPTED)
  async gainXp(
    @Param('characterId') characterId: string,
    @Body('amount') amount: number,
  ) {
    const command = new GainXpCommand(characterId, amount);
    const job = await this.gameQueue.add(JOB_NAME.gainXp, command);

    return {
      status: 'queued',
      jobId: job.id,
      characterId,
    };
  }
}

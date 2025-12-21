import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  BaseAttributesDto,
  CharacterBaseInfoDto,
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
import { CharacterQueryService } from './character-query.service';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(
    private readonly characterQueryService: CharacterQueryService,
    private readonly commandBus: CommandBus,
    @InjectQueue(GAME_QUEUE) private readonly gameQueue: Queue,
  ) {}

  @Post('character')
  async createCharacter(
    @Body('baseInfo') baseInfo: CharacterBaseInfoDto, // Requires Base Info DTO
    @Body('attributes') attributes: BaseAttributesDto, // Requires Attributes DTO
    @CurrentUser() user: User,
  ) {
    const characterId = uuidv4();
    await this.commandBus.execute(
      new CreateCharacterCommand(characterId, baseInfo, attributes, user), // Updated to pass attributes
    );
    return { characterId };
  }

  @Post('character/:characterId/xp')
  @HttpCode(HttpStatus.ACCEPTED)
  async gainXp(
    @Param('characterId') characterId: string,
    @Body('amount') amount: number,
    @CurrentUser() user: User,
  ) {
    const command = new GainXpCommand(characterId, amount);
    const job = await this.gameQueue.add(JOB_NAME.gainXp, command);

    return {
      status: 'queued',
      jobId: job.id,
      characterId,
    };
  }

  @Get('character/:characterId')
  async getCharacter(
    @Param('characterId') characterId: string,
    @CurrentUser() user: User,
  ) {
    return await this.characterQueryService.getCharacterById(
      characterId,
      user.id,
    );
  }
}

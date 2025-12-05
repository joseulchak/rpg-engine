import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseAttributesDto } from './dtos/character-stats.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateCharacterCommand } from './commands/create-character.command';

@Controller('game')
export class GameController {
  constructor(private readonly commandBus: CommandBus) {}

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
}

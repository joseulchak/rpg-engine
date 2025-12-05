import { BaseAttributesDto } from '../dtos/character-stats.dto';

export class CreateCharacterCommand {
  constructor(
    public readonly characterId: string,
    public readonly name: string,
    public readonly attributes: BaseAttributesDto,
  ) {}
}

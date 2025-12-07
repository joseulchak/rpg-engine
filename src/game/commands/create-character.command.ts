import {
  BaseAttributesDto,
  CharacterBaseDto,
} from '../dtos/character-stats.dto';

export class CreateCharacterCommand {
  constructor(
    public readonly characterId: string,
    public readonly baseInfo: CharacterBaseDto,
    public readonly attributes: BaseAttributesDto,
  ) {}
}

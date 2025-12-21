import { User } from 'src/entities/User.entity';
import {
  CharacterBaseInfoDto,
  BaseAttributesDto,
} from '../dtos/character-stats.dto'; // Updated imports

export class CreateCharacterCommand {
  constructor(
    public readonly characterId: string,
    public readonly baseInfo: CharacterBaseInfoDto, // Use Base Info DTO
    public readonly attributes: BaseAttributesDto, // Use Attributes DTO
    public readonly user: User,
  ) {}
}

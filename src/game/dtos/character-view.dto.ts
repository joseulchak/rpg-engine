import {
  BaseAttributesDto,
  CharacterBaseInfoDto,
  DerivedStatsDto,
} from './character-stats.dto';

export class CharacterViewDto {
  id: string;

  level: number;
  currXp: number;

  baseInfo: CharacterBaseInfoDto;
  attributes: BaseAttributesDto;
  stats: DerivedStatsDto;
}

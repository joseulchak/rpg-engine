import { GameEvent } from 'src/entities/GameEvent.entity';

export class CharacterAggregate {
  private id: string;
  private currentXp: number = 0;
  private currentLevel: number = 1;

  constructor(id: string, history: GameEvent[]) {
    this.id = id;
    history.forEach((event) => this.apply(event));
  }

  private xpNeededForNextLevel(currentLevel: number): number {
    const baseExponential = 2;
    const baseMultiplier = 5;
    return (currentLevel + 1) ** baseExponential * baseMultiplier;
  }

  private apply(event: GameEvent): void {
    if (event.type === 'CharacterCreated') {
      this.currentLevel = 1;
      this.currentXp = 0;
    }
    if (event.type === 'XPGained') {
      this.currentXp += event.payload.amount;
    }
    if (event.type === 'LevelUp') {
      this.currentLevel = event.payload.newLevel;
    }
  }

  public gainXp(amount: number): GameEvent[] {
    const events: GameEvent[] = [];

    // 1. Create XP Event
    const xpEvent = new GameEvent();
    xpEvent.aggregateId = this.id;
    xpEvent.type = 'XPGained';
    xpEvent.payload = { amount };
    xpEvent.sequenceNumber = 0; // DB will handle this
    xpEvent.version = 1;

    // Apply temporary state to check for level up
    this.currentXp += amount;
    events.push(xpEvent);

    // 2. Check Logic (The "100" Rule)
    // In reality, this would be a formula: (level * 1000)
    const xpNeededForNextLevel = this.xpNeededForNextLevel(this.currentLevel);

    if (this.currentXp >= xpNeededForNextLevel) {
      const levelUpEvent = new GameEvent();
      levelUpEvent.aggregateId = this.id;
      levelUpEvent.type = 'LevelUp';
      levelUpEvent.payload = {
        oldLevel: this.currentLevel,
        newLevel: this.currentLevel + 1,
        sourceXp: this.currentXp, // Audit trail
      };
      levelUpEvent.version = 1;

      this.currentLevel++;
      events.push(levelUpEvent);
    }
    return events;
  }
}

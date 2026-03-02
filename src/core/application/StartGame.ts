import type { GameRepository } from '../domain/repositories/GameRepository';

export class StartGameUseCase {
  constructor(private readonly repository: GameRepository) {}

  async execute(level: number): Promise<void> {
    this.repository.setLevel(level);
    const state = this.repository.getState();
    this.repository.save(state);
  }
}

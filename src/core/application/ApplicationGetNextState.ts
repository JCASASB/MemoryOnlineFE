import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationGetNextState {
  constructor(private readonly repository: GameRepository) {}

  async execute(): Promise<Game | undefined> {
    const state = await this.repository.goToNextVersionState();
    return state;
  }
}

import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";

export class UseCaseGetUpdatedState {
  constructor(private readonly repository: GameRepository) {}

  async execute(): Promise<Game> {
    const newState = await this.repository.getLastState();
    return newState;
  }
}

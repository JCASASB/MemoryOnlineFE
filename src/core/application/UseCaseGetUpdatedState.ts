import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseGetUpdatedState {
  constructor(private readonly repository: GameRepository) {}

  async execute(): Promise<GameState> {
    const newState = await this.repository.getState();
    return newState;
  }
}

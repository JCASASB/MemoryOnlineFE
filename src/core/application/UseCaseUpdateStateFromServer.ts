import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseUpdateStateFromServer {
  constructor(private readonly repository: GameRepository) {}

  async execute(newState: GameState): Promise<GameState> {
    await this.repository.save(newState);
    return newState;
  }
}

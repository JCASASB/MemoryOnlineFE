import type { GameRepository } from "../domain/repositories/GameRepository";
import type { Game } from "../domain/entities/Game";

export class UseCaseUpdateStateFromServer {
  constructor(private readonly repository: GameRepository) {}

  async execute(newState: Game): Promise<Game> {
    await this.repository.save(newState);
    return newState;
  }
}

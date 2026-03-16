import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseCheckCards {
  constructor(private readonly repository: GameRepository) {}

  async execute(): Promise<GameState> {
    const game = this.repository.getGame();

    game.checkMatch();
    this.repository.save(game);
    await this.repository.updateStateToServer(game);

    return { ...game } as GameState;
  }
}

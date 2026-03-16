import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseFlipCard {
  constructor(private readonly repository: GameRepository) {}

  async execute(cardId: string, playerName: string): Promise<GameState> {
    const game = this.repository.getGame();

    if (game.canClick(playerName)) {
      game.flipCard(cardId);

      this.repository.save(game);

      this.repository.updateStateToServer(game);
    }

    return { ...game } as GameState;
  }
}

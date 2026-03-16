import type { GameRepository } from "../domain/repositories/GameRepository";
import { Game } from "../domain/entities/Game";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseFlipCard {
  constructor(private readonly repository: GameRepository) {}

  async execute(cardId: string, playerId: string): Promise<GameState> {
    const state = this.repository.getState();

    let game = new Game(
      state.id,
      state.name,
      state.level,
      state.players[0]?.name || "",
    );
    game.cards = state.cards;
    game.players = state.players;
    game.isProcessing = state.isProcessing;

    if (game.canClick(playerId)) {
      game = game.flipCard(cardId);

      this.repository.save(game);

      this.repository.updateStateToServer(game);
    }

    return game;
  }
}

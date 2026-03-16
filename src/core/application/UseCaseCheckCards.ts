import type { GameRepository } from "../domain/repositories/GameRepository";
import { Game } from "../domain/entities/Game";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseCheckCards {
  constructor(private readonly repository: GameRepository) {}

  async execute(): Promise<GameState> {
    const state = this.repository.getState();

    const game = new Game(
      state.id,
      state.name,
      state.level,
      state.players[0]?.name || "",
    );
    game.cards = state.cards;
    game.players = state.players;
    game.isProcessing = state.isProcessing;

    game.checkMatch();
    this.repository.save(game);
    await this.repository.updateStateToServer(game);

    return game;
  }
}

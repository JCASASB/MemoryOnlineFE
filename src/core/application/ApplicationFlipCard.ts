import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";
import type { UseCaseFlipCard } from "../domain/useCases/UseCaseFlipCard";

export class ApplicationFlipCard {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseFlipCard,
  ) {}

  async execute(cardId: string, playerName: string): Promise<Game> {
    const state = this.repository.getLastState();

    const playerId = state.players.find((p) => p.name === playerName)?.id;

    if (!playerId) {
      throw new Error(`Player with name ${playerName} not found in game state`);
    }

    const game = this.useCase.execute(state, cardId, playerId);

    if (game) {
      this.repository.save(game);

      await this.repository.updateStateToServer(game);
      return game;
    } else {
      return state;
    }
  }
}

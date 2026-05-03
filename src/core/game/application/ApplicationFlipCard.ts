import type { GameRepositoryType } from "../repository/GameRepositoryType";
import type { UseCaseFlipCard } from "../domain/useCases/UseCaseFlipCard";

export class ApplicationFlipCard {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseFlipCard,
  ) {}

  async execute(cardId: string, playerId: string): Promise<number> {
    const state = await this.repository.getLastStateFromQueue();

    if (!state) {
      throw new Error("Game state not found");
    }

    const player = state.players.find((p) => p.id === playerId);

    if (!player) {
      throw new Error(`Player with id ${playerId} not found in game state`);
    }

    const game = this.useCase.execute(state, cardId, playerId);

    if (game) {
      await this.repository.saveStateToQueue(game);
      await this.repository.updateStateToServer(game);
      return game.version;
    } else {
      return state.version;
    }
  }
}

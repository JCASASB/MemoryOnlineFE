import type { GameRepositoryType } from "../repository/GameRepositoryType";
import type { UseCaseFlipCard } from "../domain/useCases/UseCaseFlipCard";

export class ApplicationFlipCard {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseFlipCard,
  ) {}

  async execute(cardId: string, playerName: string): Promise<number> {
    const state = await this.repository.getLastStateFromQueue();
    console.log("state in application flip card:", state);
    if (!state) {
      throw new Error("Game state not found");
    }

    const playerId = state.players.find((p) => p.name === playerName)?.id;

    console.log("this is the playerId, cardId:", playerId, cardId);

    if (!playerId) {
      throw new Error(`Player with name ${playerName} not found in game state`);
    }
    console.log("game before use case flip card:", state);

    const game = this.useCase.execute(state, cardId, playerId);
    console.log("game after use case flip card:", game);
    if (game) {
      await this.repository.saveStateToQueue(game);
      await this.repository.updateStateToServer(game);
      return game.version;
    } else {
      return state.version;
    }
  }
}

import type { GameRepository } from "../domain/repositories/GameRepository";
import type { UseCaseFlipCard } from "../domain/useCases/UseCaseFlipCard";

export class ApplicationFlipCard {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseFlipCard,
  ) {}

  async execute(cardId: string, playerName: string): Promise<number> {
    const state = await this.repository.getState();

    console.log("this is the playerName, cardId:", playerName, cardId);

    const playerId = state.players.find((p) => p.name === playerName)?.id;

    //   console.log("this is the playerId, cardId:", playerId, cardId);

    if (!playerId) {
      throw new Error(`Player with name ${playerName} not found in game state`);
    }

    const game = this.useCase.execute(state, cardId, playerId);

    if (game) {
      await this.repository.save(game);
      await this.repository.updateStateToServer(game);
      return game.version;
    } else {
      return state.version;
    }
  }
}

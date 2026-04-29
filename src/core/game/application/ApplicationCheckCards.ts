import type { Game } from "../domain/entities/Game";
import { StateCard } from "../domain/entities/StateCard";
import type { GameRepositoryType } from "../repository/GameRepositoryType";
import type { UseCaseCheckCards } from "../domain/useCases/UseCaseCheckCards";

export class ApplicationCheckCards {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseCheckCards,
  ) {}

  async execute(stateVersion: number): Promise<number> {
    const state = await this.repository.getGameFromVersion(stateVersion);

    if (state) {
      const game = this.useCase.execute(state);

      if (game) {
        await this.repository.updateStateToServer(game);
        await this.repository.save(game);
      }

      return game ? game.version : state.version;
    }
    return stateVersion;
  }

  getCardsRevealedAndNotMatched(game: Game): string[] {
    return game.cards
      .filter((c) => c.state === StateCard.FaceUp)
      .map((c) => c.id);
  }
}

import type { Game } from "../domain/entities/Game";
import { StateCard } from "../domain/entities/StateCard";
import type { GameRepository } from "../domain/repositories/GameRepository";
import type { UseCaseCheckCards } from "../domain/useCases/UseCaseCheckCards";

export class ApplicationCheckCards {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseCheckCards,
  ) {}

  async execute(stateVersion: number): Promise<number> {
    const state = await this.repository.justGetVersionState(stateVersion);

    if (state) {
      const game = this.useCase.execute(state);
      console.log("Juego actualizado antes de checkCards:", game);
      if (game) {
        console.log("Juego actualizado después de checkCards:", game);
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

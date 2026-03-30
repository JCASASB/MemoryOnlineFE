import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";
import type { UseCaseCheckCards } from "../domain/useCases/UseCaseCheckCards";

export class ApplicationCheckCards {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseCheckCards,
  ) {}

  async execute(): Promise<Game> {
    const state = this.repository.getLastState();

    const game = this.useCase.execute(state);

    this.repository.save(game);

    return game;
  }
}

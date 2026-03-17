import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";
import type { UseCaseCheckCards } from "../domain/useCases/UseCaseCheckCards";

export class ApplicationCheckCards {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseCheckCards,
  ) {}

  async execute(): Promise<GameState> {
    const state = this.repository.getState();

    const gameState = this.useCase.execute(state);

    this.repository.save(gameState);

    return gameState;
  }
}

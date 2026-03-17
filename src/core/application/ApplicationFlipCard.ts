import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";
import type { UseCaseFlipCard } from "../domain/useCases/UseCaseFlipCard";

export class ApplicationFlipCard {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseFlipCard,
  ) {}

  async execute(cardId: string, playerName: string): Promise<GameState> {
    const state = this.repository.getState();

    const gameState = this.useCase.execute(state, cardId, playerName);

    this.repository.save(gameState);

    await this.repository.updateStateToServer(gameState);

    return gameState;
  }
}

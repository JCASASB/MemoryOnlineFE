import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";
import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";

export class ApplicationCreateGame {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(
    level: number,
    gameName: string,
    playerName: string,
  ): Promise<GameState> {
    await this.repository.connectHub();

    const gameState = this.useCase.execute(level, gameName, playerName);

    this.repository.save(gameState);

    await this.repository.createGameToServer(gameState);

    return gameState;
  }
}

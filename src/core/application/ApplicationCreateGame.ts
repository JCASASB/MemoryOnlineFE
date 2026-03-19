import type { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";
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
  ): Promise<Game> {
    await this.repository.connectHub();

    const game = this.useCase.execute(level, gameName, playerName);

    this.repository.save(game);

    await this.repository.createGameToServer(game);

    return game;
  }
}

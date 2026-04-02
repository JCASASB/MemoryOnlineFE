import type { GameRepository } from "../domain/repositories/GameRepository";
import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";

export class ApplicationCreateGame {
  constructor(
    private readonly repository: GameRepository,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(level: number, gameName: string): Promise<number> {
    await this.repository.connectHub();

    const game = this.useCase.execute(level, gameName);

    this.repository.save(game);

    await this.repository.createGameToServer(game);

    return game.version;
  }
}

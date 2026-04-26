import type { GameRepositoryType } from "../repository/GameRepositoryType";
import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";

export class ApplicationCreateGame {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(level: number, gameName: string): Promise<void> {
    const game = this.useCase.execute(level, gameName);

    this.repository.save(game);

    await this.repository.createGameToServer(game);
  }
}

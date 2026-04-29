import type { GameRepositoryType } from "../repository/GameRepositoryType";
import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";

export class ApplicationCreateGame {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(level: number, gameName: string): Promise<void> {
    const game = this.useCase.execute(level, gameName);

    this.repository.saveStateToQueue(game);

    //dejamos que lo haga el timer
    //await this.repository.processStateFromQueue();

    await this.repository.createGameToServer(game);
  }
}

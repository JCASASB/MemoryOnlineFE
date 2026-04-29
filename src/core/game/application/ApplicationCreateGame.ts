import type { GameRepositoryType } from "../repository/GameRepositoryType";
import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";

export class ApplicationCreateGame {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(level: number, gameName: string): Promise<void> {
    const game = this.useCase.execute(level, gameName);

    await this.repository.createGameToServer(game);

    const matchId = await this.repository.getMatchIdFromServer(gameName);

    await this.repository.setMatchId(matchId);

    this.repository.saveStateToQueue(game);

    //dejamos que lo haga el timer
    //await this.repository.processStateFromQueue();
  }
}

import type { GameRepositoryType } from "../repository/GameRepositoryType";
import type { UseCaseJoinMatch } from "../domain/useCases/UseCaseJoinMatch";
import type { ApplicationHubPort } from "../../domain/ports/GameHubPort";

export class ApplicationJoinGameByMatchId {
  constructor(
    private readonly signalRService: ApplicationHubPort,
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseJoinMatch,
  ) {}

  async execute(
    matchId: string,
    playerName: string,
    playerId: string,
  ): Promise<void> {
    await this.repository.clearMatch();

    await this.repository.setMatchId(matchId);

    const states = await this.signalRService.getServerStatesFromVersion(
      matchId,
      0,
    );

    await this.repository.addStatesToTheQueue(states ?? []);

    const lastState = await this.repository.getLastStateFromQueue();

    if (!lastState) {
      throw new Error("Game state not found");
    }

    const newState = this.useCase.execute(lastState, playerName, playerId);

    await this.repository.saveStateToQueue(newState);

    await this.signalRService.sendJoinGame(matchId);

    await this.signalRService.sendUpdateStateGame(newState, matchId);
  }
}

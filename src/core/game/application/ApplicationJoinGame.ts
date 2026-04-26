import type { GameRepositoryType } from "../repository/GameRepositoryType";
import type { UseCaseJoinMatch } from "../domain/useCases/UseCaseJoinMatch";

export class ApplicationJoinGame {
  constructor(
    private readonly repository: GameRepositoryType,
    private readonly useCase: UseCaseJoinMatch,
  ) {}

  async execute(gameName: string, playerName: string): Promise<void> {
    const matchId = await this.repository.getMatchIdFromServer(gameName);

    await this.repository.setMatchId(matchId);

    const states = await this.repository.getServerStatesFromVersion(matchId, 0);

    await this.repository.addStatesToTheQueue(states);

    const lastState = await this.repository.getLastStateFromQueue();

    const newState = this.useCase.execute(lastState, playerName);

    await this.repository.save(newState);

    await this.repository.joinGameToServer(matchId);
    //console.log("New state after joining game:", newState);
    await this.repository.updateStateToServer(newState);
  }
}

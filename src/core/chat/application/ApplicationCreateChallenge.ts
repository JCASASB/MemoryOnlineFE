import type { ApplicationHubPort } from "../../domain/ports/GameHubPort";
import type { UseCaseCreateChallenge } from "../domain/useCases/UseCaseCreateChallenge";

export class ApplicationCreateChallenge {
  constructor(
    private readonly signalRService: ApplicationHubPort,
    private readonly useCase: UseCaseCreateChallenge,
  ) {}

  async execute(
    matchId: string,
    player1Id: string,
    player2Id: string,
  ): Promise<void> {
    const challenge = this.useCase.execute(matchId, player1Id, player2Id);

    await this.signalRService.createChallengeToServer(challenge);
  }
}

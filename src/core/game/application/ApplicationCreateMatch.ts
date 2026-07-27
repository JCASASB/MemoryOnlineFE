import { UseCaseCreateGame } from "../domain/useCases/UseCaseCreateGame";
import type { Game } from "../domain/entities/Game";
import type { ApplicationHubPort } from "../../domain/ports/GameHubPort";

export class ApplicationCreateMatch {
  constructor(
    private readonly signalRService: ApplicationHubPort,
    private readonly useCase: UseCaseCreateGame,
  ) {}

  async execute(level: number, gameName: string): Promise<Game> {
    const game = this.useCase.execute(level, gameName);

    await this.signalRService.sendCreateGame(game);

    return game;

    //dejamos que lo haga el timer
    //await this.repository.processStateFromQueue();
  }
}

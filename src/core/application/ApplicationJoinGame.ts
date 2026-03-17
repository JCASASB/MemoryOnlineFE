import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationJoinGame {
  constructor(private readonly repository: GameRepository) {}

  async execute(gameName: string, playerName: string): Promise<void> {
    await this.repository.connectHub();

    await this.repository.joinGameToServer(gameName, playerName);
  }
}

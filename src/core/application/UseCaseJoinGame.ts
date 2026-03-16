import type { GameRepository } from "../domain/repositories/GameRepository";

export class UseCaseJoinGame {
  constructor(private readonly repository: GameRepository) {}

  async execute(gameName: string, playerName: string): Promise<void> {
    await this.repository.connect();

    await this.repository.joinGameToServer(gameName, playerName);
  }
}

import type { Player } from "../domain/entities/Player";
import type { GameRepository } from "../domain/repositories/GameRepository";

export class ApplicationCreateGame {
  constructor(private readonly repository: GameRepository) {}

  async execute(playerName: string): Promise<Player> {
    const player = this.repository.connectAndInitializeHub();

    return player;
  }
}

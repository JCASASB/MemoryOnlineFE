import { v4 as uuidv4 } from "uuid";
import { Game } from "../domain/entities/Game";
import type { GameRepository } from "../domain/repositories/GameRepository";
import type { GameState } from "../domain/entities/GameState";

export class UseCaseCreateGame {
  constructor(private readonly repository: GameRepository) {}

  async execute(
    level: number,
    gameName: string,
    playerName: string,
  ): Promise<GameState> {
    const gameId = uuidv4();
    const game = new Game(gameId, gameName, level, playerName);

    await this.repository.connect();

    this.repository.save(game);
    await this.repository.createGameToServer(game);

    return game;
  }
}

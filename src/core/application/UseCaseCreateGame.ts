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
    await this.repository.connect();

    const game = new Game(gameName, level);

    game.addPlayer(playerName);

    console.log(`[Sigtes:`, JSON.stringify(game));

    this.repository.save(game);

    await this.repository.createGameToServer(game);

    return game;
  }
}

import { Game } from "../entities/Game";

import { v4 as uuidv4 } from "uuid";

export class UseCaseCreateGame {
  execute(level: number, gameName: string): Game {
    const game = new Game(uuidv4(), gameName, level, 0, [], []);

    return {
      id: game.id,
      name: game.name,
      level: game.level,
      version: game.version + 1,
      cards: game.cards,
      players: game.players,
    } as Game;
  }
}

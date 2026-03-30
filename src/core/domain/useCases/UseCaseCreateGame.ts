import { Game } from "../entities/Game";
import { Player } from "../entities/Player";
import { v4 as uuidv4 } from "uuid";

export class UseCaseCreateGame {
  execute(level: number, gameName: string, playerName: string): Game {
    const player = new Player(uuidv4(), playerName, 2, 0, 0, false);

    const players: Player[] = [player];

    const game = new Game(uuidv4(), gameName, level, 0, false, [], players);

    return {
      id: game.id,
      name: game.name,
      level: game.level,
      version: game.version + 1,
      cards: game.cards,
      players: game.players,
      isProcessing: game.isProcessing,
    } as Game;
  }
}

import { Game } from "../entities/Game";
import { Player } from "../entities/Player";

import { v4 as uuidv4 } from "uuid";

export class UseCaseJoinMatch {
  execute(game: Game, playerName: string, playerId: string): Game {
    const countPlayers = game.players.length;

    const player = new Player(
      playerId,
      playerName,
      countPlayers,
      2,
      0,
      0,
      countPlayers === 1,
    );

    return {
      id: uuidv4(),
      name: game.name,
      level: game.level,
      version: game.version + 1,
      cards: game.cards,
      players: [...game.players, player],
    } as Game;
  }
}

import { Game } from "../domain/entities/Game";
import { Card } from "../domain/entities/Card";
import type { GameState } from "../domain/entities/GameState";

export function cloneAndOverride(
  gameObj: Game,
  toOverride: Partial<GameState>,
): Game {
  const validFields = ["id", "name", "cards", "players", "isProcessing"];
  Object.keys(toOverride).forEach((key) => {
    if (!validFields.includes(key)) {
      console.warn(
        `[Game.cloneAndOverride] Campo desconocido ignorado: ${key}`,
      );
    }
  });

  const id = toOverride.id !== undefined ? toOverride.id : (gameObj as any).id;
  const name =
    toOverride.name !== undefined ? toOverride.name : (gameObj as any).name;
  const cardsRaw =
    toOverride.cards !== undefined ? toOverride.cards : gameObj.cards;
  const cards = cardsRaw.map(
    (c: Card) => new Card(c.id, c.value, c.isFlipped, c.isMatched),
  );
  const players =
    toOverride.players !== undefined ? toOverride.players : gameObj.players;
  const isProcessing =
    toOverride.isProcessing !== undefined
      ? toOverride.isProcessing
      : gameObj.isProcessing;

  // Crear nueva instancia y preservar id
  const level = (gameObj as any).level ?? 0;
  const newGame = new Game(id || "", name, level);

  newGame.cards = cards;
  newGame.players = players;
  newGame.isProcessing = isProcessing;

  return newGame;
}

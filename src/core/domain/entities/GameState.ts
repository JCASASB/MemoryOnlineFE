import { Card } from "./Card";
import type { Player } from "./Player";

export interface GameState {
  id: string;
  name: string;
  level: number;
  cards: Card[];
  isProcessing: boolean;
  players: Player[];
  canClick(playerId: string): boolean;
}

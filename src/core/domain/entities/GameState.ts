import { Card } from "./Card";
import type { Player } from "./Player";

export interface GameState {
  id: string;
  name: string;
  level: number;
  isProcessing: boolean;
  cards: Card[];
  players: Player[];
}

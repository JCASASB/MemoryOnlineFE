import { Card } from './Card';

export interface GameState {
  cards: Card[];
  moves: number;
  isProcessing: boolean;
}

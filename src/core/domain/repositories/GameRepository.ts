import type { GameState } from '../entities/GameState';

export interface GameRepository {
  save(state: GameState): void;
  getState(): GameState;
  subscribe(listener: () => void): () => void;
}

import type { GameState } from '../entities/GameState';

export interface GameRepository {
  save(state: GameState): void;
  setLevel(level: number): void;
  getState(): GameState;
  subscribe(listener: () => void): () => void;
}

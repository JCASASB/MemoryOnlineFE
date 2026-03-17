import type { GameState } from "../entities/GameState";

export interface GameRepository {
  save(state: GameState): void;
  getState(): GameState;
  getVersion(): number;
  subscribe(listener: () => void): () => void;
  connectHub(): void;
  updateStateToServer(state: GameState): Promise<void>;
  joinGameToServer(gameId: string, playerName: string): Promise<void>;
  createGameToServer(state: GameState): Promise<void>;
}

import type { Game } from "../entities/Game";

export interface GameRepository {
  save(state: Game): void;
  getState(): Game;
  getVersion(): number;
  subscribe(listener: () => void): () => void;
  connectHub(): void;
  updateStateToServer(state: Game): Promise<void>;
  joinGameToServer(gameName: string, playerName: string): Promise<void>;
  createGameToServer(state: Game): Promise<void>;
}

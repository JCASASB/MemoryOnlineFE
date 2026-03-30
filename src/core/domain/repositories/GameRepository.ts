import type { Game } from "../entities/Game";

export interface GameRepository {
  save(state: Game): void;
  getLastState(): Game;
  goToVersionState(stateVersion: number): Game;
  getVersion(): number;
  subscribeToVersion(callback: () => void): () => void;
  getConnectionStatus(): number;
  subscribeToStatus(callback: () => void): () => void;
  connectHub(): void;
  updateStateToServer(state: Game): Promise<void>;
  joinGameToServer(gameName: string, playerName: string): Promise<void>;
  createGameToServer(state: Game): Promise<void>;
}

import type { Game } from "../entities/Game";

export interface GameRepository {
  save(state: Game): void;
  getState(): Game;
  goToNextVersionState(): Game | undefined;
  justGetVersionState(stateVersion: number): Game | undefined;
  goToVersionState(stateVersion: number): Game | undefined;
  getVersion(): number;
  subscribeToVersion(callback: () => void): () => void;
  getConnectionStatus(): number;
  subscribeToStatus(callback: () => void): () => void;
  connectHub(): Promise<void>;
  updateStateToServer(state: Game): Promise<void>;
  joinGameToServer(gameName: string, playerName: string): Promise<void>;
  createGameToServer(state: Game): Promise<void>;

  removeAnimationInProgress(animationIds: string[]): Promise<void>;
  addAnimationInProgress(animationId: string): Promise<void>;
  areAnimationsInProgress(): boolean;
}

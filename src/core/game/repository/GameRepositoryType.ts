import type { Game } from "../domain/entities/Game";

export interface GameRepositoryType {
  save(state: Game): void;
  addStatesToTheQueue(states: Game[]): void;
  getState(): Promise<Game | undefined>;
  getLastStateFromQueue(): Promise<Game | undefined>;
  goToNextVersionState(): Game | undefined;
  getGameFromVersion(stateVersion: number): Promise<Game | undefined>;
  getVersion(): number;
  subscribeToVersion(callback: () => void): () => void;
  getConnectionStatus(): number;
  subscribeToStatus(callback: () => void): () => void;
  connectHub(): Promise<void>;
  updateStateToServer(state: Game): Promise<void>;
  joinGameToServer(matchId: string): Promise<void>;
  createGameToServer(state: Game): Promise<void>;
  getMatchIdFromServer(gameName: string): Promise<string>;
  getServerStatesFromVersion(matchId: string, version: number): Promise<Game[]>;
  removeAnimationInProgress(animationIds: string[]): Promise<void>;
  addAnimationInProgress(animationId: string): Promise<void>;
  areAnimationsInProgress(): boolean;
  setMatchId(matchId: string): void;
  existsNewVersionState(): Promise<boolean>;
}

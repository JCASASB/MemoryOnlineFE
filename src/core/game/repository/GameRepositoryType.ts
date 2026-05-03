import type { Game } from "../domain/entities/Game";

export interface GameRepositoryType {
  saveStateToQueue(state: Game): void;
  processStateFromQueue(): Promise<Game | undefined>;
  addStatesToTheQueue(states: Game[]): void;
  getLastStateFromQueue(): Promise<Game | undefined>;
  goToNextVersionState(): Promise<Game | undefined>;
  goToLastAppliedState(): Promise<Game | undefined>;
  getGameFromVersion(stateVersion: number): Promise<Game | undefined>;
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

  savePlayerName(name: string): void;
  getPlayerName(): string;
  setMatchId(matchId: string): Promise<void>;
  savePlayerId(id: string): void;
  getPlayerId(): string;
}

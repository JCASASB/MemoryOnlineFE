import type { Game } from "../domain/entities/Game";
import type { Challenge } from "../../chat/domain/entities/Challenge";

export interface GameRepositoryType {
  saveStateToQueue(state: Game): void;
  processStateFromQueue(): Promise<Game | undefined>;
  addStatesToTheQueue(states: Game[]): void;
  getLastStateFromQueue(): Promise<Game | undefined>;
  goToNextVersionState(): Promise<Game | undefined>;
  goToLastAppliedState(): Promise<Game | undefined>;
  getGameFromVersion(stateVersion: number): Promise<Game | undefined>;
  subscribeToVersion(callback: () => void): () => void;
  removeAnimationInProgress(animationIds: string[]): void;
  addAnimationInProgress(animationId: string): void;
  areAnimationsInProgress(): boolean;
  clearAll(): Promise<void>;
  clearMatch(): Promise<void>;

  savePlayerName(name: string): void;
  getPlayerName(): string;
  setMatchId(matchId: string): Promise<void>;
  savePlayerId(id: string): void;
  getPlayerId(): string;
  getMatchId(): Promise<string>;

  getChallenges(): Challenge[];
  subscribeToChallenges(callback: (challenge: Challenge) => void): () => void;
}

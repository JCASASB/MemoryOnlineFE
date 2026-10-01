import type { ChatMessage } from "../../chat/domain/entities/ChatMessage";
import type { Challenge } from "../../chat/domain/entities/Challenge";
import type { Game } from "../../game/domain/entities/Game";

/**
 * interfaz de la comunicacion signalr
 */
export interface ApplicationHubPort {
  sendUpdateStateGame(game: Game, matchId: string): Promise<void>;
  sendCreateGame(game: Game): Promise<void>;
  sendJoinGame(matchId: string): Promise<void>;
  getMatchIdFromServer(gameName: string): Promise<string | undefined>;
  getServerStatesFromVersion(
    matchId: string,
    version: number,
  ): Promise<Game[] | undefined>;

  sendChatMessage(message: ChatMessage): Promise<void>;
  createChallengeToServer(challenge: Challenge): Promise<void>;

  //listeners
  registerUpdateStatesCallback(callback: (games: Game[]) => void): () => void;
  registerChallengeReceivedCallback(
    callback: (challenge: Challenge) => void,
  ): () => void;
  registerStatusChangedCallback(callback: (status: number) => void): () => void;
  registerChatMessagesReceivedCallback(
    callback: (message: ChatMessage) => void,
  ): () => void;

  getStatus(): number;

  disconnect(): Promise<void>;
}

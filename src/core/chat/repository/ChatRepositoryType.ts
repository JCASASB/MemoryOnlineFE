import type { ChatMessage } from "../domain/entities/ChatMessage";

export interface ChatRepositoryType {
  getChatMessages(): ChatMessage[];
  subscribeToNumMessages(callback: (count: number) => void): () => void;
  getLastSeenMessageId(): string | null;
}

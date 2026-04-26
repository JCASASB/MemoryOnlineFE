import type { ChatMessage } from "../domain/entities/ChatMessage";

export interface ChatRepositoryType {
  connect(): Promise<void>;
  sendChatMessageToServer(message: string, playerName: string): Promise<void>;
  getChatMessages(): ChatMessage[];
  subscribeToChatMessages(callback: (message: ChatMessage) => void): () => void;
  getUnreadCount(): number;
  markAllAsRead(): void;
  setChatViewActive(isActive: boolean): void;
  subscribeToUnreadCount(callback: (count: number) => void): () => void;
  getLastSeenMessageId(): string | null;
}

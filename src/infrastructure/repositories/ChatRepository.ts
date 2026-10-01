import { ChatMessage } from "../../core/chat/domain/entities/ChatMessage";
import type { ChatRepositoryType } from "../../core/chat/repository/ChatRepositoryType";
import { SignalRGameHub } from "../signalr/SignalRGameHub";

/**
 * Implementación de ChatRepository que usa una conexión propia de SignalR.
 * Gestiona los mensajes de chat globales de forma independiente al repositorio
 * del juego, siguiendo el principio de responsabilidad única.
 */
export class ChatRepository implements ChatRepositoryType {
  private messages: ChatMessage[] = [];
  private numMessages = 0;
  private numMessagesSubscribers: Array<(count: number) => void> = [];
  private lastSeenMessageId: string | null = null;

  constructor() {
    const hub = SignalRGameHub.getInstance();

    hub.registerChatMessagesReceivedCallback((message: ChatMessage) => {
      this.messages = [...this.messages, message];
      this.numMessages += 1;
      this.notifyNumMessagesSubscribers();
    });
  }

  getChatMessages(): ChatMessage[] {
    return this.messages;
  }

  private notifyNumMessagesSubscribers(): void {
    this.numMessagesSubscribers.forEach((cb) => cb(this.numMessages));
  }

  subscribeToNumMessages(callback: (count: number) => void): () => void {
    this.numMessagesSubscribers.push(callback);
    callback(this.numMessages);
    return () => {
      this.numMessagesSubscribers = this.numMessagesSubscribers.filter(
        (cb) => cb !== callback,
      );
    };
  }

  getLastSeenMessageId(): string | null {
    return this.lastSeenMessageId;
  }
}

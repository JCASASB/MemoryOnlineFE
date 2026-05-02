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
  private subscribers: Array<(msg: ChatMessage) => void> = [];
  private unreadSubscribers: Array<(count: number) => void> = [];
  private hub?: SignalRGameHub;
  private connected = false;
  private connectedToken = "";
  private unreadCount = 0;
  private isChatViewActive = false;
  private lastSeenMessageId: string | null = null;

  constructor(private readonly hubUrl: string) {}

  async connect(): Promise<void> {
    const token = localStorage.getItem("auth-jbearer-token") ?? "";

    // Si el token cambió desde la última conexión, forzar reconexión
    if (this.connected && this.connectedToken !== token) {
      this.connected = false;
      this.hub = undefined;
    }

    if (this.connected) return;

    this.connectedToken = token;
    this.hub = SignalRGameHub.getInstance(this.hubUrl, token);

    this.hub.onChatMessage((payload) => {
      const msg = new ChatMessage(
        crypto.randomUUID(),
        payload.playerName,
        payload.message,
        payload.sentAtUtc,
      );
      this.messages = [...this.messages, msg];

      if (!this.isChatViewActive) {
        this.unreadCount += 1;
        this.notifyUnreadSubscribers();
      } else {
        this.lastSeenMessageId = msg.id;
      }

      this.subscribers.forEach((cb) => cb(msg));
    });

    await this.hub.connect();
    this.connected = true;
  }

  async sendChatMessageToServer(
    message: string,
    playerName: string,
  ): Promise<void> {
    if (!this.connected) await this.connect();
    await this.hub!.sendChatMessage(playerName, message);
  }

  getChatMessages(): ChatMessage[] {
    return this.messages;
  }

  subscribeToChatMessages(
    callback: (message: ChatMessage) => void,
  ): () => void {
    this.subscribers.push(callback);
    // Disparar conexión lazy al suscribirse (token ya disponible si el usuario está logueado)
    void this.connect().catch((err) =>
      console.error("[ChatRepository] Error conectando al suscribirse:", err),
    );
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  markAllAsRead(): void {
    if (this.unreadCount === 0) return;
    this.unreadCount = 0;
    this.notifyUnreadSubscribers();
  }

  setChatViewActive(isActive: boolean): void {
    this.isChatViewActive = isActive;

    if (isActive) {
      this.markAllAsRead();
      const latestMessage = this.messages[this.messages.length - 1];
      this.lastSeenMessageId = latestMessage?.id ?? this.lastSeenMessageId;
    }
  }

  subscribeToUnreadCount(callback: (count: number) => void): () => void {
    this.unreadSubscribers.push(callback);
    callback(this.unreadCount);

    return () => {
      this.unreadSubscribers = this.unreadSubscribers.filter(
        (cb) => cb !== callback,
      );
    };
  }

  private notifyUnreadSubscribers(): void {
    this.unreadSubscribers.forEach((cb) => cb(this.unreadCount));
  }

  getLastSeenMessageId(): string | null {
    return this.lastSeenMessageId;
  }
}

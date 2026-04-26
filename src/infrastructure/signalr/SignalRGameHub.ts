import * as signalR from "@microsoft/signalr";
import { Game } from "../../core/game/domain/entities/Game";

export type ChatMessagePayload = {
  playerName: string;
  message: string;
  sentAtUtc: string;
};

export class SignalRGameHub {
  private static instance: SignalRGameHub | null = null;
  private static instanceKey = "";

  static getInstance(hubUrl: string, tokenJWT: string): SignalRGameHub {
    const nextKey = `${hubUrl}::${tokenJWT}`;

    if (!SignalRGameHub.instance || SignalRGameHub.instanceKey !== nextKey) {
      SignalRGameHub.instance = new SignalRGameHub(hubUrl, tokenJWT);
      SignalRGameHub.instanceKey = nextKey;
    }

    return SignalRGameHub.instance;
  }

  private connection: signalR.HubConnection;

  // Handlers para evitar el error de "método no encontrado"
  private onSetConnectionStatusCallback?: (status: number) => void;
  private onUpdateStatesCallback?: (games: Game[]) => void;
  private onChatMessageCallback?: (message: ChatMessagePayload) => void;

  private constructor(hubUrl: string, tokenJWT: string) {
    console.log("Initializing SignalRGameHub with token:", tokenJWT);
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => tokenJWT,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.connection.on("Error", (message: unknown) => {
      console.error("[SignalR] Server Error:", message);
    });

    this.connection.on("UpdateStatesFromServer", (gamesPayload: Game[]) => {
      if (this.onUpdateStatesCallback) {
        this.onUpdateStatesCallback(gamesPayload);
      }
    });

    this.connection.on("LogFromServer", (message: string) => {
      console.log(`[SignalR] Log: ${message}`);
    });

    this.connection.on("ChatMessageReceived", (payload: unknown) => {
      const chat = payload as {
        playerName?: string;
        PlayerName?: string;
        message?: string;
        Message?: string;
        sentAtUtc?: string;
        SentAtUtc?: string;
      };

      const normalized: ChatMessagePayload = {
        playerName: chat.playerName ?? chat.PlayerName ?? "UnknownUser",
        message: chat.message ?? chat.Message ?? "",
        sentAtUtc: chat.sentAtUtc ?? chat.SentAtUtc ?? new Date().toISOString(),
      };

      this.onChatMessageCallback?.(normalized);
    });

    this.setupLoggers();
  }
  async disconnect(): Promise<void> {
    await this.connection.stop();
  }

  async sendUpdateStateGame(game: Game, matchId: string): Promise<void> {
    console.log("Sending game state update to server for matchId:", game);
    await this.connection.invoke("UpdateGameState", game, matchId);
  }

  async sendCreateGame(game: Game): Promise<void> {
    await this.connection.invoke("CreateGame", game);
  }

  async sendJoinGame(matchId: string): Promise<void> {
    await this.connection.invoke("JoinGame", matchId);
  }

  async getMatchIdFromServer(gameName: string): Promise<string> {
    return await this.connection.invoke("GetMatchIdFromName", gameName);
  }

  async getServerStatesFromVersion(
    matchId: string,
    version: number,
  ): Promise<Game[]> {
    return await this.connection.invoke(
      "GetStatesFromVersion",
      matchId,
      version,
    );
  }

  async sendChatMessage(playerName: string, message: string): Promise<void> {
    try {
      await this.connection.invoke("SendMessage", playerName, message);
    } catch {
      await this.connection.invoke("SendChatMessage", playerName, message);
    }
  }

  private setupLoggers() {
    this.connection.onreconnecting((err) => {
      this.onSetConnectionStatusCallback?.(1);
      console.warn("[SignalR] Reconectando...", err);
    });
    this.connection.onreconnected((id) => {
      this.onSetConnectionStatusCallback?.(2);
      console.log("[SignalR] Reconectado:", id);
    });
    this.connection.onclose((err) => {
      this.onSetConnectionStatusCallback?.(0);
      console.log("[SignalR] Conexión cerrada", err);
    });
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        this.onSetConnectionStatusCallback?.(2);
        console.log(
          "[SignalR] Conectado con ID:",
          this.connection.connectionId,
        );
      } catch (err) {
        console.error("[SignalR] Error al conectar:", err);
        throw err;
      }
    }
  }

  setConnectionStatus(callback: (status: number) => void): void {
    this.onSetConnectionStatusCallback = callback;
  }

  onUpdateStates(callback: (games: Game[]) => void): void {
    this.onUpdateStatesCallback = callback;
  }

  onChatMessage(callback: (message: ChatMessagePayload) => void): void {
    this.onChatMessageCallback = callback;
  }

  offAll(): void {
    this.onUpdateStatesCallback = undefined;
    // Si quieres dejar de escuchar físicamente:
    this.connection.off("GameStateUpdated");
    this.connection.off("ChatMessageReceived");
    this.connection.off("LogFromServer");
    this.connection.off("Error");
    this.connection.off("reconnecting");
    this.connection.off("reconnected");
    this.connection.off("close");
  }
}

import * as signalR from "@microsoft/signalr";
import type { GameHubPort } from "../../core/domain/ports/GameHubPort";
import { Game } from "../../core/domain/entities/Game";

export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;

  // Handlers para evitar el error de "método no encontrado"
  private onGameUpdatedCallback?: (gameJson: string) => void;
  private setConnectionStatusCallback?: (status: number) => void;

  constructor(hubUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.connection.on("Error", (message: any) => {
      console.error("[SignalR] Server Error:", message);
    });

    this.connection.on("GameStateUpdated", (gameString: string) => {
      if (this.onGameUpdatedCallback) {
        this.onGameUpdatedCallback(gameString);
      }
    });

    this.connection.on("LogFromServer", (message: string) => {
      console.log(`[SignalR] Log: ${message}`);
    });

    this.setupLoggers();
  }
  async disconnect(): Promise<void> {
    await this.connection.stop();
  }

  async sendUpdateStateGame(game: Game): Promise<void> {
    console.log(`[SignalR] >>> Enviando UpdateGameState: `, game);
    await this.connection.invoke("UpdateGameState", game);
  }

  async sendCreateGame(game: Game): Promise<void> {
    await this.connection.invoke("CreateGame", game);
  }

  async sendJoinGame(gameName: string, playerName: string): Promise<void> {
    await this.connection.invoke("JoinGame", playerName, gameName);
  }

  private setupLoggers() {
    this.connection.onreconnecting((err) => {
      this.setConnectionStatusCallback?.(1);
      console.warn("[SignalR] Reconectando...", err);
    });
    this.connection.onreconnected((id) => {
      this.setConnectionStatusCallback?.(2);
      console.log("[SignalR] Reconectado:", id);
    });
    this.connection.onclose((err) => {
      this.setConnectionStatusCallback?.(0);
      console.log("[SignalR] Conexión cerrada", err);
    });
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        this.setConnectionStatusCallback?.(2);
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

  onRemoteGameUpdated(callback: (gameJson: string) => void): void {
    this.onGameUpdatedCallback = callback;
  }

  setConnectionStatus(callback: (status: number) => void): void {
    this.setConnectionStatusCallback = callback;
  }

  offAll(): void {
    this.onGameUpdatedCallback = undefined;
    // Si quieres dejar de escuchar físicamente:
    this.connection.off("GameStateUpdated");
    this.connection.off("cardFlipped");
    this.connection.off("LogFromServer");
    this.connection.off("Error");
    this.connection.off("reconnecting");
    this.connection.off("reconnected");
    this.connection.off("close");
  }
}

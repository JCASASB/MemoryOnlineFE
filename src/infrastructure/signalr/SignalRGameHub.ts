import * as signalR from "@microsoft/signalr";
import type { GameHubPort } from "../../core/domain/ports/GameHubPort";
import type { GameState } from "../../core/domain/entities/GameState";
import { Card } from "../../core/domain/entities/Card";
import { Player } from "../../core/domain/entities/Player";
import { Game } from "../../core/domain/entities/Game";

export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;
  // gameName is unused currently; keep if needed later

  // Handlers para evitar el error de "método no encontrado"
  private onGameStateUpdatedCallback?: (gameStateJson: string) => void;
  private onCardFlippedCallback?: (cardId: string) => void;

  constructor(hubUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    // 1. REGISTRO TEMPRANO: Escuchamos los métodos ANTES de conectar.
    // Usamos camelCase por defecto (cardFlipped en vez de CardFlipped)
    this.connection.on("cardFlipped", (cardId: string) => {
      console.log(`[SignalR] <<< Recibido cardFlipped: ${cardId}`);
      if (this.onCardFlippedCallback) this.onCardFlippedCallback(cardId);
    });

    this.connection.on("GameStateUpdated", (gameStateString: string) => {
      if (this.onGameStateUpdatedCallback) {
        this.onGameStateUpdatedCallback(gameStateString);
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

  async sendUpdateStateGame(gameState: GameState): Promise<void> {
    const plainState = this.toPlainGameState(gameState);

    // Asegúrate de que el nombre coincida con el método en C# (UpdateGameState)
    await this.connection.invoke("UpdateGameState", plainState);
  }

  async sendCreateGame(gameState: GameState): Promise<void> {
    const plainState = this.toPlainGameState(gameState);

    await this.connection.invoke("CreateGame", plainState);
  }

  async sendJoinGame(gameName: string, playerName: string): Promise<void> {
    await this.connection.invoke("JoinGame", playerName, gameName);
  }

  private setupLoggers() {
    this.connection.onreconnecting((err) =>
      console.warn("[SignalR] Reconectando...", err),
    );
    this.connection.onreconnected((id) =>
      console.log("[SignalR] Reconectado:", id),
    );
    this.connection.onclose((err) =>
      console.log("[SignalR] Conexión cerrada", err),
    );
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
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

  // Los métodos 'on' ahora solo guardan el callback, el registro real ya se hizo en el constructor
  onRemoteFlipCard(callback: (cardId: string) => void): void {
    this.onCardFlippedCallback = callback;
  }

  onRemoteGameStateUpdated(callback: (gameStateJson: string) => void): void {
    this.onGameStateUpdatedCallback = callback;
  }

  // ... (Resto de métodos sendCreateGame, sendJoinGame, disconnect se mantienen igual)

  private toPlainGameState(gameState: GameState): any {
    return {
      Id: gameState.id,
      Name: gameState.name,
      IsProcessing: gameState.isProcessing,
      Level: gameState.level,
      Cards:
        gameState.cards?.map((c) => ({
          Id: c.id,
          Value: String(c.value),
          IsRevealed: c.isRevealed,
          IsMatched: c.isMatched,
        })) || [],
      Players:
        gameState.players?.map((p) => ({
          Id: p.id,
          Name: p.name,
          RemainMoves: p.remainMoves,
          TotalMoves: p.totalMoves,
          Points: p.points,
          Turn: p.turn,
        })) || [],
    };
  }

  getNewObjectGameState(data: any): GameState {
    // Si el servidor envía un string JSON, lo parseamos; si no, usamos el objeto directamente
    const gameState = typeof data === "string" ? JSON.parse(data) : data;

    const rawCards = gameState.cards || gameState.Cards || [];
    const rawPlayers = gameState.players || gameState.Players || [];

    const cards = rawCards.map(
      (c: any) =>
        new Card(
          c.id || c.Id,
          c.value || c.Value,
          c.isMatched ?? c.IsMatched,
          c.isRevealed ?? c.IsRevealed,
        ),
    );

    const players = rawPlayers.map(
      (p: any) =>
        new Player(
          p.id || p.Id,
          p.name || p.Name,
          p.remainMoves ?? p.RemainMoves,
          p.totalMoves ?? p.TotalMoves,
          p.points ?? p.Points,
          p.turn ?? p.Turn,
        ),
    );

    const id = gameState.id || gameState.Id || "";
    const name = gameState.name || gameState.Name || "";
    const level = gameState.level ?? gameState.Level ?? 0;

    const reconstructed = new Game(id, name, level);
    reconstructed.cards = cards;
    reconstructed.players = players;
    reconstructed.isProcessing = !!(
      gameState.isProcessing ?? gameState.IsProcessing
    );

    return reconstructed;
  }

  offAll(): void {
    this.onGameStateUpdatedCallback = undefined;
    this.onCardFlippedCallback = undefined;
    // Si quieres dejar de escuchar físicamente:
    this.connection.off("gameStateUpdated");
    this.connection.off("cardFlipped");
  }
}

import * as signalR from "@microsoft/signalr";
import type { GameHubPort } from "../../core/domain/ports/GameHubPort";
import type { GameState } from "../../core/domain/entities/GameState";
import { Card } from "../../core/domain/entities/Card";
import { Player } from "../../core/domain/entities/Player";
import { Game } from "../../core/domain/entities/Game";

/**
 * Implementación de GameHubPort usando SignalR.
 * Se conecta al Hub de .NET y traduce los mensajes.
 */
export class SignalRGameHub implements GameHubPort {
  private connection: signalR.HubConnection;
  private gameId: string = "";

  constructor(hubUrl: string) {
    console.log("[SignalR] Creando conexión a:", hubUrl);
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting((error) => {
      console.warn("[SignalR] Reconectando...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("[SignalR] Reconectado con ID:", connectionId);
    });

    this.connection.onclose((error) => {
      console.log("[SignalR] Conexión cerrada", error);
    });
  }

  async waitForConnection(): Promise<void> {
    while (this.connection.state !== signalR.HubConnectionState.Connected) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  async connect(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start();
      // Esperar activamente hasta que el estado sea Connected
      let retries = 20;
      while (
        this.connection.state !== signalR.HubConnectionState.Connected &&
        retries > 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        retries--;
      }
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error(
          "SignalR: No se pudo establecer la conexión en el tiempo esperado.",
        );
      }
      console.log(
        "[SignalR] Conectado. Estado:",
        this.connection.state,
        "| ConnectionId:",
        this.connection.connectionId,
      );
    }
  }

  async disconnect(): Promise<void> {
    console.log(`[SignalR] Desconectando de sala "${this.gameId}"...`);
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("LeaveGame", this.gameId);
      await this.connection.stop();
      console.log("[SignalR] Desconectado");
    }
  }

  async sendCreateGame(state: GameState): Promise<void> {
    this.gameId = state.id;
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      await this.connect();
      await this.waitForConnection();
    }
    console.log(
      `[SignalR] >>> Enviando CreateGame: nivel "${state.level}" en sala "${this.gameId}"`,
    );
    await this.connection.invoke("CreateGame", state);
    console.log(`[SignalR] >>> CreateGame enviado OK`);
  }

  async sendJoinGame(gameId: string, playerName: string): Promise<void> {
    this.gameId = gameId;
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      await this.connect();
      await this.waitForConnection();
    }

    console.log(
      `[SignalR] >>> Enviando JoinGame: jugador "${playerName}" en sala "${this.gameId}"`,
    );
    await this.connection.invoke("JoinGame", playerName, this.gameId);
    console.log(`[SignalR] >>> JoinGame enviado OK`);
  }

  // Convierte GameState y subclases a objetos planos compatibles con el backend
  private toPlainGameState(gameState: GameState): any {
    return {
      Id: gameState.id,
      Name: gameState.name,
      IsProcessing: gameState.isProcessing,
      Cards: Array.isArray(gameState.cards)
        ? gameState.cards.map((c) => ({
            Id: c.id,
            Value: String(c.value),
            IsFlipped: c.isFlipped,
            IsMatched: c.isMatched,
          }))
        : [],
      Players: Array.isArray(gameState.players)
        ? gameState.players.map((p) => ({
            Id: p.id,
            Name: p.name,
            RemainMoves: p.remainMoves,
            TotalMoves: p.totalMoves,
            Points: p.points,
            Turn: p.turn,
          }))
        : [],
    };
  }

  async sendUpdateStateGame(gameState: GameState): Promise<void> {
    const plainState = this.toPlainGameState(gameState);
    try {
      console.log(
        "[SignalR] >>> Enviando GameState:",
        JSON.stringify(plainState, null, 2),
        `en sala "${this.gameId}"`,
      );
    } catch (e) {
      console.warn("[SignalR] >>> No se pudo serializar GameState:", e);
      console.log(
        "[SignalR] >>> GameState bruto:",
        plainState,
        `en sala "${this.gameId}"`,
      );
    }
    await this.connection.invoke("UpdateGameState", plainState);
    console.log(`[SignalR] >>> GameState enviado OK`);
  }

  onRemoteFlipCard(callback: (cardId: string) => void): void {
    this.connection.on("CardFlipped", (cardId: string) => {
      console.log(`[SignalR] <<< Recibido CardFlipped: carta "${cardId}"`);
      callback(cardId);
    });
  }

  onRemoteGameStateUpdated(callback: (gameState: GameState) => void): void {
    this.connection.on("gamestateupdated", (gameStateObject: any) => {
      console.log(`Recibido gamestateupdated: estado`, gameStateObject);
      const reconstructed = this.getNewObjectGameState(gameStateObject);
      callback(reconstructed);
    });
  }

  onRemoteLogFromServer(): void {
    this.connection.on("LogFromServer", (message: string) => {
      console.log(`Recibido LogFromServer: mensaje "${message}"`);
    });
  }

  offAll(): void {
    console.log("[SignalR] Eliminando todos los listeners");
    this.connection.off("gamestateupdated");
  }

  getNewObjectGameState(gameStateString: string): GameState {
    // Reconstruir GameState y subentidades desde objeto
    const gameState = gameStateString;

    const cards = Array.isArray(gameState.cards)
      ? gameState.cards.map(
          (c: any) => new Card(c.id, c.value, c.isFlipped, c.isMatched),
        )
      : [];
    const players = Array.isArray(gameState.players)
      ? gameState.players.map(
          (p: any) =>
            new Player(
              p.id,
              p.name,
              p.remainMoves,
              p.totalMoves,
              p.points,
              p.turn,
            ),
        )
      : [];
    const reconstructed = new Game(
      gameState.id,
      gameState.name,
      gameState.level,
      players[0]?.name || "",
    );
    reconstructed.cards = cards;
    reconstructed.players = players;
    reconstructed.isProcessing = gameState.isProcessing;

    console.log(
      `Convertido GameStateUpdated: estado con ${JSON.stringify(reconstructed, null, 2)}`,
    );

    return reconstructed;
  }
}

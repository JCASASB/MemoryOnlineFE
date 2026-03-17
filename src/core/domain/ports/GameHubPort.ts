import type { GameState } from "../entities/GameState";

/**
 * Puerto para comunicación en tiempo real con el servidor de juego.
 * Permite enviar y recibir acciones sin acoplarse a SignalR.
 */
export interface GameHubPort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Enviar acciones al servidor
  sendCreateGame(gameState: GameState): Promise<void>;
  sendJoinGame(gameName: string, playerName: string): Promise<void>;
  sendUpdateStateGame(gameState: GameState): Promise<void>;

  // Escuchar acciones remotas
  onRemoteGameStateUpdated(callback: (gameStateJson: string) => void): void;

  offAll(): void;
}

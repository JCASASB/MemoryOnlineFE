import type { Game } from "../entities/Game";

/**
 * Puerto para comunicación en tiempo real con el servidor de juego.
 * Permite enviar y recibir acciones sin acoplarse a SignalR.
 */
export interface GameHubPort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Enviar acciones al servidor
  sendCreateGame(game: Game): Promise<void>;
  sendJoinGame(gameName: string, playerName: string): Promise<void>;
  sendUpdateStateGame(game: Game): Promise<void>;

  // Escuchar acciones remotas
  onRemoteGameUpdated(callback: (gameJson: string) => void): void;

  offAll(): void;
}

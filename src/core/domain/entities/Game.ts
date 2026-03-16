import { Card } from "./Card";
import type { GameState } from "./GameState";
import { Player } from "./Player";

export class Game implements GameState {
  constructor(
    public id: string,
    public name: string,
    public level: number,
    public isProcessing: boolean = false,
    public cards: Card[] = [],
    public players: Player[] = [],
  ) {}
}

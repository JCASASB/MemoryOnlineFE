import { Card } from "./Card";
import { Player } from "./Player";

export class Game {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly level: number,
    public readonly isProcessing: boolean = false,
    public readonly cards: Card[] = [],
    public readonly players: Player[] = [],
  ) {}
}

import { Card } from "./Card";
import { Player } from "./Player";

export class Game {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly level: number,
    public readonly version: number,
    public readonly cards: Card[] = [],
    public readonly players: Player[] = [],
  ) {}
}

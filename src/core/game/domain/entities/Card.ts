import { StateCard } from "./StateCard";

export class Card {
  constructor(
    public readonly id: string,
    public readonly value: number,
    public readonly imgUrl: string,
    public readonly state: StateCard = StateCard.FaceDown,
  ) {}
}

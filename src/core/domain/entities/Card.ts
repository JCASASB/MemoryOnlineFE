export class Card {
  constructor(
    public readonly id: string,
    public readonly value: number,
    public readonly imgUrl: string,
    public readonly isMatched: boolean = false,
    public readonly isRevealed: boolean = false,
  ) {}
}

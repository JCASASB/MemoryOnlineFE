export class Card {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly imageUrl: string,
    public readonly isMatched: boolean = false,
    public readonly isRevealed: boolean = false,
  ) {}
}

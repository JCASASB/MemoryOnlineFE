export class Card {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly imageUrl: string,
    public isMatched: boolean = false,
    public isRevealed: boolean = false,
  ) {}

  flip() {
    return new Card(this.id, this.value, this.imageUrl, this.isMatched, true);
  }
  unflip() {
    return new Card(this.id, this.value, this.imageUrl, this.isMatched, false);
  }
  match() {
    return new Card(this.id, this.value, this.imageUrl, true, true);
  }
}

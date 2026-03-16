export class Card {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public isFlipped: boolean = false,
    public isMatched: boolean = false,
  ) {}

  flip() {
    return new Card(this.id, this.value, true, this.isMatched);
  }
  unflip() {
    return new Card(this.id, this.value, false, this.isMatched);
  }
  match() {
    return new Card(this.id, this.value, true, true);
  }
}

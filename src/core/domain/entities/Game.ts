import { Card } from "./Card";
import type { GameState } from "./GameState";
import { Player } from "./Player";
import { v4 as uuidv4 } from "uuid";

export class Game implements GameState {
  public cards: Card[] = [];
  public players: Player[] = [];
  public isProcessing: boolean = false;
  public readonly id: string;

  constructor(
    public readonly name: string,
    public readonly level: number,
  ) {
    this.id = uuidv4();
  }

  addPlayer(playerName: string): void {
    const newPlayer = new Player(uuidv4(), playerName, 2, 0, 0, false);
    this.players.push(newPlayer);
  }

  canClick(playerName: string): boolean {
    console.log(
      `[Game.canClick] Verificando si el jugador ${playerName} puede hacer clic...`,
    );
    console.log(
      `[Game.canClick] Estado actual del juego: ${JSON.stringify(this, null, 2)}`,
    );
    return (
      this.players.some((p) => p.name === playerName && p.turn) &&
      !this.isProcessing
    );
  }

  flipCard(cardId: string): void {
    if (this.isProcessing) return;

    const card = this.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = this.cards.map((c) => (c.id === cardId ? c.flip() : c));
    const flippedCount = newCards.filter(
      (c) => c.isFlipped && !c.isMatched,
    ).length;

    this.cards = newCards;
    this.isProcessing = flippedCount === 2;
  }

  checkMatch(): void {
    const flipped = this.cards.filter((c) => c.isFlipped && !c.isMatched);
    if (flipped.length !== 2) return;

    const isMatch = flipped[0].value === flipped[1].value;
    const finalCards = this.cards.map((c) => {
      if (c.isFlipped && !c.isMatched) {
        return isMatch ? c.match() : c.unflip();
      }
      return c;
    });

    this.cards = finalCards;
    this.isProcessing = false;
  }

  /**
   * Inicializa el juego generando las cartas según el nivel.
   */
  initialize(): void {
    // Generar cartas (pares) según el nivel
    const values: string[] = [];
    for (let i = 0; i < this.level; i++) {
      const value = String.fromCharCode(65 + i); // A, B, C, ...
      values.push(value, value); // Par de cada valor
    }
    // Mezclar y asignar IDs únicos
    const shuffled = values
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => new Card(uuidv4(), item.value));

    this.cards = shuffled;
    this.isProcessing = false;
  }
}

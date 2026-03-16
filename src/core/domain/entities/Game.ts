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

  addPlayer(playerName: string): Game {
    const newPlayer = new Player(uuidv4(), playerName, 2, 0, 0, false);
    return this.cloneAndOverride({
      players: [...this.players, newPlayer],
    });
  }

  canClick(playerId: string): boolean {
    return (
      this.players.some((p) => p.id === playerId && p.turn) &&
      !this.isProcessing
    );
  }

  flipCard(cardId: string): Game {
    if (this.isProcessing) return this;

    const card = this.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return this;

    const newCards = this.cards.map((c) => (c.id === cardId ? c.flip() : c));
    const flippedCount = newCards.filter(
      (c) => c.isFlipped && !c.isMatched,
    ).length;

    return this.cloneAndOverride({
      cards: newCards,
      isProcessing: flippedCount === 2,
    });
  }

  checkMatch(): Game {
    const flipped = this.cards.filter((c) => c.isFlipped && !c.isMatched);
    if (flipped.length !== 2) return this;

    const isMatch = flipped[0].value === flipped[1].value;
    const finalCards = this.cards.map((c) => {
      if (c.isFlipped && !c.isMatched) {
        return isMatch ? c.match() : c.unflip();
      }
      return c;
    });

    return this.cloneAndOverride({
      cards: finalCards,
      isProcessing: false,
    });
  }

  cloneAndOverride(toOverride: Partial<GameState>): Game {
    // Lista de campos válidos en GameState
    const validFields = ["id", "name", "cards", "players", "isProcessing"];
    Object.keys(toOverride).forEach((key) => {
      if (!validFields.includes(key)) {
        console.warn(
          `[Game.cloneAndOverride] Campo desconocido ignorado: ${key}`,
        );
      }
    });
    const id = toOverride.id !== undefined ? toOverride.id : this.id;
    const name = toOverride.name !== undefined ? toOverride.name : this.name;
    const cardsRaw =
      toOverride.cards !== undefined ? toOverride.cards : this.cards;
    const cards = cardsRaw.map(
      (c: Card) => new Card(c.id, c.value, c.isFlipped, c.isMatched),
    );
    const players =
      toOverride.players !== undefined ? toOverride.players : this.players;
    const isProcessing =
      toOverride.isProcessing !== undefined
        ? toOverride.isProcessing
        : this.isProcessing;
    const game = new Game(id, name, this.level, this.players[0]?.name || "");
    game.cards = cards;
    game.players = players;
    game.isProcessing = isProcessing;
    return game;
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

    // Asignar cartas y estado inicial
    this.cards = shuffled;
    this.isProcessing = false;
  }
}

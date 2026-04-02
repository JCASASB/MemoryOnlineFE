import { Card } from "../entities/Card";
import { Game } from "../entities/Game";
import { StateCard } from "../entities/StateCard";

export class UseCaseCheckCards {
  execute(game: Game): Game | undefined {
    const cardsRevealedAndNotMatched = this.getCardsWithStateFaceUp(game);

    console.log(
      "Cartas reveladas y no emparejadas:",
      cardsRevealedAndNotMatched,
    );

    if (cardsRevealedAndNotMatched.length === 2) {
      const cards = this.checkMatch(game.cards, cardsRevealedAndNotMatched);

      return {
        id: game.id,
        name: game.name,
        level: game.level,
        version: game.version + 1,
        cards: cards,
        players: game.players,
      } as Game;
    } else {
      return undefined;
    }
  }

  checkMatch(cards: Card[], revealedIdCards: string[]): Card[] {
    let newCards = [];

    const isMatch =
      cards.find((c) => c.id === revealedIdCards[0])?.value ===
      cards.find((c) => c.id === revealedIdCards[1])?.value;

    newCards = cards.map((c) => {
      if (c.id === revealedIdCards[0] || c.id === revealedIdCards[1]) {
        if (isMatch) {
          return new Card(c.id, c.value, c.imgUrl, StateCard.Matched);
        } else {
          return new Card(c.id, c.value, c.imgUrl, StateCard.FaceDown);
        }
      } else {
        return c;
      }
    });

    return newCards;
  }

  getCardsWithStateFaceUp(game: Game): string[] {
    return game.cards
      .filter((c) => c.state === StateCard.FaceUp)
      .map((c) => c.id);
  }
}

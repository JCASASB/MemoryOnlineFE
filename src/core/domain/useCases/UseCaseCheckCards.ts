import { Card } from "../entities/Card";
import { Game } from "../entities/Game";

export class UseCaseCheckCards {
  execute(game: Game): Game {
    const cardsRevealedAndNotMatched = this.getCardsRevealedAndNotMatched(game);

    if (cardsRevealedAndNotMatched.length === 2) {
      const cards = this.checkMatch(game.cards, cardsRevealedAndNotMatched);

      return {
        id: game.id,
        name: game.name,
        level: game.level,
        cards: cards,
        players: game.players,
        isProcessing: game.isProcessing,
      } as Game;
    } else {
      return game;
    }
  }

  checkMatch(cards: Card[], revealedIdCards: [string, string][]): Card[] {
    let newCards = [];

    const isMatch = revealedIdCards[0][1] === revealedIdCards[1][1];

    newCards = cards.map((c) => {
      if (c.id === revealedIdCards[0][0] || c.id === revealedIdCards[1][0]) {
        if (isMatch) {
          return new Card(c.id, c.value, c.imgUrl, true, true);
        } else {
          return new Card(c.id, c.value, c.imgUrl, false, false);
        }
      } else {
        return c;
      }
    });

    return newCards;
  }

  getCardsRevealedAndNotMatched(game: Game): [string, string][] {
    return game.cards
      .filter((c) => c.isRevealed && !c.isMatched)
      .map((c) => [c.id, c.value]);
  }
}

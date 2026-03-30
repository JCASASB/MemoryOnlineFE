import { Card } from "../entities/Card";
import { Game } from "../entities/Game";
import { StateCard } from "../entities/StateCard";

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

  checkMatch(cards: Card[], revealedIdCards: [string, number][]): Card[] {
    let newCards = [];

    const isMatch = revealedIdCards[0][1] === revealedIdCards[1][1];

    newCards = cards.map((c) => {
      if (c.id === revealedIdCards[0][0] || c.id === revealedIdCards[1][0]) {
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

  getCardsRevealedAndNotMatched(game: Game): [string, number][] {
    return game.cards
      .filter((c) => c.state === StateCard.FaceUp)
      .map((c) => [c.id, c.value]);
  }
}

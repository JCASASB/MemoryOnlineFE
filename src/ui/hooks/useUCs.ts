import { useCallback } from "react";
import { useDependencies } from "../context/useDependencies";

export const useUCs = () => {
  const {
    applicationFlipCard,
    applicationCreateGame,
    applicationJoinGame,
    applicationCheckCards,
  } = useDependencies();

  return {
    flipCardUC: useCallback(
      async (id: string, playerId: string) => {
        await applicationFlipCard.execute(id, playerId);
      },
      [applicationFlipCard],
    ),
    createGameUC: useCallback(
      async (level: number, gameName: string, playerName: string) => {
        await applicationCreateGame.execute(level, gameName, playerName);
      },
      [applicationCreateGame],
    ),
    joinGameUC: useCallback(
      async (gameName: string, playerName: string) =>
        await applicationJoinGame.execute(gameName, playerName),
      [applicationJoinGame],
    ),
    checkCardsUC: useCallback(async () => {
      await applicationCheckCards.execute();
    }, [applicationCheckCards]),
  };
};

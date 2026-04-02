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
        return await applicationFlipCard.execute(id, playerId);
      },
      [applicationFlipCard],
    ),
    createGameUC: useCallback(
      async (level: number, gameName: string) => {
        return await applicationCreateGame.execute(level, gameName);
      },
      [applicationCreateGame],
    ),
    joinGameUC: useCallback(
      async (gameName: string, playerName: string) => {
        return await applicationJoinGame.execute(gameName, playerName);
      },
      [applicationJoinGame],
    ),
    checkCardsUC: useCallback(
      async (versionNumber: number) => {
        return await applicationCheckCards.execute(versionNumber);
      },
      [applicationCheckCards],
    ),
  };
};

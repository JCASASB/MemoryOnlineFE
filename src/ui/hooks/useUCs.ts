import { useCallback } from "react";
import { useDependencies } from "../context/useDependencies";

export const useUCs = () => {
  const {
    applicationFlipCard,
    applicationCreateGame,
    applicationJoinGameByMatchId,
    applicationCheckCards,
    applicationSendChatMessage,
    applicationCreateChallenge,
  } = useDependencies();

  return {
    flipCardUC: useCallback(
      async (id: string, playerId: string) => {
        return await applicationFlipCard.execute(id, playerId);
      },
      [applicationFlipCard],
    ),
    createMatchUC: useCallback(
      async (level: number, gameName: string) => {
        return await applicationCreateGame.execute(level, gameName);
      },
      [applicationCreateGame],
    ),
    joinGameByMatchIdUC: useCallback(
      async (matchId: string, playerName: string, playerId: string) => {
        return await applicationJoinGameByMatchId.execute(
          matchId,
          playerName,
          playerId,
        );
      },
      [applicationJoinGameByMatchId],
    ),
    createChallengeUC: useCallback(
      async (matchId: string, playerId1: string, playerId2: string) => {
        return await applicationCreateChallenge.execute(
          matchId,
          playerId1,
          playerId2,
        );
      },
      [applicationCreateChallenge],
    ),
    checkCardsUC: useCallback(
      async (versionNumber: number) => {
        return await applicationCheckCards.execute(versionNumber);
      },
      [applicationCheckCards],
    ),
    sendChatMessageUC: useCallback(
      async (message: string, playerName: string, playerId: string) => {
        return await applicationSendChatMessage.execute(
          message,
          playerName,
          playerId,
        );
      },
      [applicationSendChatMessage],
    ),
  };
};

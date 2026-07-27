import { useDependencies } from "../context/useDependencies";

export function usePlayer() {
  const { onlineRepository } = useDependencies();

  const playerId = onlineRepository.getPlayerId();

  const playerName = onlineRepository.getPlayerName();

  return { playerId, playerName };
}

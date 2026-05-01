import { useDependencies } from "../context/useDependencies";

export function usePlayer() {
  const { onlineRepository } = useDependencies();

  const playerId = onlineRepository.getOrCreatePlayerId();

  const playerName = onlineRepository.getPlayerName();

  function savePlayerName(name: string) {
    onlineRepository.savePlayerName(name);
  }

  return { playerId, playerName, savePlayerName };
}

const PLAYER_ID_KEY = 'playerId';
const PLAYER_NAME_KEY = 'playerName';

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function usePlayer() {
  const playerId = getOrCreatePlayerId();
  const playerName = localStorage.getItem(PLAYER_NAME_KEY) ?? '';

  function savePlayerName(name: string) {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  }

  return { playerId, playerName, savePlayerName };
}

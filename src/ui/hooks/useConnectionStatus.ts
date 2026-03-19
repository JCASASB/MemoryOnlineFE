import { useSyncExternalStore } from "react";
import { useDependencies } from "../context/useDependencies";

export const useConnectionStatus = () => {
  const { onlineRepository } = useDependencies();

  const thisconnectionStatus = useSyncExternalStore(
    onlineRepository.subscribe,
    () => onlineRepository.getConnectionStatus(),
  );

  return {
    connectionStatus: thisconnectionStatus,
  };
};

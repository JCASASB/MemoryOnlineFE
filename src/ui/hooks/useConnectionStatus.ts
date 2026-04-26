import { useSyncExternalStore } from "react";
import { useDependencies } from "../context/useDependencies";

export const useConnectionStatus = () => {
  const { onlineRepository } = useDependencies();

  const getTheConnectionStatus = () => onlineRepository.getConnectionStatus();

  const thisconnectionStatus = useSyncExternalStore(
    onlineRepository.subscribeToStatus,
    getTheConnectionStatus,
  );

  return {
    connectionStatus: thisconnectionStatus,
  };
};

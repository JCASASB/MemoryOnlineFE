// hooks/useConnectionStatus.ts
import { useEffect, useState } from "react";
import { useDependencies } from "../context/useDependencies";

export const useConnectionStatus = () => {
  const { signalRGameHub } = useDependencies();

  const [status, setStatus] = useState<number>(signalRGameHub.getStatus());

  useEffect(() => {
    const unsubscribe = signalRGameHub.registerStatusChangedCallback(
      (newStatus) => {
        setStatus(newStatus);
      },
    );
    return () => unsubscribe();
  }, [signalRGameHub]);

  return status;
};

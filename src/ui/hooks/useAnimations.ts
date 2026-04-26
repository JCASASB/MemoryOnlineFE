import { useCallback } from "react";
import { useDependencies } from "../context/useDependencies";

export const useAnimations = () => {
  const {
    applicationAnimationInProgressAdd,
    applicationAnimationInProgressRemove,
  } = useDependencies();

  return {
    addAnimationInProgress: useCallback(
      async (id: string) => {
        await applicationAnimationInProgressAdd.execute(id);
      },
      [applicationAnimationInProgressAdd],
    ),
    removeAnimationInProgress: useCallback(
      async (id: string) => {
        await applicationAnimationInProgressRemove.execute(id);
      },
      [applicationAnimationInProgressRemove],
    ),
  };
};

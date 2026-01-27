import { useAtomValue, useSetAtom } from "jotai";
import { savedMovesAtom } from "../store/savedMoves";
import type { Move } from "../types/globals";

export const useSetSavedMoves = () => {
  const setSavedMoves = useSetAtom(savedMovesAtom);

  const addSavedMove = (move: Move) => {
    if (move.options.mode === "select") return;

    setSavedMoves((prevMoves) => [move, ...prevMoves]);
  };

  const removeSavedMove = () => {
    let move: Move | undefined;

    setSavedMoves((prevMoves) => {
      move = prevMoves.at(0);
      return prevMoves.slice(1);
    });

    return move;
  };

  const clearSavedMoves = () => {
    setSavedMoves([]);
  };

  return { addSavedMove, removeSavedMove, clearSavedMoves };
};

export const useSavedMoves = () => {
  return useAtomValue(savedMovesAtom);
};

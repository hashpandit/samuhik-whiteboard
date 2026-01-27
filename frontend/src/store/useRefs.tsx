import { useContext } from "react";
import { roomContext } from "../utils";

export const useRefs = () => {
  const { undoRef, bgRef, canvasRef, minimapRef, redoRef, selectionRefs } =
    useContext(roomContext);

  return {
    undoRef,
    redoRef,
    bgRef,
    canvasRef,
    minimapRef,
    selectionRefs,
  };
};

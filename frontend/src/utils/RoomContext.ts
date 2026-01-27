import {
  createContext,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { MotionValue } from "framer-motion";

export interface RoomContextValue {
  x: MotionValue<number>;
  y: MotionValue<number>;
  undoRef: RefObject<HTMLButtonElement | null>;
  redoRef: RefObject<HTMLButtonElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  bgRef: RefObject<HTMLCanvasElement | null>;
  selectionRefs: RefObject<HTMLButtonElement[]>;
  minimapRef: RefObject<HTMLCanvasElement | null>;
  moveImage: { base64: string; x?: number; y?: number };
  setMoveImage: Dispatch<
    SetStateAction<{
      base64: string;
      x?: number | undefined;
      y?: number | undefined;
    }>
  >;
}

export const roomContext = createContext<RoomContextValue>(null!);

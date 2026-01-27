import { atom } from "jotai";
import type { Move } from "../types/globals";

export const savedMovesAtom = atom<Move[]>([]);

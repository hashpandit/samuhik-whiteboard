import { atom } from "jotai";
import type { Move } from "../types/globals";

export interface User {
  name: string;
  color: string;
}

export interface Room {
  id: string;
  users: Map<string, User>;
  usersMoves: Map<string, Move[]>;
  myMoves: Move[];
  movesWithoutUser: Move[];
}

export const DEFAULT_ROOM: Room = {
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  myMoves: [],
  movesWithoutUser: [],
};

export const roomAtom = atom<Room>(DEFAULT_ROOM);

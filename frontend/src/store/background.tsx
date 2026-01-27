import { atom } from "jotai";

export interface BackgroundState {
  mode: "dark" | "light";
  lines: boolean;
}

export const backgroundAtom = atom<BackgroundState>({
  mode: "light",
  lines: true,
});

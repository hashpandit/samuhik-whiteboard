import { atom } from "jotai"; // Changed
import type { CtxOptions } from "../types/globals";

export const optionsAtom = atom<CtxOptions>({
  lineColor: { r: 0, g: 0, b: 0, a: 1 },
  fillColor: { r: 0, g: 0, b: 0, a: 0 },
  lineWidth: 5,
  mode: "draw",
  shape: "line",
  selection: null,
});

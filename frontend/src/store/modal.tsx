import { atom } from "jotai";

export const modalAtom = atom<{
  modal: React.ReactNode;
  opened: boolean;
}>({
  modal: null,
  opened: false,
});

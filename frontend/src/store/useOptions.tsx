import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { optionsAtom } from "../store/options";

export const useOptionsValue = () => {
  return useAtomValue(optionsAtom);
};

export const useSetOptions = () => {
  return useSetAtom(optionsAtom);
};

export const useOptions = () => {
  return useAtom(optionsAtom);
};

export const useSetSelection = () => {
  const setOptions = useSetOptions();

  const setSelection = (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setOptions((prev) => ({ ...prev, selection: rect }));
  };

  const clearSelection = () => {
    setOptions((prev) => ({ ...prev, selection: null }));
  };

  return { setSelection, clearSelection };
};

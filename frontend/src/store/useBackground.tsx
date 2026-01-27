import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { backgroundAtom } from "../store/background";

export const useBackground = () => {
  const bg = useAtomValue(backgroundAtom);

  useEffect(() => {
    const root = window.document.documentElement;

    if (bg.mode === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [bg.mode]);

  return bg;
};

export const useSetBackground = () => {
  const setBg = useSetAtom(backgroundAtom);

  const setBackground = (mode: "dark" | "light", lines: boolean) => {
    setBg({
      mode,
      lines,
    });
  };

  return setBackground;
};

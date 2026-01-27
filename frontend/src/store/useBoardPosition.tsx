import { useContext } from "react";

import { roomContext } from "../utils";

export const useBoardPosition = () => {
  const { x, y } = useContext(roomContext);

  return { x, y };
};

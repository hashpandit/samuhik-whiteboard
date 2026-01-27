import { useContext } from "react";

import { roomContext } from "../utils";

export const useMoveImage = () => {
  const { moveImage, setMoveImage } = useContext(roomContext);

  return { moveImage, setMoveImage };
};

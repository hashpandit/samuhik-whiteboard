import { useAtom, useSetAtom } from "jotai";

import { getNextColor } from "../utils/colors";
import type { Move } from "../types/globals";

import { DEFAULT_ROOM, roomAtom } from "./room";

export const useRoom = () => useAtom(roomAtom);

export const useSetRoom = () => {
  const setRoom = useSetAtom(roomAtom);
  return setRoom;
};

export const useSetRoomId = () => {
  const setRoomId = useSetAtom(roomAtom);

  const handleSetRoomId = (id: string) => {
    setRoomId({ ...DEFAULT_ROOM, id });
  };

  return handleSetRoomId;
};

export const useSetUsers = () => {
  const setRoom = useSetAtom(roomAtom);

  const handleAddUser = (userId: string, name: string) => {
    setRoom((prev) => {
      const newUsers = new Map(prev.users);
      const newUsersMoves = new Map(prev.usersMoves);

      const color = getNextColor([...newUsers.values()].pop()?.color);

      newUsers.set(userId, { name, color });
      newUsersMoves.set(userId, []);

      return { ...prev, users: newUsers, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveUser = (userId: string) => {
    setRoom((prev) => {
      const newUsers = new Map(prev.users);
      const newUsersMoves = new Map(prev.usersMoves);

      const userMoves = newUsersMoves.get(userId) || [];

      newUsers.delete(userId);
      newUsersMoves.delete(userId);

      return {
        ...prev,
        users: newUsers,
        usersMoves: newUsersMoves,
        movesWithoutUser: [...prev.movesWithoutUser, ...userMoves],
      };
    });
  };

  const handleAddMoveToUser = (userId: string, moves: Move) => {
    setRoom((prev) => {
      const newUsersMoves = new Map(prev.usersMoves);
      const oldMoves = newUsersMoves.get(userId) || [];

      newUsersMoves.set(userId, [...oldMoves, moves]);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveMoveFromUser = (userId: string) => {
    setRoom((prev) => {
      const newUsersMoves = new Map(prev.usersMoves);
      const oldMoves = [...(newUsersMoves.get(userId) || [])];
      oldMoves.pop();

      newUsersMoves.set(userId, oldMoves);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useMyMoves = () => {
  const [room, setRoom] = useAtom(roomAtom);

  const handleAddMyMove = (move: Move) => {
    setRoom((prev) => {
      if (prev.myMoves[prev.myMoves.length - 1]?.options.mode === "select")
        return {
          ...prev,
          myMoves: [...prev.myMoves.slice(0, -1), move],
        };

      return { ...prev, myMoves: [...prev.myMoves, move] };
    });
  };

  const handleRemoveMyMove = () => {
    const newMoves = [...room.myMoves];
    const move = newMoves.pop();

    setRoom((prev) => ({ ...prev, myMoves: newMoves }));

    return move;
  };

  return { handleAddMyMove, handleRemoveMyMove, myMoves: room.myMoves };
};

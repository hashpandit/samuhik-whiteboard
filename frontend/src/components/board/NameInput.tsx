import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../lib/socket";
import { useSetRoomId } from "../../store";
import NotFoundModal from "../ui/NotFound";
import { useModal } from "../../store/useModal";

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();

  const [name, setName] = useState("");

  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        navigate("/");
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("room_exists");
    };
  }, [roomId, navigate]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) {
        navigate("/");
        openModal(<NotFoundModal id={roomIdFromServer} />);
      } else setRoomId(roomIdFromServer);
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [openModal, navigate, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomId) {
      socket.emit("join_room", roomId, name);
    }
  };

  return (
    <form
      className="my-24 flex flex-col items-center"
      onSubmit={handleJoinRoom}
    >
      <h1 className="text-5xl font-extrabold leading-tight sm:text-extra">
        Collabio
      </h1>
      <h3 className="text-xl sm:text-2xl">Real-time whiteboard</h3>

      <div className="mt-10 mb-3 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Username..."
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 15))}
        />
      </div>

      <button className="btn" type="submit">
        Enter room
      </button>
    </form>
  );
};

export default NameInput;

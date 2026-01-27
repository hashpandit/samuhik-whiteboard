import { useRoom } from "../store";
import { RoomContextProvider } from "../utils";
import Board from "./board";
import Chat from "./Chat";
import NameInput from "./board/NameInput";
import UserList from "./board/UserList";
import ToolBar from "./Toolbar";

const Room = () => {
  const [room] = useRoom();

  if (!room.id) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <UserList />
        <ToolBar />
        <Board />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;

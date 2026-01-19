import { io, Socket } from "socket.io-client";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/globals";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

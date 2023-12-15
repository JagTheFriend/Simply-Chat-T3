import type { NextApiRequest, NextApiResponse } from "next";
import { Server, type Socket } from "socket.io";

export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponse & { socket: { io: Server } }
) {
  // means that socket server was already initialized
  if (res.socket.io) {
    res.end();
    return;
  }

  const io = new Server(3000, {
    path: "/api/socket",
  });

  res.socket.io = io;

  const onConnection = (socket: Socket) => {
    console.log(`Connected, ${JSON.stringify(socket, null, 4)}`);
  };

  io.on("connection", onConnection);

  res.end();
}

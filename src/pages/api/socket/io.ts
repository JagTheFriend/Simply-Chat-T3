import { type Server as NetServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: { server: { io: ServerIO } } }
) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer = res.socket.server as NetServer;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;

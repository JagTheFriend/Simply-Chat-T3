import type { Server as NetServer } from "http";
import type { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import type { NextApiResponseWithSocketIo } from "~/utils/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (_req: NextApiRequest, res: NextApiResponseWithSocketIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;

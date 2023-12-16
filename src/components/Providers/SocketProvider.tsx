import { createContext, useEffect, useState } from "react";
import { io as ClientIO, type Socket } from "socket.io-client";

type SocketContextType = {
  isConnected: boolean;
  socket: Socket | null | undefined;
};

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null | undefined>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

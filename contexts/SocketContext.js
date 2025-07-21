"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState("");
  const router = useRouter();

  const connectSocket = (playerName) => {
    // create new socket
    if (!socket) {
      const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        auth: { name: playerName },
      });

      s.connect();
      setSocket(s);
      setPlayer(playerName);

      s.on("connect", () => {
        console.log("Socket connected", s.id);
      });

      s.on("disconnect", () => {
        console.log("Socket disconnected", s.id);
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, connectSocket, player, setPlayer }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

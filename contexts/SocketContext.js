"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

const SocketContext = createContext();

const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function touchSession() {
  localStorage.setItem("wtlstact", Date.now().toString());
}

function isSessionValid() {
  const lastActive = localStorage.getItem("wtlstact");
  if (!lastActive) return false;
  return Date.now() - parseInt(lastActive, 10) < SESSION_TTL_MS;
}

function clearSession() {
  localStorage.removeItem("wtsid");
  localStorage.removeItem("wtplrnm");
  localStorage.removeItem("wtlstact");
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState("");
  const [sessionId, setSessionId] = useState("");

  const connectSocket = (playerName) => {
    if (!socket) {
      // Restore existing sessionId from localStorage, or generate a new one
      let sid = localStorage.getItem("wtsid");
      if (!sid) {
        sid = nanoid(16);
        localStorage.setItem("wtsid", sid);
      }
      localStorage.setItem("wtplrnm", playerName);
      touchSession();
      setSessionId(sid);

      const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        auth: {
          name: playerName,
          sessionId: sid,
        },
      });

      s.connect();
      setSocket(s);
      setPlayer(playerName);

      s.on("connect", () => {
        console.log("Socket connected", s.id);
        touchSession();
      });

      s.on("disconnect", () => {
        console.log("Socket disconnected", s.id);
      });

      s.io.on("reconnect", (attemptNumber) => {
        // console.log("Socket reconnected after", attemptNumber, "attempts");
        touchSession();
      });
    }
  };

  // Rename the player: update server, localStorage, and local state
  const renamePlayer = (newName) => {
    if (!socket || !newName.trim()) return;
    const trimmed = newName.trim();
    socket.emit("rename-player", trimmed, (error) => {
      if (error) {
        // console.error("Rename failed:", error);
        return;
      }
      setPlayer(trimmed);
      localStorage.setItem("wtplrnm", trimmed);
      socket.auth.name = trimmed;
    });
  };

  // Auto-reconnect on page load if session is still valid
  useEffect(() => {
    if (!isSessionValid()) {
      clearSession();
      return;
    }
    const savedName = localStorage.getItem("wtplrnm");
    const savedSid = localStorage.getItem("wtsid");
    if (savedName && savedSid && !socket) {
      connectSocket(savedName);
    }
  }, []);

  // Keep session alive with a heartbeat every 10 minutes while connected
  useEffect(() => {
    if (!socket) return;
    const interval = setInterval(touchSession, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, connectSocket, player, setPlayer, sessionId, renamePlayer }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

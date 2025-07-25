"use client";

import { useSocket } from "@/contexts/SocketContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RoomRules from "@/components/RoomRules";
import QuestionsPage from "@/components/QuestionsPage";
import { ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";

const GamePage = () => {
  const { socket } = useSocket();
  const router = useRouter();
  const params = useParams();
  const roomId = params.id;

  const [room, setRoom] = useState({
    id: roomId || "",
    topic: "",
    difficulty: "EASY",
    maxPlayers: 5,
    players: [],
    status: "WAITING",
    isPrivate: true,
    hostId: "",
  });
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket || !roomId) {
      router.push("/");
      return;
    }

    socket.on("disconnect", () => {
      socket.emit("leave-room", roomId);
      return;
    });

    socket.emit("get-room-users", roomId);

    const handleRoomJoined = (room) => {
      setRoom((prev) => ({ ...prev, ...room }));
      // console.log(room);
    };
    socket.on("room-joined", handleRoomJoined);

    const handleRoomUsers = ({ roomId: id, host, players }) => {
      setRoom((prev) => ({
        ...prev,
        id,
        hostId: host,
        players,
      }));
      if (host === socket.id) setIsHost(true);
      else setIsHost(false);
    };
    socket.on("room-users", handleRoomUsers);

    const handlePlayerJoined = ({ player, players }) => {
      setRoom((prev) => ({
        ...prev,
        players,
      }));
    };
    socket.on("player-joined", handlePlayerJoined);

    const handlePlayerLeft = ({ playerId, playerName, players }) => {
      toast.info(`${playerName} has left the room`);
      setRoom((prev) => ({
        ...prev,
        players: players,
      }));
    };
    socket.on("room-left", handlePlayerLeft);

    const handleRoomSaved = (room) => {
      console.log("room before", room);
      toast.success("Settings Saved");
      setRoom((prev) => ({
        ...prev,
        ...room,
      }));
      console.log("room after", room);
    };
    socket.on("room-saved", handleRoomSaved);

    const handleGameStarted = (room) => {
      toast.success("Game Started");
      setLoading(false);
      setRoom((prev) => ({
        ...prev,
        ...room,
      }));
    };
    socket.on("game-started", handleGameStarted);

    const handleAnswerCorrect = (room) => {
      setRoom((prev) => ({
        ...prev,
        ...room,
      }));
    };
    socket.on("answer-correct", handleAnswerCorrect);

    const handleBackToRoom = (room) => {
      setRoom((prev) => ({
        ...prev,
        ...room,
      }));
    };
    socket.on("back-to-room", handleBackToRoom);

    // Handle room closed event
    const handleRoomClosed = ({ message }) => {
      toast.info(message || "Room has been closed.");
      router.push("/");
    };
    socket.on("room-closed", handleRoomClosed);

    const handleRoomError = (error) => {
      toast.error(error);
      return;
    };
    socket.on("room-error", handleRoomError);

    console.log(room);

    return () => {
      socket.off("room-joined", handleRoomJoined);
      socket.off("room-users", handleRoomUsers);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("room-left", handlePlayerLeft);
      socket.off("room-saved", handleRoomSaved);
      socket.off("game-started", handleGameStarted);
      socket.off("answer-correct", handleAnswerCorrect);
      socket.off("back-to-room", handleBackToRoom);
      socket.off("room-closed", handleRoomClosed);
      socket.off("room-error", handleRoomError);
    };
  }, [socket, roomId]);

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket.emit("leave-room", roomId);
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col overflow-clip">
      {/* Header */}
      <header className="w-full py-3 px-6 bg-cyan-100 border-b flex items-center justify-between sticky top-0 z-10">
        <span className="text-2xl font-bold text-orange-800">WitLink</span>
        <button
          onClick={handleLeaveRoom}
          className="flex justify-center items-center cursor-pointer text-red-500"
        >
          <LogOut className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </header>
      {/* Main Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: User List */}
        <aside className="relative bg-gradient-to-r from-pink-200 to-indigo-100 border-r w-1/4 min-w-[220px] max-w-xs p-3 grid-span-3 overflow-y-auto">
          <div className="flex flex-row justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Players</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                toast.success("Room ID copied to clipboard!");
              }}
              className="text-sm bg-blue-500 text-gray-100 px-1 py-0.5 border border-blue-400 hover:bg-blue-600 cursor-pointer rounded"
            >
              Copy Room Id
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {room.players.map((player) => (
              <div
                key={player.id}
                className={`rounded-lg p-3 border flex flex-col gap-1 ${
                  player.id === socket.id
                    ? "bg-yellow-100 border-green-400"
                    : "bg-cyan-100 border-indigo-200"
                }`}
              >
                {/* <span className="text-xs text-gray-500">ID: {player.id}</span> */}
                <span className="flex flex-row gap-2 items-center font-bold text-neutral-800">
                  <ArrowRight className="h-4 w-4" /> {player.name}
                </span>
                <span className="text-sm text-blue-700 font-semibold">
                  Score: {player.score ?? 0}
                </span>
                {player.id === room.hostId && (
                  <span className="text-xs text-green-700 font-bold">Host</span>
                )}
              </div>
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 grid-span-7 overflow-y-auto">
          {room.status === "WAITING" ? (
            <RoomRules
              room={room}
              setRoom={setRoom}
              isHost={isHost}
              socket={socket}
              setLoading={setLoading}
              loading={loading}
            />
          ) : (
            <QuestionsPage room={room} setRoom={setRoom} socket={socket} />
          )}
        </main>
      </div>
    </div>
  );
};

export default GamePage;

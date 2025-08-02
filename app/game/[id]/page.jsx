"use client";

import { useSocket } from "@/contexts/SocketContext";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RoomRules from "@/components/RoomRules";
import QuestionsPage from "@/components/QuestionsPage";
import RoomChat from "@/components/roomChat";
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

    const handleGameStarting = () => {
      toast.info("Game is starting soon...");
    };
    socket.on("game-starting", handleGameStarting);

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
      socket.off("game-starting", handleGameStarting);
      socket.off("game-started", handleGameStarted);
      socket.off("answer-correct", handleAnswerCorrect);
      socket.off("back-to-room", handleBackToRoom);
      socket.off("room-closed", handleRoomClosed);
      socket.off("room-error", handleRoomError);
      socket.off("disconnect");
    };
  }, [socket, roomId]);

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket.emit("leave-room", roomId);
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="w-full py-3 px-6 bg-cyan-100 border-b flex items-center justify-between sticky top-0 z-10 h-12">
        <span className="text-2xl font-bold text-orange-800">WitLink</span>
        <button
          onClick={handleLeaveRoom}
          className="flex justify-center items-center cursor-pointer text-red-500"
        >
          <LogOut className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </header>

      <div className="flex flex-col h-[calc(100vh-3rem)] sm:grid sm:grid-cols-15 overflow-hidden">
        {/* Main Content */}
        <main className="h-[60%] p-4 overflow-y-auto sm:p-8 sm:col-span-11 sm:h-auto">
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

        {/* Sidebar: User List and Chat */}
        <aside className="flex flex-row h-[40%] bg-gradient-to-r from-pink-200 to-indigo-100 border-t sm:flex-col sm:relative sm:border-r sm:col-span-4 sm:h-auto">
          {/* Players Section */}
          <div className="w-4/10 flex flex-col p-2 border-r border-indigo-300 sm:w-auto sm:h-[55%] sm:pl-3 sm:pt-2 sm:pr-1 sm:border-r-0">
            <div className="flex flex-row justify-between items-center pb-2">
              <h3 className="text-sm font-semibold sm:text-lg">Players</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  toast.success("Room ID copied!");
                }}
                className="text-xs bg-blue-500 text-gray-100 px-1 py-0.5 border border-blue-400 hover:bg-blue-600 cursor-pointer rounded sm:text-sm"
              >
                {window.innerWidth < 640 ? "Copy ID" : "Copy Room Id"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto sm:border-b-2 sm:border-indigo-500">
              <div className="flex flex-col gap-1 sm:gap-2">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className={`rounded-lg p-2 border flex flex-col gap-1 ${
                      player.id === socket.id
                        ? "bg-yellow-100 border-green-400"
                        : "bg-cyan-100 border-indigo-200"
                    } sm:p-3`}
                  >
                    <span className="flex flex-row gap-1 items-center font-bold text-neutral-800 text-xs sm:gap-2 sm:text-base">
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                      {player.name}
                    </span>
                    <span className="text-xs text-blue-700 font-semibold sm:text-sm">
                      Score: {player.score ?? 0}
                    </span>
                    {player.id === room.hostId && (
                      <span className="text-xs text-green-700 font-bold">
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-6/10 p-2 sm:w-auto sm:h-[45%] sm:p-3 sm:pr-1">
            <RoomChat roomId={roomId} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;

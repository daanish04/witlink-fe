import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";

const SetGamePage = ({ player }) => {
  const router = useRouter();
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handlePlayerJoined = ({ roomId, player, players }) => {
      if (player.id === socket.id) {
        router.push(`/game/${roomId}`);
      }
    };
    socket.on("player-joined", handlePlayerJoined);

    const handleRoomError = (error) => {
      toast.error(error);
      return;
    };
    socket.on("room-error", handleRoomError);

    return () => {
      socket.off("room-error", handleRoomError);
      socket.off("player-joined", handlePlayerJoined);
    };
  }, [socket]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!socket) return toast.error("Socket not connected");
    socket.emit("join-room", roomId);
  };

  const handleMakeRoom = () => {
    if (!socket) return toast.error("Socket not connected");
    socket.emit("make-room", {}, (roomId) => {
      if (roomId) {
        setRoomId(roomId);
        router.push(`/game/${roomId}`);
      }
    });
  };
  return (
    <div className="relative flex justify-center items-center min-h-[60vh]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>
        {/* Animated particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      {/* Main Card */}
      <div className="relative group w-full max-w-xl">
        <div className="relative bg-transparent backdrop-blur-3xl shadow-blue-600 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-8">
          <div className="text-center space-y-8 w-full">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
                Room Setup
              </h1>
              <p className="text-blue-100/80 text-lg font-light tracking-wide">
                Hello, {player}
              </p>
            </div>
            <div className="space-y-6 w-full">
              <Dialog>
                <DialogTrigger className="w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border border-white/20 transition-all duration-300 group overflow-hidden text-center">
                  Have a Link? Join Room
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join A Room</DialogTitle>
                    <DialogDescription asChild>
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={handleJoinRoom}
                      >
                        <label className="block text-blue-100/80 text-base font-medium text-left">
                          Enter the room code:
                        </label>
                        <input
                          type="text"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          autoFocus
                          className="w-full px-6 py-4 text-lg bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/20 disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          className="w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border border-white/20 transition-all duration-300 group overflow-hidden"
                        >
                          Join
                        </button>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleMakeRoom}
                className="w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg border border-white/20 transition-all duration-300 group overflow-hidden"
              >
                Make a Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetGamePage;

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
import { Pencil, Check, X } from "lucide-react";

const SetGamePage = ({ player }) => {
  const router = useRouter();
  const { socket, renamePlayer } = useSocket();
  const [roomId, setRoomId] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(player);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handlePlayerJoined = ({ roomId, player, players }) => {
      if (player.id === socket.auth?.sessionId) {
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

  const handleRenameConfirm = () => {
    if (!newName.trim() || newName.trim() === player) {
      setIsRenaming(false);
      return;
    }
    renamePlayer(newName.trim());
    toast.success(`Name changed to "${newName.trim()}"`);
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(player);
    setIsRenaming(false);
  };

  return (
    <div>
      <div className="sm:px-12 sm:py-8 py-8 px-6 border border-indigo-700 sm:w-md bg-blue-50 shadow-lg shadow-blue-300 flex flex-col justify-center items-center sm:gap-4 gap-2 rounded-2xl">
        {/* Player name with inline rename */}
        <div className="flex items-center gap-2">
          {isRenaming ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameConfirm();
                  if (e.key === "Escape") handleRenameCancel();
                }}
                maxLength={24}
                autoFocus
                className="py-0.5 px-2 text-sm border border-indigo-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 w-32"
              />
              <button
                onClick={handleRenameConfirm}
                className="text-green-600 hover:text-green-800 cursor-pointer"
                title="Confirm"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={handleRenameCancel}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                title="Cancel"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-blue-600 font-semibold text-xl">Hello, {player}</p>
              <button
                onClick={() => { setNewName(player); setIsRenaming(true); }}
                className="text-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors"
                title="Rename"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
              </button>
            </>
          )}
        </div>

        <Dialog>
          <DialogTrigger className="w-full bg-blue-500 text-gray-100 px-2 py-1 border-2 border-blue-400 hover:bg-blue-600 cursor-pointer rounded">
            Have a Link? Join Room
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join A Room</DialogTitle>
              <DialogDescription asChild>
                <form className="flex flex-col gap-4" onSubmit={handleJoinRoom}>
                  <label className="block text-gray-600 text-sm font-medium">
                    Enter the room code:
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    autoFocus
                    className=" mb-2 py-1 px-2 text-md border border-indigo-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-gray-100 px-2 py-1 border-2 border-blue-400 hover:bg-blue-600 cursor-pointer rounded"
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
          className="w-full py-1 px-2 text-lg text-gray-100 bg-green-600 rounded font-semibold border-2 border-green-300 hover:bg-green-700 cursor-pointer transition-colors duration-200 active:scale-98"
        >
          Make a Room
        </button>
      </div>
    </div>
  );
};

export default SetGamePage;


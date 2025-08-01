"use client";

import { Info } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const RoomRules = ({ room, setRoom, isHost, socket, setLoading, loading }) => {
  const handleSave = (e) => {
    e.preventDefault();
    if (!socket) return;
    socket.emit("room-update", room);
  };
  const handleStartGame = () => {
    if (!socket) return;
    if (room.topic.trim() === "") {
      toast.warning("Topic cannot be blank");
      return;
    }
    setLoading(true);
    socket.emit("room-update", room);
    socket.emit("start-game", room.id);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-6 justify-center items-center h-full overflow-y-auto px-2 sm:px-0">
      <h2 className="text-xl sm:text-4xl font-bold text-neutral-950 text-center">
        Set Room Rules
      </h2>
      <form
        className="flex flex-col gap-3 sm:gap-4 w-full max-w-md"
        onSubmit={handleSave}
      >
        <label
          className="block text-neutral-950 text-sm sm:text-md font-medium"
          htmlFor="topic"
        >
          Topic :
        </label>
        <input
          type="text"
          value={room.topic}
          onChange={(e) => {
            setRoom((prev) => ({ ...prev, topic: e.target.value }));
          }}
          disabled={!isHost}
          autoFocus
          className="py-1.5 sm:py-1 px-2 text-sm sm:text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        />
        <label
          className="block text-neutral-950 text-sm sm:text-md font-medium"
          htmlFor="difficulty"
        >
          Difficulty :
        </label>
        <select
          className="py-1.5 sm:py-1 px-2 text-sm sm:text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          value={room.difficulty}
          onChange={(e) => {
            setRoom((prev) => ({ ...prev, difficulty: e.target.value }));
          }}
          disabled={!isHost}
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <label
          className="block text-neutral-950 text-sm sm:text-md font-medium"
          htmlFor="maxPlayers"
        >
          Max Players :
        </label>
        <select
          className="py-1.5 sm:py-1 px-2 text-sm sm:text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          value={room.maxPlayers}
          onChange={(e) => {
            setRoom((prev) => ({
              ...prev,
              maxPlayers: Number(e.target.value),
            }));
          }}
          disabled={!isHost}
        >
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            const currentPlayerCount = room.players?.length || 0;
            return (
              <option
                key={i + 1}
                value={i + 1}
                disabled={currentPlayerCount > value}
              >
                {value}
              </option>
            );
          })}
        </select>
        {isHost && (
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-sm sm:text-base text-gray-100 px-4 py-2 sm:py-1.5 border-2 border-blue-400 hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded"
          >
            Save
          </button>
        )}
      </form>
      {isHost && (
        <div className="w-full max-w-md h-0.5 bg-gradient-to-r from-transparent via-indigo-900 to-transparent" />
      )}
      {isHost && (
        <button
          disabled={loading}
          className="text-sm sm:text-lg bg-green-700 text-gray-100 px-4 sm:px-5 py-2 border-2 border-green-400 hover:bg-green-800 cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleStartGame}
        >
          Save and Start Game
        </button>
      )}
      {!isHost && (
        <span className="bg-yellow-50 border-b-4 border-yellow-400 text-red-600 p-3 sm:p-4 rounded-lg shadow mt-4 sm:mt-6 flex items-center gap-2 text-sm sm:text-base">
          <Info className="font-semibold h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            Only Host can edit room rules and start game
          </span>
        </span>
      )}
    </div>
  );
};

export default RoomRules;

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
    <div className="flex flex-col gap-6 justify-center items-center">
      <h2 className="text-3xl font-bold text-neutral-950">Set Room Rules</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        <label
          className="block text-neutral-950 text-md font-medium"
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
          className="mb-2 py-1 px-2 text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        />
        <label
          className="block text-neutral-950 text-md font-medium"
          htmlFor="difficulty"
        >
          Difficulty :
        </label>
        <select
          className="mb-2 py-1 px-2 text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
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
          className="block text-neutral-950 text-md font-medium"
          htmlFor="maxPlayers"
        >
          Max Players :
        </label>
        <select
          className="mb-2 py-1 px-2 text-md border border-indigo-600 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          value={room.maxPlayers}
          onChange={(e) => {
            setRoom((prev) => ({
              ...prev,
              maxPlayers: Number(e.target.value),
            }));
          }}
          disabled={!isHost}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        {isHost && (
          <button
            type="submit"
            className="bg-blue-500 text-gray-100 px-2 py-1 border-2 border-blue-400 hover:bg-blue-600 cursor-pointer rounded"
          >
            Save
          </button>
        )}
      </form>
      {isHost && (
        <button
          disabled={loading}
          className="text-lg bg-green-700 text-gray-100 px-5 py-2 border-2 border-green-400 hover:bg-green-800 cursor-pointer rounded-lg mt-2 disabled:cursor-not-allowed disabled:opacity-50"
          // className="mt-8 bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition-colors text-lg"
          onClick={handleStartGame}
        >
          Save and Start Game
        </button>
      )}
      {!isHost && (
        <span className="bg-yellow-50 border-b-4 border-yellow-400 text-red-600 p-4 rounded-lg shadow mt-6 flex items-center gap-2">
          <Info className="font-semibold h-5 w-5 text-yellow-500" />
          Only Host can edit room rules and start game
        </span>
      )}
    </div>
  );
};

export default RoomRules;

import { Info, Trophy } from "lucide-react";
import React, { useEffect } from "react";

const LeaderboardPage = ({ room, setRoom, socket }) => {
  const currentPlayer = room.players.find((player) => player.id === socket.id);
  const currentPlayerScore = currentPlayer ? currentPlayer.score ?? 0 : 0;

  const sortedPlayers = [...room.players].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  useEffect(() => {
    if (!socket) return;
    const handlePlayerFinished = (room) => {
      setRoom((prev) => ({
        ...prev,
        ...room,
      }));
    };
    socket.on("player-finished", handlePlayerFinished);

    return () => {
      socket.off("player-finished", handlePlayerFinished);
    };
  }, [socket]);

  const handleGoBackToRoom = () => {
    if (!socket) return;
    if (socket.id === room.hostId) {
      socket.emit("game-over", room.id);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-bold text-green-900 text-shadow-xs text-shadow-yellow-300 mb-4">
        Game Over!
      </h2>
      <h3 className="text-2xl font-semibold text-neutral-900">
        Quiz on: {room.topic} ({room.difficulty})
      </h3>
      <p className="text-xl text-neutral-800">
        Your score: {currentPlayerScore}
      </p>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mt-6">
        <h4 className="flex items-center gap-4 justify-center text-xl font-bold text-gray-800 mb-4 text-center">
          Leaderboard <Trophy className="h-6 w-6 mb-1" strokeWidth={2.5} />
        </h4>
        {sortedPlayers.length > 0 ? (
          <ul className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <li
                key={player.id}
                className={`relative flex justify-between items-center p-3 rounded-md transition-colors
                    ${
                      player.id === socket.id
                        ? "bg-blue-100 font-semibold border border-blue-400"
                        : "bg-gray-100"
                    }
                  `}
              >
                <span className="text-lg text-gray-900">
                  {index + 1}. {player.name}
                  {player.id === room.hostId && (
                    <span className="ml-2 text-xs text-green-600">(Host)</span>
                  )}
                </span>
                {player.status === "INGAME" && (
                  <span className="absolute left-60 px-1 py-0.5 border border-yellow-400 bg-yellow-200 text-yellow-600 rounded-lg text-sm">
                    In Game
                  </span>
                )}
                <span className="text-lg text-gray-700">
                  Score: {player.score ?? 0}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No players found in this room.
          </p>
        )}
      </div>
      {socket.id === room.hostId ? (
        <button
          onClick={handleGoBackToRoom}
          className="my-8 bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition-colors text-lg"
        >
          Back to Room Rules Page
        </button>
      ) : (
        <span className="bg-yellow-50 border-b-4 border-yellow-400 text-red-600 p-4 rounded-lg shadow my-6 flex items-center gap-2">
          <Info className="font-semibold h-5 w-5 text-yellow-500" />
          Only Host can redirect back to Room Rules page
        </span>
      )}
    </div>
  );
};

export default LeaderboardPage;

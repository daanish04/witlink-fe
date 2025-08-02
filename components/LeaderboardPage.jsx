import { CrownIcon, Info, Trophy } from "lucide-react";
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
    <div className="flex flex-col items-center justify-start gap-3 sm:gap-4 h-full overflow-y-auto px-4 pt-4 sm:pt-8">
      <h2 className="text-xl sm:text-4xl font-bold text-green-900 text-shadow-xs text-shadow-yellow-300 text-center">
        Game Over!
      </h2>
      <h3 className="text-base sm:text-2xl font-semibold text-neutral-900 text-center">
        Quiz on: {room.topic} ({room.difficulty})
      </h3>
      <p className="text-sm sm:text-xl text-neutral-800 text-center">
        Your score: {currentPlayerScore}
      </p>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-3 sm:p-6 mt-2 sm:mt-4">
        <h4 className="flex items-center gap-2 sm:gap-4 justify-center text-base sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">
          Leaderboard{" "}
          <Trophy className="h-4 w-4 sm:h-6 sm:w-6 mb-1" strokeWidth={2.5} />
        </h4>
        {sortedPlayers.length > 0 ? (
          <ul className="space-y-1 sm:space-y-2">
            {sortedPlayers.map((player, index) => (
              <li
                key={player.id}
                className={`relative flex justify-between items-center p-2 sm:p-3 rounded-md transition-colors
                    ${
                      player.id === socket.id
                        ? "bg-blue-100 font-semibold border border-blue-400"
                        : "bg-gray-100"
                    }
                  `}
              >
                {index < 3 && (
                  <CrownIcon
                    className="sm:h-8 sm:w-8 h-6 w-6 absolute -top-3 -left-3 -rotate-50"
                    fill={
                      index === 0 ? "gold" : index === 1 ? "silver" : "#cd7f32"
                    }
                    strokeWidth={1.5}
                  />
                )}
                <span className="text-xs sm:text-lg text-gray-900 flex-1">
                  {index + 1}. {player.name}
                  {player.id === room.hostId && (
                    <span className="ml-1 sm:ml-2 text-xs text-green-600">
                      (Host)
                    </span>
                  )}
                </span>
                {player.status === "INGAME" && (
                  <span className="absolute sm:left-60 left-40 px-1 py-0.5 border border-yellow-400 bg-yellow-200 text-yellow-600 rounded-lg sm:text-sm text-xs">
                    In Game
                  </span>
                )}
                <span className="text-xs sm:text-lg text-gray-700 ml-2">
                  Score: {player.score ?? 0}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center text-xs sm:text-base">
            No players found in this room.
          </p>
        )}
      </div>
      {socket.id === room.hostId ? (
        <button
          onClick={handleGoBackToRoom}
          className="my-3 sm:my-6 bg-indigo-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-800 transition-colors text-sm sm:text-lg"
        >
          Back to Room Rules Page
        </button>
      ) : (
        <span className="bg-yellow-50 border-b-4 border-yellow-400 text-red-600 p-2 sm:p-4 rounded-lg shadow my-3 sm:my-6 flex items-center gap-2 text-xs sm:text-base">
          <Info className="font-semibold h-3 w-3 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm">
            Only Host can redirect back to Room Rules page
          </span>
        </span>
      )}
    </div>
  );
};

export default LeaderboardPage;

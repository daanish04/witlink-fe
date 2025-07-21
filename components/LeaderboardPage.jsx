import React from "react";

const LeaderboardPage = ({ room, socket }) => {
  const currentPlayer = room.players.find((player) => player.id === socket.id);
  const currentPlayerScore = currentPlayer ? currentPlayer.score ?? 0 : 0;

  const sortedPlayers = [...room.players].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  const handleGoBackToRoom = () => {
    if (!socket) return;
    if (socket.id === room.hostId) {
      socket.emit("game-over", room.id);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h2 className="text-4xl font-bold text-green-700 mb-4">Game Over!</h2>
      <h3 className="text-2xl font-semibold text-gray-800">
        Quiz on: {room.topic} ({room.difficulty})
      </h3>
      <p className="text-xl text-gray-700">Your score: {currentPlayerScore}</p>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mt-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Leaderboard
        </h4>
        {sortedPlayers.length > 0 ? (
          <ul className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <li
                key={player.id}
                className={`flex justify-between items-center p-3 rounded-md transition-colors
                    ${
                      player.id === socket.id
                        ? "bg-blue-100 font-semibold border border-blue-400"
                        : "bg-gray-50"
                    }
                  `}
              >
                <span className="text-lg text-gray-900">
                  {index + 1}. {player.name}
                  {player.id === room.hostId && (
                    <span className="ml-2 text-xs text-green-600">(Host)</span>
                  )}
                  {player.id === socket.id && (
                    <span className="ml-2 text-xs text-blue-600">(You)</span>
                  )}
                </span>
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
      {socket.id === room.hostId && (
        <button
          onClick={handleGoBackToRoom}
          className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
        >
          Back to Room Rules Page
        </button>
      )}
    </div>
  );
};

export default LeaderboardPage;

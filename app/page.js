"use client";

import PlayerNamePage from "@/components/PlayerNamePage";
import SetGamePage from "@/components/SetGamePage";
import { useSocket } from "@/contexts/SocketContext";
import { Info } from "lucide-react";
// import ChatPage from "@/components/chatPage";
import React, { useState } from "react";

const Home = () => {
  const { player } = useSocket();

  return (
    // <ChatPage />
    <div className="min-h-screen">
      <div className="pt-20 flex flex-col justify-center items-center gap-10">
        <h1 className="text-9xl font-extrabold bg-gradient-to-tl from-red-800 via-purple-950 to-red-800 bg-clip-text text-transparent">
          WitLink
        </h1>
        <p className="text-xl text-gray-500">
          Welcome to WitLink, the ultimate online quiz platform! Play live
          quizzes with your friends.
        </p>

        {/* PlayerName/SetGamePage at the top */}
        <div className="w-full flex justify-center">
          {player === "" ? <PlayerNamePage /> : <SetGamePage player={player} />}
        </div>

        {/* Guide boxes in a flex row */}
        <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-6 mt-4">
          {/* How to Play Box */}
          <div className="flex-1 bg-blue-50 border border-blue-300 rounded-2xl shadow-lg p-6 flex flex-col gap-3 min-w-[260px] max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              How to Play
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-md space-y-1">
              <li>Enter your name to get started.</li>
              <li>
                Create a new room or join an existing one using a room code.
              </li>
              <li>
                Set the quiz topic, difficulty, and max players (
                <span className="font-semibold text-blue-800">host</span> only).
              </li>
              <li>Wait for friends to join, then the host starts the game.</li>
              <li>Answer each question before the timer runs out.</li>
              <li>Check the leaderboard at the end of the quiz!</li>
            </ul>
          </div>
          {/* Host Controls Box */}
          <div className="flex-1 bg-blue-50 border border-blue-300 rounded-2xl shadow-lg p-6 flex flex-col gap-3 min-w-[260px] max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Host Controls & Game Flow
            </h2>
            <ul className="list-disc list-inside text-gray-700 text-md space-y-1">
              <li>
                Only the{" "}
                <span className="font-semibold text-blue-800">host</span> can
                save room settings and start the quiz.
              </li>
              <li>If the host leaves, the room is closed for everyone.</li>
              <li>
                On the leaderboard page, only the host can return the lobby to
                the room rules page to start a new quiz.
              </li>
              <li>
                Players can join or leave anytime during and before the game
                starts.
              </li>
            </ul>
          </div>
        </div>

        {/* Warning about free server */}
        <div className="w-full max-w-xl mb-5 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow mt-6">
          <div className="flex items-center gap-2 mb-1">
            <Info className="font-semibold h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Note:</span>
          </div>
          <span className="text-sm">
            This site is hosted on a free server. You may experience slow starts
            or brief delays, especially when starting out. Please be patient!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;

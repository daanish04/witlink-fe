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
      <div className="pt-20 flex flex-col justify-center items-center sm:gap-10 gap-6">
        <h1 className="sm:text-9xl text-7xl font-extrabold bg-gradient-to-tl from-orange-800 via-rose-800 to-red-900 bg-clip-text text-transparent">
          WitLink
        </h1>
        <p className="sm:text-xl text-sm px-3 text-white text-center">
          Welcome to WitLink, the ultimate online quiz platform! Play live
          quizzes with your friends.
        </p>

        {/* PlayerName/SetGamePage at the top */}
        <div className="w-full flex justify-center">
          {player === "" ? <PlayerNamePage /> : <SetGamePage player={player} />}
        </div>

        {/* Guide boxes in a flex row */}
        <div className="px-2 w-full flex flex-col md:flex-row justify-center items-stretch gap-6 mt-4">
          {/* How to Play Box */}
          <div className="flex-1 bg-cyan-200 border-2 border-blue-300 rounded-2xl shadow-lg p-6 flex flex-col sm:gap-3 gap-1.5 min-w-[260px] max-w-xl mx-auto hover:scale-102 transition-all duration-300 ease-in-out">
            <h2 className="sm:text-2xl text-lg font-bold text-indigo-700 mb-2">
              How to Play
            </h2>
            <ul className="list-disc list-inside text-gray-700 sm:text-md text-sm space-y-1">
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
          <div className="flex-1 bg-cyan-200 border-2 border-blue-300 rounded-2xl shadow-lg p-6 flex flex-col sm:gap-3 gap-1.5 min-w-[260px] max-w-xl mx-auto hover:scale-102 transition-all duration-300 ease-in-out">
            <h2 className="sm:text-2xl text-lg font-bold text-blue-700 mb-2">
              Host Controls & Game Flow
            </h2>
            <ul className="list-disc list-inside text-gray-700 sm:text-md text-sm space-y-1">
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
        <div className="w-full max-w-xl mb-5 bg-yellow-50 border-l-7 border-yellow-400 text-yellow-800 p-4 px-2 rounded-lg shadow mt-6">
          <div className="flex items-center gap-2 mb-1">
            <Info className="font-semibold sm:h-5 sm:w-5 h-4 w-4 text-yellow-500" />
            <span className="sm:text-base text-sm font-semibold">Note:</span>
          </div>
          <span className="sm:text-sm text-xs">
            This site is hosted on a free server. You may experience slow starts
            or brief delays, especially when starting out. Please be patient!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;

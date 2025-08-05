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
      {/* First screen section */}
      <div className="h-screen flex flex-col justify-center items-center sm:gap-10 gap-6 px-4">
        <h1 className="sm:text-9xl text-8xl font-extrabold text-white bg-clip-text ">
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
      </div>

      {/* Scrollable content section */}
      <div className="min-h-screen pt-20 flex flex-col justify-center items-center sm:gap-10 gap-6 px-4">
        {/* Guide boxes in a flex row */}
        <div className="px-2 w-full flex flex-col md:flex-row justify-center items-stretch gap-6 mt-4">
          {/* How to Play Box */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col sm:gap-3 gap-1.5 min-w-[260px] max-w-xl mx-auto">
            <h2 className="sm:text-2xl text-lg font-bold text-indigo-100 mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text ">
              How to Play
            </h2>
            <ul className="list-disc list-inside text-blue-100/90 sm:text-md text-sm space-y-1">
              <li>Enter your name to get started.</li>
              <li>
                Create a new room or join an existing one using a room code.
              </li>
              <li>
                Set the quiz topic, difficulty, and max players (
                <span className="font-semibold text-cyan-200">host</span> only).
              </li>
              <li>Wait for friends to join, then the host starts the game.</li>
              <li>Answer each question before the timer runs out.</li>
              <li>Check the leaderboard at the end of the quiz!</li>
            </ul>
          </div>
          {/* Host Controls Box */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col sm:gap-3 gap-1.5 min-w-[260px] max-w-xl mx-auto">
            <h2 className="sm:text-2xl text-lg font-bold text-cyan-100 mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text">
              Host Controls & Game Flow
            </h2>
            <ul className="list-disc list-inside text-blue-100/90 sm:text-md text-sm space-y-1">
              <li>
                Only the{" "}
                <span className="font-semibold text-cyan-200">host</span> can
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
        <div className="w-full max-w-xl mb-5 bg-white/10 backdrop-blur-xl border border-white/20 text-yellow-100 p-4 px-2 rounded-3xl shadow-2xl mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Info className="font-semibold sm:h-5 sm:w-5 h-4 w-4 text-yellow-300" />
            <span className="sm:text-base text-sm font-semibold text-yellow-100">
              Note:
            </span>
          </div>
          <span className="sm:text-sm text-xs text-yellow-50">
            This site is hosted on a free server. You may experience slow starts
            or brief delays, especially when starting out. Please be patient!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;

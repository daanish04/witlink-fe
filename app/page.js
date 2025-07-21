"use client";

import PlayerNamePage from "@/components/PlayerNamePage";
import SetGamePage from "@/components/SetGamePage";
import { useSocket } from "@/contexts/SocketContext";
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
          Welcome to WitLink, the ultimate online quiz platform! To play with
          your friends!
        </p>
        {player === "" ? <PlayerNamePage /> : <SetGamePage player={player} />}
      </div>
    </div>
  );
};

export default Home;

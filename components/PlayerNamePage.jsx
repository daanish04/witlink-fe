import { useSocket } from "@/contexts/SocketContext";
import React, { useState } from "react";

const PlayerNamePage = () => {
  const [name, setName] = useState("");
  const { connectSocket } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    connectSocket(name);
  };
  return (
    <div className="px-12 py-8 border border-indigo-700 bg-cyan-100 shadow-xl shadow-purple-300 flex flex-col justify-center items-center gap-4 rounded-2xl">
      <h3 className="text-lg text-indigo-600">Enter Your Name to Play</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="py-1 px-2 text-md border border-indigo-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        />
        <button
          type="submit"
          className="py-1 px-2 text-lg text-gray-100 bg-green-600 rounded font-semibold border-2 border-green-300 hover:bg-green-700 cursor-pointer transition-colors duration-200 active:scale-98"
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default PlayerNamePage;

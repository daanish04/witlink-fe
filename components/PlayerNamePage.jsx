import { useSocket } from "@/contexts/SocketContext";
import React, { useState } from "react";

const PlayerNamePage = () => {
  const [name, setName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectSocket } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      setIsConnecting(true);
      try {
        await connectSocket(name.trim());
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name.trim().length > 0 && !isConnecting) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[60vh]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-300/25 rounded-full blur-xl animate-bounce"></div>

        {/* Animated particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Card */}
      <div className="relative group">
        {/* Main Card */}
        <div className="relative bg-transparent backdrop-blur-3xl shadow-blue-600  rounded-3xl p-8 sm:p-12 shadow-2xl transform transition-all duration-300">
          {/* Decorative elements */}

          <div className="text-center space-y-8">
            {/* Title with enhanced styling */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
                Join the Game
              </h1>
              <p className="text-blue-100/80 text-lg font-light tracking-wide">
                Enter your name to begin the adventure
              </p>
            </div>

            {/* Input and Button */}
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  disabled={isConnecting}
                  placeholder="Your Name..."
                  className="w-full px-6 py-4 text-lg bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/20 disabled:opacity-50"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!name.trim() || isConnecting}
                className="relative w-full py-4 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border border-white/20 hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                <span className="relative flex items-center justify-center gap-2">
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      Start Playing
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Decorative bottom element */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNamePage;

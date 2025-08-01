"use client";

import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";

const RoomChat = ({ roomId }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleMessage = ({ player, message }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          player,
          message,
          timestamp: new Date(),
        },
      ]);
    };
    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !roomId) return;

    socket.emit("message", {
      roomId,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-300 mb-2">
        <h3 className="text-lg font-semibold">Room Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-2 space-y-2 pr-1 rounded-bl-xl border-b-2 border-indigo-500">
        {messages.map((msg) => {
          const isOwnMessage = msg.player.id === socket?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-wrap ${
                  isOwnMessage
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                {!isOwnMessage && (
                  <div className="text-xs font-semibold mb-0.5 text-gray-600">
                    {msg.player.name}
                  </div>
                )}
                <div className="text-sm">{msg.message}</div>
                <div
                  className={`text-xs text-right mt-0.5 ${
                    isOwnMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-1">
        <input
          type="text"
          value={newMessage}
          autoComplete="off"
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="flex-shrink-0 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default RoomChat;

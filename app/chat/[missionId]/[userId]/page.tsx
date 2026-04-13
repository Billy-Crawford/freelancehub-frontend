// app/chat/[missionId]/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { connectChat, sendMessage, disconnectChat } from "@/services/chat";
import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  const { missionId, userId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  // 🔹 Récupération du token depuis localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!token || !missionId || !userId) return;

    connectChat(Number(missionId), Number(userId), token, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => disconnectChat();
  }, [missionId, userId, token]);

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);

    setMessages((prev) => [
      ...prev,
      {
        message: input,
        sender: user?.id,
      },
    ]);

    setInput("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col h-[80vh]">
      <h1 className="text-xl font-bold mb-4">Chat Mission #{missionId}</h1>

      {/* 🔹 Messages */}
      <div className="flex-1 border p-4 rounded overflow-y-auto space-y-2">
        {messages.map((msg, index) => {
          const isMe = msg.sender === user?.id;

          return (
            <div
              key={index}
              className={`p-2 rounded ${
                isMe ? "bg-blue-100 text-right" : "bg-gray-100"
              }`}
            >
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>

      {/* 🔹 Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Votre message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

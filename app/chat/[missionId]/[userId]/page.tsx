// app/chat/[missionId]/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getMessages, sendMessageApi } from "@/services/chat";

export default function ChatPage() {
  const { missionId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadMessages = async () => {
    const data = await getMessages(Number(missionId));
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [missionId]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    await sendMessageApi(Number(missionId), input, file || undefined);

    setInput("");
    setFile(null);
    loadMessages();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col h-[80vh]">
      <h1 className="text-xl font-bold mb-4">Chat Mission #{missionId}</h1>

      {/* messages */}
      <div className="flex-1 border p-4 rounded overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`p-2 rounded ${
                isMe ? "bg-blue-100 text-right" : "bg-gray-100"
              }`}
            >
              {msg.content && <p>{msg.content}</p>}

              {/* 🔥 fichier */}
              {msg.file && (
                <a
                  href={`http://127.0.0.1:8000${msg.file}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  📎 Télécharger fichier
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* input */}
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded"
          placeholder="Votre message..."
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
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


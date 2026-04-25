"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getMessages, sendMessageApi } from "@/services/chat";
import { getMission } from "@/services/mission";

export default function ChatPage() {
  const { missionId } = useParams();
  const { user } = useAuth();

  const [missionTitle, setMissionTitle] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* =========================
     🔹 LOAD MISSION TITLE
  ========================= */
  const loadMission = async () => {
    try {
      const mission = await getMission(Number(missionId));
      setMissionTitle(mission.title);
    } catch (err) {
      setMissionTitle("");
    }
  };

  /* =========================
     🔹 LOAD MESSAGES
  ========================= */
  const loadMessages = async () => {
    const data = await getMessages(Number(missionId));

    // 🔥 FIX IMPORTANT ICI
    const msgs = Array.isArray(data) ? data : data?.messages || [];

    setMessages(msgs);
  };

  useEffect(() => {
    loadMission();
    loadMessages();

    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [missionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     🔹 SEND MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    await sendMessageApi(Number(missionId), input, file || undefined);

    setInput("");
    setFile(null);

    loadMessages();
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-3xl mx-auto bg-gray-50 rounded-2xl shadow-lg border overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-4 bg-white border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          M
        </div>

        <div>
          <h1 className="font-semibold text-gray-800">
            {missionTitle || `Mission #${missionId}`}
          </h1>
          <p className="text-xs text-gray-500">
            Conversation en direct
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-100">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.content && <p>{msg.content}</p>}

                {msg.file && (
                  <a
                    href={`http://127.0.0.1:8000${msg.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`block mt-2 text-xs underline ${
                      isMe ? "text-blue-100" : "text-blue-600"
                    }`}
                  >
                    📎 Télécharger fichier
                  </a>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="bg-white border-t px-4 py-3 flex flex-col gap-2">

        {/* file preview */}
        {file && (
          <div className="text-xs text-gray-600 flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg">
            <span>📎 {file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">

          {/* file */}
          <label className="cursor-pointer px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
            📎
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* send */}
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
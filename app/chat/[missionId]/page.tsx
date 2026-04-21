// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { connectChat, sendMessage, disconnectChat } from "@/services/chat";
// import { useAuth } from "@/hooks/useAuth";

// export default function ChatPage() {
//   const { missionId } = useParams();
//   const { user } = useAuth();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("access_token")
//       : null;

//   useEffect(() => {
//     if (!token || !missionId) return;

//     connectChat(Number(missionId), token, (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => disconnectChat();
//   }, [missionId, token]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     sendMessage(input);

//     setMessages((prev) => [
//       ...prev,
//       {
//         message: input,
//         sender: user?.id,
//       },
//     ]);

//     setInput("");
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto flex flex-col h-[80vh]">
//       <h1>Chat Mission #{missionId}</h1>

//       <div className="flex-1 border p-4 overflow-y-auto">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={msg.sender === user?.id ? "text-right" : ""}
//           >
//             {msg.message}
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-2 mt-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="border flex-1"
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// }

// services/chat.ts
import api from "./api";

let socket: WebSocket | null = null;

export const connectChat = (
  missionId: number,
  userId: number,
  token: string,
  onMessage: (data: any) => void,
) => {
  socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat/${missionId}/${userId}/?token=${token}`,
  );

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    onMessage({
      message: data.message,
      sender: data.sender,
      sender_email: data.sender_email,
    });
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
};

export const sendMessage = (message: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  }
};

export const getConversations = async () => {
  const res = await api.get("/chat/conversations/");
  return res.data;
};

export const disconnectChat = () => {
  if (socket) socket.close();
};




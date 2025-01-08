import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

export const initializeSocket = () => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error: any) => {
    console.error("Socket error:", error);
  });
};

export const sendMessage = (message: {
  senderId: number;
  receiverId: number;
  text: string;
}) => {
  socket.emit("sendMessage", message);
};

export const receiveMessages = (
  callback: (message: {
    senderId: number;
    receiverId: number;
    text: string;
  }) => void
) => {
  socket.on("receiveMessage", callback);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};

export default socket;

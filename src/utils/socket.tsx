import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://192.168.100.117:5000");

export const initializeSocket = () => {
  console.log(socket);
  console.log("Socket connecting");
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });
  console.log("Socket connected");
};

export const userJoin = (userId: number) => {
  console.log("User Joining ");
  socket.emit("userJoined", JSON.stringify({ userId }));
  console.log("User Joined ");
};

export const sendMessage = (message: {
  sender_id: number;
  receiver_id: number;
  message: string;
}) => {
  socket.emit("sendMessage", JSON.stringify(message));
};

export const receiveMessages = (
  callback: (message: {
    sender_id: number;
    receiver_id: number;
    message: string;
    senderInfo: {
      id: number;
      username: string;
      full_name: string;
      profile_picture: string;
    };
    timestamp: string;
  }) => void
) => {
  socket.off("receiveMessage");
  socket.on("receiveMessage", callback);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};

export default socket;

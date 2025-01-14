import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://192.168.100.131:5000");

export const initializeSocket = () => {
  socket.on("connect", () => {
    console.log("Socket connected:");
  });
};

export const userJoin = (userId: number) => {
  socket.emit("userJoined", JSON.stringify({ userId }));
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

export const receiveNotifications = (
  callback: (notification: {
    sender_id: number;
    receiver_id: number;
    unreadMessagesCount: number;
  }) => void
) => {
  socket.off("newNotification");
  socket.on("newNotification", callback);
};

export const markMessagesAsRead = (userId: number, senderId: number) => {
  socket.emit("markMessagesAsRead", JSON.stringify({ userId, senderId }));
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};
export const newPost = (callback: (hasNewPost: boolean) => void) => {
  socket.on("newPost", (data) => {
    if (data === true) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

export const newEvent = (callback: (hasNewEvent: boolean) => void) => {
  socket.on("newEvent", (data) => {
    if (data === true) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

export default socket;

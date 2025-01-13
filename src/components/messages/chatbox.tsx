import { useNotification } from "@/context/notificationContext";
import axiosInstance from "@/utils/axiosInstance";
import socket, {
  markMessagesAsRead,
  receiveMessages,
  sendMessage,
} from "@/utils/socket";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface SenderInfo {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  timestamp: string; // Unified timestamp for both API and socket messages
}

interface ChatBoxProps {
  currentUserId: number;
  chatUserId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserId, chatUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { resetMessageNotification } = useNotification();
  const [message, setMessage] = useState("");
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-messages/${currentUserId}/${chatUserId}`
      );
      if (response?.data?.messages) {
        const normalizedMessages = response.data.messages.map((msg: any) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          message: msg.message,

          timestamp: msg.createdAt, // Normalize `createdAt` as `timestamp`
        }));
        setMessages(normalizedMessages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (chatUserId && currentUserId !== -1) {
      fetchMessages();
      resetMessageNotification(chatUserId);
    }

    const handleNewMessage = (newMessage: {
      sender_id: number;
      receiver_id: number;
      message: string;
      senderInfo: SenderInfo;
      timestamp: string;
    }) => {
      // Add new messages directly to the normalized state
      const normalizedMessage: Message = {
        id: Date.now(), // Temporary ID
        sender_id: newMessage.sender_id,
        receiver_id: newMessage.receiver_id,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
      };

      if (
        (normalizedMessage.sender_id === chatUserId &&
          normalizedMessage.receiver_id === currentUserId) ||
        (normalizedMessage.sender_id === currentUserId &&
          normalizedMessage.receiver_id === chatUserId)
      ) {
        setMessages((prev) => [...prev, normalizedMessage]);
        markMessagesAsRead(currentUserId, chatUserId);
      }
    };

    receiveMessages(handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [chatUserId, currentUserId, resetMessageNotification]);

  useEffect(() => {
    resetMessageNotification(chatUserId);
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    markMessagesAsRead(currentUserId, chatUserId);
  }, [messages]);

  // Handle sending a message
  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(), // Temporary ID
        sender_id: currentUserId,
        receiver_id: chatUserId,
        message,

        timestamp: new Date().toISOString(), // Use current time as timestamp
      };
      sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Group messages by date
  const categorizeMessagesByDate = () => {
    const groupedMessages: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = dayjs(msg.timestamp).format("YYYY-MM-DD");
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });
    return groupedMessages;
  };

  // Render date header
  const renderDateHeader = (date: string) => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    return dayjs(date).format("MMMM D, YYYY");
  };

  const groupedMessages = categorizeMessagesByDate();

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-full">
      <div
        className="flex-grow overflow-y-auto p-4 bg-opacity-0"
        style={{
          scrollbarWidth: "none",
          maxHeight: "calc(100vh - 160px)",
        }}
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="text-center text-red-500 border-gray-700 border-b-2 text-sm font-bold my-2">
              {renderDateHeader(date)}
            </div>
            {groupedMessages[date].map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  msg.sender_id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-white ${
                    msg.sender_id === currentUserId
                      ? "bg-red-800 text-right"
                      : "bg-gray-600 text-left"
                  }`}
                >
                  <p className="">{msg.message}</p>
                  <div className="text-[10px] text-gray-300 mt-1 text-right">
                    {dayjs(msg.timestamp).format("h:mm A")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={latestMessageRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-2 bg-gray-700 flex rounded-full mx-7 ">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-grow p-2 border bg-black border-none text-white rounded-full focus:outline-none"
          ref={inputRef}
        />
        <button
          onClick={handleSend}
          className={`ml-2 p-2 rounded-full ${
            message.trim()
              ? "bg-red-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!message.trim()}
        >
          <IoMdSend size={25} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

import axiosInstance from "@/utils/axiosInstance";
import socket, { receiveMessages, sendMessage } from "@/utils/socket";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

interface Message {
  sender_id: number;
  receiver_id: number;
  message: string;
}

interface ChatBoxProps {
  currentUserId: number;
  chatUserId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserId, chatUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-messages/${currentUserId}/${chatUserId}`
      );
      if (response && response?.data) {
        setMessages(response?.data?.messages);
      }
    } catch (err) {
      console.error("Error Fetching Messages", err);
    }
  };

  useEffect(() => {
    if (chatUserId && currentUserId !== -1) {
      fetchMessages();
    }
    const handleNewMessage = (newMessage: Message) => {
      if (
        newMessage.sender_id === chatUserId &&
        newMessage.receiver_id === currentUserId
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    receiveMessages(handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [chatUserId, currentUserId]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const content = {
        sender_id: currentUserId,
        receiver_id: chatUserId,
        message,
      };
      sendMessage(content);
      setMessages((prev) => [...prev, content]);
      setMessage("");
      inputRef.current?.focus(); // Focus input field after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-grow overflow-y-auto p-4 bg-opacity-0"
        style={{
          scrollbarWidth: "none",
          maxHeight: "calc(100vh - 160px)",
        }}
      >
        {messages.map((msg, index) => {
          if (
            (msg.sender_id === currentUserId &&
              msg.receiver_id === chatUserId) ||
            (msg.sender_id === chatUserId && msg.receiver_id === currentUserId)
          ) {
            return (
              <div
                key={index}
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
                  {msg.message}
                </div>
              </div>
            );
          }
          return null;
        })}

        <div ref={latestMessageRef}></div>
      </div>

      <div className="p-2 bg-gray-700 flex rounded-full mx-7">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Send message on Enter key press
          placeholder="Type a message"
          className="flex-grow p-2 border bg-black border-none text-white rounded-full focus:outline-none"
          ref={inputRef} // Reference for focusing
        />
        <button
          onClick={handleSend}
          className={`ml-2 p-2 rounded-full ${
            message.trim()
              ? "bg-red-600 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!message.trim()} // Disable button if message is empty
        >
          <IoMdSend size={25} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

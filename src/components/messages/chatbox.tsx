// components/ChatBox.tsx
import { receiveMessages, sendMessage } from "@/utils/socket";
import React, { useEffect, useState } from "react";

interface Message {
  senderId: number;
  receiverId: number;
  text: string;
}

interface ChatBoxProps {
  currentUserId: number;
  chatUserId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserId, chatUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    receiveMessages((newMessage) => {
      if (
        newMessage.senderId === chatUserId ||
        newMessage.receiverId === chatUserId
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
  }, [chatUserId, currentUserId]);

  const handleSend = () => {
    if (text.trim()) {
      const message = { senderId: currentUserId, receiverId: chatUserId, text };
      sendMessage(message);
      setMessages((prev) => [...prev, message]);
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 bg-gray-500 text-white">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.senderId === currentUserId ? "You" : "Them"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-200 flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 border border-gray-400 text-black rounded"
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

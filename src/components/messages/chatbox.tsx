import { useNotification } from "@/context/notificationContext";
import axiosInstance from "@/utils/axiosInstance";
import socket, {
  deleteMessage,
  isMessageDelete,
  markMessagesAsRead,
  receiveMessages,
  sendMessage,
} from "@/utils/socket";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdMoreVert, MdDeleteOutline, MdOutlineFileCopy } from "react-icons/md";

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
  timestamp?: string;
  createdAt?: string;
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [menuVisibleMessageId, setMenuVisibleMessageId] = useState<
    number | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const confirmDelete = () => {
    if (messageToDelete) {
      handleDelete(messageToDelete);
    }
    setShowConfirmation(false);
    setMessageToDelete(null);
  };

  const handleCopyText = (msg: Message) => {
    navigator.clipboard.writeText(msg.message);
    setMenuVisibleMessageId(null);
  };

  const handleDelete = (message: Message) => {
    setMenuVisibleMessageId(null);
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== message?.id)
    );
    deleteMessage(message?.id);
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-messages/${currentUserId}/${chatUserId}`
      );
      if (response?.data?.messages) {
        const normalizedMessages = response.data.messages.map(
          (msg: Message) => ({
            id: msg.id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            message: msg.message,

            timestamp: msg?.createdAt,
          })
        );
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
      const normalizedMessage: Message = {
        id: Date.now(),
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
    const handleDeletedMessage = (deletedMessage: Message) => {
      if (
        (deletedMessage.sender_id === chatUserId &&
          deletedMessage.receiver_id === currentUserId) ||
        (deletedMessage.sender_id === currentUserId &&
          deletedMessage.receiver_id === chatUserId)
      ) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== deletedMessage?.id)
        );
      }
    };

    isMessageDelete(handleDeletedMessage);
    return () => {
      socket.off("messageDeleted", handleDeletedMessage);
    };
  }, [chatUserId, currentUserId]);

  useEffect(() => {
    resetMessageNotification(chatUserId);
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    markMessagesAsRead(currentUserId, chatUserId);
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        sender_id: currentUserId,
        receiver_id: chatUserId,
        message,

        timestamp: new Date().toISOString(),
      };
      sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            <div className="relative flex items-center justify-center my-7">
              <span className="relative z-10 px-16 text-red-500 text-sm font-bold">
                {renderDateHeader(date)}
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
            </div>

            {groupedMessages[date].map((msg) => (
              <div
                key={msg.id}
                className={`relative mb-2 flex ${
                  msg.sender_id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => {
                  if (hoveredMessageId === msg.id) setHoveredMessageId(null);
                  setMenuVisibleMessageId(null);
                }}
              >
                <div
                  className={`max-w-xs px-3 pt-3 pb-1 rounded-lg text-white ${
                    msg.sender_id === currentUserId
                      ? "bg-red-800 text-right"
                      : "bg-gray-600 text-left"
                  }`}
                >
                  <p
                    className="text-left"
                    dangerouslySetInnerHTML={{
                      __html: msg?.message?.replace(/\n/g, "<br/>"),
                    }}
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  ></p>

                  <div className="text-[10px] text-gray-300 mt-1 text-right">
                    {dayjs(msg.timestamp).format("h:mm A")}
                  </div>
                  {msg.sender_id === currentUserId &&
                    hoveredMessageId === msg.id && (
                      <div
                        className="absolute top-1 right-0 cursor-pointer"
                        onClick={() =>
                          setMenuVisibleMessageId(
                            menuVisibleMessageId === msg.id ? null : msg.id
                          )
                        }
                      >
                        <MdMoreVert />
                      </div>
                    )}

                  {menuVisibleMessageId === msg.id && (
                    <div className="absolute top-6 right-2 bg-black text-white rounded shadow-lg z-10 py-2">
                      <button
                        onClick={() => handleCopyText(msg)}
                        className="flex justify-start gap-1 px-3 py-1 text-sm hover:bg-gray-600 w-full text-left"
                      >
                        <MdOutlineFileCopy size={20} color="red" /> Copy
                      </button>
                      <button
                        onClick={() => {
                          setMessageToDelete(msg);
                          setShowConfirmation(true);
                        }}
                        className=" px-3 flex justify-start gap-1 py-1 text-sm hover:bg-gray-600 w-full text-left"
                      >
                        <MdDeleteOutline size={20} color="red" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={latestMessageRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-1 bg-gray-700 flex rounded-full mx-5 ">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          placeholder="Type a message"
          className="flex-grow p-2 border bg-black border-none text-white rounded-full focus:outline-none resize-none"
          ref={inputRef}
          style={{ scrollbarWidth: "none" }}
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black border border-gray-400 p-5 rounded-md shadow-md max-w-sm mx-auto">
            <p className="text-center text-gray-300 mb-4 pb-3">
              <strong>Are you sure you want to delete this message?</strong>
            </p>
            <div className="flex justify-center gap-5 ">
              <button
                className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none transition"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

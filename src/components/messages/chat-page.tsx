"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import { useAuth } from "@/context/authContext";

const ChatPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        {selectedUserId ? (
          <ChatBox currentUserId={user?.id} chatUserId={selectedUserId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
      <Sidebar onUserSelect={setSelectedUserId} />
    </div>
  );
};

export default ChatPage;

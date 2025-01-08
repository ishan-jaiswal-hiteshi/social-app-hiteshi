"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import { useAuth } from "@/context/authContext";
import { useSearchParams } from "next/navigation";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Ensure currentUserId is never undefined, fallback to -1 if undefined
  const currentUserId = user?.id ?? -1;

  useEffect(() => {
    // Get `userid` from the query parameters on initial page load or refresh
    const userIdParam = searchParams.get("userid");
    if (userIdParam) {
      setSelectedUserId(parseInt(userIdParam, 10));
    }
  }, [searchParams]); // Runs every time the searchParams change (e.g., after page refresh or user selection)

  const handleUserSelect = (id: number) => {
    setSelectedUserId(id);

    // Update the URL with the selected user's ID without causing rerender or redirection
    //const url = `/messages?userid=${id}`;
    //window.history.pushState({}, "", url);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        {selectedUserId ? (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-gray-800 text-white flex items-center">
              <h2 className="text-lg font-semibold">
                Chat with User ID: {selectedUserId}
              </h2>
            </div>
            <ChatBox
              currentUserId={currentUserId}
              chatUserId={selectedUserId}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
      <Sidebar onUserSelect={handleUserSelect} />
    </div>
  );
};

export default ChatPage;

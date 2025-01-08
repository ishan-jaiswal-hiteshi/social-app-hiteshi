"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import { useAuth } from "@/context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { initializeSocket, userJoin } from "@/utils/socket";
import { User } from "@/props/authProps";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const currentUserId = user?.id ?? -1;

  useEffect(() => {
    const userIdParam = searchParams.get("userid");
    if (userIdParam) {
      setSelectedUserId(parseInt(userIdParam, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUserId !== -1) {
      initializeSocket();
      userJoin(currentUserId);
    }
  }, [currentUserId]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedUserId(user?.id);

    router.push(`?userid=${user?.id}`, undefined);
  };

  return (
    <div className="flex h-screen ">
      <div className="flex-grow mb-14 md:mb-1">
        {selectedUserId ? (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-black text-white flex items-center mt-4">
              <h2 className="text-lg font-semibold">
                Chat with: {selectedUser?.full_name}
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

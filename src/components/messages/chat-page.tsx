"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import { useAuth } from "@/context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/props/authProps";
import UserProfilePicture from "@/utils/user-profile-picture";
import axiosInstance from "@/utils/axiosInstance";
import LandingPage from "./landing-page";
import Link from "next/link";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const currentUserId = user?.id ?? -1;

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/get-user-by-id/${userId}`);
      if (response && response.data) {
        setSelectedUser(response?.data?.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const userIdParam = searchParams.get("userid");
    if (userIdParam) {
      const userId = parseInt(userIdParam, 10);
      setSelectedUserId(userId);
      fetchUserDetails(userId);
    }
  }, [searchParams]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedUserId(user?.id);
    router.push(`?userid=${user?.id}`, undefined);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-grow mb-2 md:mb-0 h-full">
        {selectedUserId ? (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-black text-white flex items-center mt-4">
              <Link href={`/dashboard/user/${selectedUser?.id}/profile`}>
                <div className="flex justify-start cursor-pointer">
                  <div className="mr-3 ">
                    {selectedUser?.profile_picture ? (
                      <img
                        src={selectedUser.profile_picture}
                        alt="profile"
                        className="w-10 h-10 rounded-full  object-cover"
                      />
                    ) : (
                      <UserProfilePicture
                        fullName={selectedUser?.full_name}
                        size={40}
                      />
                    )}
                  </div>
                  <div>
                    <strong>@{selectedUser?.username}</strong>
                    <p className="m-0 text-gray-500 text-sm">
                      {selectedUser?.full_name}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <ChatBox
              currentUserId={currentUserId}
              chatUserId={selectedUserId}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <LandingPage />
          </div>
        )}
      </div>
      <Sidebar
        onUserSelect={handleUserSelect}
        selectedUserId={selectedUserId ?? -1}
      />
    </div>
  );
};

export default ChatPage;

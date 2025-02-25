"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import UserProfilePicture from "@/utils/user-profile-picture";
import { User } from "@/props/authProps";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

interface Notification {
  id: number;
  type: string;
  createdAt: string;
  notifyData?: {
    postId?: number;
    user?: User;
    [key: string]: unknown;
  };
}

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-my-notification`);
      setNotifications(response?.data?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const renderNotificationMessage = (type: string) => {
    switch (type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "performed an action.";
    }
  };
  const navigateToProfile = (userId: number) => {
    router.push(`/dashboard/user/${userId}/profile`);
  };

  const handleNotificationClick = (
    type: string,
    userId?: number,
    postId?: number
  ) => {
    if (type === "like" || type === "comment") {
      if (postId) router.push(`/dashboard/home/${postId}`);
    } else {
      router.push(`/dashboard/user/${userId}/profile`);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg p-2 h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-400 sticky">
        <h2 className="text-lg text-white font-semibold">Notifications</h2>
      </div>
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : notifications.length > 0 ? (
        <div
          className="overflow-y-auto h-full"
          style={{ scrollbarWidth: "none" }}
        >
          <ul>
            {notifications?.map((notification) => (
              <li key={notification.id} className="px-1 py-2">
                <div className="relative flex items-center px-3 py-2">
                  <div
                    className="mr-3 cursor-pointer"
                    onClick={() =>
                      navigateToProfile(notification.notifyData?.user?.id || 0)
                    }
                  >
                    {notification?.notifyData?.user?.profile_picture ? (
                      <img
                        src={notification?.notifyData?.user?.profile_picture}
                        alt="profile"
                        className="w-10 h-10 rounded-full  object-cover"
                        onDragStart={(e) => e.preventDefault()}
                      />
                    ) : (
                      <UserProfilePicture
                        fullName={notification?.notifyData?.user?.full_name}
                        size={40}
                      />
                    )}
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      handleNotificationClick(
                        notification.type,
                        notification?.notifyData?.user?.id || 0,
                        notification?.notifyData?.postId || 0
                      )
                    }
                  >
                    <strong className="mr-2">
                      @{notification?.notifyData?.user?.username}
                    </strong>
                    <span className="text-sm text-white">
                      {renderNotificationMessage(notification.type)}
                    </span>
                    <span className="text-xs text-gray-300 mt-1 block">
                      {dayjs(notification.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          No notifications yet.
        </div>
      )}
    </div>
  );
};

export default Notifications;

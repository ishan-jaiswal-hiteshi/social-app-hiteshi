"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";

dayjs.extend(relativeTime);

interface Notification {
  id: number;
  type: string;
  createdAt: string;
}

interface NotificationsProps {
  visible: boolean;
  onClose?: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const response = await axiosInstance.get(`/get-notifications/${user.id}`);
      setNotifications(response?.data?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && user?.id) {
      fetchNotifications();
    }
  }, [visible, user?.id]);

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

  if (!visible) return null;

  return (
    <div className={`${onClose ? "fixed inset-1 inset-y-12 z-40 flex" : ""}`}>
      <div
        className={`w-full ${
          onClose ? "md:w-1/3" : "p-4"
        } bg-black border border-gray-600 rounded-lg overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-400">
          <h2 className="text-lg text-white font-semibold">Notifications</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y divide-gray-500">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4">
                <span className="text-sm text-gray-800">
                  {renderNotificationMessage(notification.type)}
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {dayjs(notification.createdAt).fromNow()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-400">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

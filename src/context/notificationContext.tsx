"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import socket, {
  newEvent,
  newPost,
  receiveNotifications,
} from "@/utils/socket";
import { useAuth } from "./authContext";

interface MessageNotification {
  sender_id: number;
  unreadMessagesCount: number;
  receiver_id: number;
}

interface NotificationContextType {
  messageNotifications: Record<number, number>;
  postNotifications: number;
  eventNotifications: number;
  resetMessageNotification: (senderId: number) => void;
  resetPostNotification: () => void;
  resetEventNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [messageNotifications, setMessageNotifications] = useState<
    Record<number, number>
  >(() => {
    if (typeof window !== "undefined") {
      const savedNotifications = localStorage.getItem("messageNotifications");
      return savedNotifications ? JSON.parse(savedNotifications) : {};
    }
    return {};
  });

  const [postNotifications, setPostNotifications] = useState<number>(0);
  const [eventNotifications, setEventNotifications] = useState<number>(0);

  const saveMessageNotifications = (
    updater: (prev: Record<number, number>) => Record<number, number>
  ) => {
    setMessageNotifications((prev) => {
      const updatedNotifications = updater(prev);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "messageNotifications",
          JSON.stringify(updatedNotifications)
        );
      }
      return updatedNotifications;
    });
  };

  const resetMessageNotification = useCallback((senderId: number) => {
    setMessageNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications, [senderId]: 0 };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "messageNotifications",
          JSON.stringify(updatedNotifications)
        );
      }

      return updatedNotifications;
    });
  }, []);

  const resetPostNotification = useCallback(() => {
    setPostNotifications(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("postNotifications", "0");
    }
  }, []);

  const resetEventNotification = useCallback(() => {
    setEventNotifications(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("eventNotifications", "0");
    }
  }, []);

  useEffect(() => {
    const handleNotification = (notification: MessageNotification) => {
      if (notification.receiver_id === user?.id) {
        saveMessageNotifications((prev) => ({
          ...prev,
          [notification.sender_id]: (prev[notification.sender_id] || 0) + 1,
        }));
      }
    };

    receiveNotifications(handleNotification);

    return () => {
      socket.off("receiveNotifications", handleNotification);
    };
  }, [user, messageNotifications]);

  useEffect(() => {
    const handlePostNotification = (isNewPost: boolean) => {
      if (isNewPost) {
        setPostNotifications((prev) => prev + 1);
      } else {
        setPostNotifications(0);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "postNotifications",
          JSON.stringify(postNotifications)
        );
      }
    };

    const handleEventNotification = (isNewEvent: boolean) => {
      if (isNewEvent) {
        setEventNotifications((prev) => prev + 1);
      } else {
        setEventNotifications(0);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "eventNotifications",
          JSON.stringify(eventNotifications)
        );
      }
    };

    newPost(handlePostNotification);
    newEvent(handleEventNotification);

    return () => {
      socket.off("newPost", handlePostNotification);
      socket.off("newEvent", handleEventNotification);
    };
  }, [postNotifications, eventNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        messageNotifications,
        postNotifications,
        eventNotifications,
        resetMessageNotification,
        resetPostNotification,
        resetEventNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

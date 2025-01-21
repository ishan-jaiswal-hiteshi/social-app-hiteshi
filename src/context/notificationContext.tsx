"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import socket, {
  newEvent,
  newPost,
  receiveNotifications,
} from "@/utils/socket";
import { useAuth } from "./authContext";
import axiosInstance from "@/utils/axiosInstance";

interface MessageNotification {
  sender_id: number;
  unreadMessagesCount: number;
  receiver_id: number;
}

interface NotificationContextType {
  messageNotifications: Record<number, number>;
  postNotifications: number;
  eventNotifications: number;
  myNotification: boolean;
  isMessage: boolean;
  resetMessageNotification: (senderId: number) => void;
  resetPostNotification: () => void;
  resetEventNotification: () => void;
  setIsMessage: Dispatch<SetStateAction<boolean>>;
  setMyNotification: Dispatch<SetStateAction<boolean>>;
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

  const [myNotification, setMyNotification] = useState(false);
  const [isMessage, setIsMessage] = useState(false);

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

  // useEffect(() => {
  //   const handleNewNotification = () => {
  //     setMyNotification(true);
  //   };

  //   socket.on("newLike", handleNewNotification);
  //   socket.on("newComment", handleNewNotification);
  //   socket.on("newFollow", handleNewNotification);

  //   return () => {
  //     socket.off("newLike", handleNewNotification);
  //     socket.off("newComment", handleNewNotification);
  //     socket.off("newFollow", handleNewNotification);
  //   };
  // }, []);

  useEffect(() => {
    const handleNotification = (notification: MessageNotification) => {
      if (notification.receiver_id === user?.id) {
        saveMessageNotifications((prev) => ({
          ...prev,
          [notification.sender_id]: (prev[notification.sender_id] || 0) + 1,
        }));
        setIsMessage(true);
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

  const getMyNotification = async () => {
    try {
      const response = await axiosInstance.get(
        `/is-my-notification/${user?.id}`
      );
      if (response) {
        setMyNotification(response?.data?.status);
      }
    } catch (err) {
      console.error("Error in getting status of my notification", err);
    }
  };

  const getMessageNotificationStatus = async () => {
    try {
      const response = await axiosInstance.get(`/is-new-message/${user?.id}`);
      if (response) {
        setIsMessage(response?.data?.status);
      }
    } catch (err) {
      console.error("Error in getting status of message notification", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getMyNotification();
      getMessageNotificationStatus();
    }
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        messageNotifications,
        postNotifications,
        eventNotifications,
        myNotification,
        isMessage,
        resetMessageNotification,
        resetPostNotification,
        resetEventNotification,
        setIsMessage,
        setMyNotification,
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

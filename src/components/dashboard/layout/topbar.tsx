"use client";

import { useNotification } from "@/context/notificationContext";
import Link from "next/link";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineEvent } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";

const TopbarLayout = () => {
  const {
    isMessage,
    eventNotifications,
    resetEventNotification,
    myNotification,
    setMyNotification,
  } = useNotification();
  const navItems = [
    {
      path: "/dashboard/events",
      icon: (
        <div className="relative">
          <MdOutlineEvent size={24} />
          {eventNotifications > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>
      ),
      onClick: () => resetEventNotification(),
    },
    {
      path: "/dashboard/messages",
      icon: (
        <div className="relative">
          <IoChatboxEllipsesOutline size={24} />
          {isMessage && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>
      ),
    },
    {
      path: "/dashboard/notifications",
      icon: (
        <div className="relative">
          <IoIosNotificationsOutline size={24} />
          {myNotification && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>
      ),
      onClick: () => setMyNotification(false),
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-black  border-b border-gray-700">
        <Link
          className="text-md font-semibold text-white mx-5 my-3"
          href="/dashboard/home"
        >
          Socialize@Hiteshi
        </Link>

        <div className="flex justify-around text-center">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={item?.onClick}
              className="cursor-pointer text-white  p-2"
            >
              <Link href={item.path}>{item.icon}</Link>
            </div>
          ))}
        </div>
      </header>
    </>
  );
};

export default TopbarLayout;

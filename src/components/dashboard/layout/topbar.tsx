"use client";

import Link from "next/link";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineEvent } from "react-icons/md";

const TopbarLayout = () => {
  const navItems = [
    {
      path: "/dashboard/events",
      icon: <MdOutlineEvent size={26} />,
    },
    {
      path: "/dashboard/messages",
      icon: <IoChatboxEllipsesOutline size={26} />,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-black  border-b border-gray-700">
      <Link
        className="text-md font-semibold text-white mx-5 my-3"
        href="/dashboard/home"
      >
        Socialize@Hiteshi
      </Link>

      <div className="flex justify-around text-center">
        {navItems.map((item, index) => (
          <div key={index} className="cursor-pointer text-white  p-2">
            <Link href={item.path}>{item.icon}</Link>
          </div>
        ))}
      </div>
    </header>
  );
};

export default TopbarLayout;

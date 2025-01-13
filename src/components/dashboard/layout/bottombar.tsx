"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import UserProfilePicture from "@/utils/user-profile-picture";
import { usePathname } from "next/navigation";
import { useNotification } from "@/context/notificationContext";

const BottombarLayout = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { postNotifications, resetPostNotification } = useNotification();

  const navItems = [
    {
      path: "/dashboard/home",
      icon: (
        <div className="relative">
          <AiOutlineHome size={24} />
          {postNotifications > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>
      ),
      onClick: () => resetPostNotification(),
      name: "Home",
    },
    {
      path: "/dashboard/search",
      icon: <IoMdSearch size={26} />,
      name: "Search",
    },
    {
      path: "/dashboard/create-post",
      icon: <MdAddCircleOutline size={26} />,
      name: "Create Post",
    },
    {
      path: "/dashboard/users",
      icon: <LuUsersRound size={26} />,
      name: "Users",
    },
    {
      path: "/dashboard/profile",
      icon: user?.profile_picture ? (
        <img
          src={
            user?.profile_picture ||
            "https://i.pinimg.com/736x/1a/09/3a/1a093a141eeecc720c24543f2c63eb8d.jpg"
          }
          alt="profile"
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <UserProfilePicture fullName={user?.full_name} size={20} />
      ),
      name: "Profile",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <footer className="md:hidden bg-[#00070C] text-white py-3 text-center fixed bottom-0 left-0 right-0">
      <div className="flex justify-around">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={item?.onClick}
            className={`cursor-pointer rounded-xl p-2 ${
              isActive(item.path) ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <Link href={item.path}>{item.icon}</Link>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default BottombarLayout;

"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineEvent } from "react-icons/md";
import UserProfilePicture from "@/utils/user-profile-picture";
import { usePathname } from "next/navigation";

const SidebarLayout = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      path: "/dashboard/home",
      icon: <AiOutlineHome size={24} />,
    },
    {
      name: "Search",
      path: "/dashboard/search",
      icon: <IoMdSearch size={24} />,
    },
    {
      name: "Create Post",
      path: "/dashboard/create-post",
      icon: <MdAddCircleOutline size={24} />,
    },
    {
      name: "Events",
      path: "/dashboard/events",
      icon: <MdOutlineEvent size={24} />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <LuUsersRound size={24} />,
    },
    {
      name: "Profile",
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
        <UserProfilePicture fullName={user?.full_name} size={24} />
      ),
    },
  ];

  const isActive = (path: string) => pathname === path;
  return (
    <aside className="hidden md:flex bg-[#00070C] text-white p-4 w-52  fixed left-0 top-0 bottom-0  border-r border-gray-500">
      <div className="flex flex-col h-full justify-between items-start">
        <div className="mt-2 cursor-pointer hover:bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg">
          <Link className="text-lg font-bold" href="/dashboard/home">
            Socialize@Hiteshi
          </Link>
        </div>

        <nav className="flex-grow flex flex-col justify-center w-full">
          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`cursor-pointer flex gap-2 items-center px-2 py-2 rounded-lg ${
                    isActive(item.path) ? "bg-gray-700" : "hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <p>{item.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bocursor-pointer hover:bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg">
          <Link
            href="/"
            onClick={() => {
              localStorage.removeItem("accessToken");
            }}
            className=" flex gap-2 items-center "
          >
            <FiLogOut size={20} color="#E41B17" />
            <p className="text-primary-dark">Log out</p>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLayout;

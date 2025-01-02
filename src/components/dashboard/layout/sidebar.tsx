"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import UserProfilePicture from "@/utils/user-profile-picture";

const SidebarLayout = () => {
  const { user } = useAuth();
  return (
    <aside className="hidden md:flex bg-[#00070C] text-white p-4 w-52  fixed left-0 top-0 bottom-0">
      <div className="flex flex-col h-full justify-between items-start">
        <div className="mt-2">
          <Link
            className="text-lg font-bold  border border-gray-600 px-4 py-2 rounded-lg cursor-pointer"
            href="/dashboard/home"
          >
            Socialize@Hiteshi
          </Link>
        </div>

        <nav className="flex-grow flex flex-col justify-center">
          <ul className="space-y-6">
            <Link
              href="/dashboard/home"
              className="hover:text-gray-300 cursor-pointer active  flex gap-2 items-center"
            >
              <AiOutlineHome size={24} />
              <p>Home</p>
            </Link>
            <Link
              href="/dashboard/search"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <IoMdSearch size={24} />
              <p>Search</p>
            </Link>
            <Link
              href="/dashboard/create-post"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <MdAddCircleOutline size={24} />
              <p>Create Post</p>
            </Link>

            <Link
              href="/dashboard/users"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <LuUsersRound size={24} />
              <p>Users</p>
            </Link>
            <Link
              href="/dashboard/profile"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              {user?.profile_picture ? (
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
              )}
              <p>Profile</p>
            </Link>
          </ul>
        </nav>

        <div>
          <Link
            href="/"
            onClick={() => {
              localStorage.removeItem("accessToken");
            }}
            className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
          >
            <FiLogOut size={20} color="#FF5555" />
            <p className="text-red-500">Log out</p>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLayout;

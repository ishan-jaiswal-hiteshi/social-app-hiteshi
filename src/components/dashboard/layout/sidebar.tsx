"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";

const SidebarLayout = () => {
  const { user } = useAuth();
  return (
    <aside className="hidden md:flex bg-[#00070C] text-white p-4 w-52 fixed left-0 top-0 bottom-0">
      <div className="flex flex-col h-full justify-between items-center">
        <div>
          <p className="text-lg font-bold">Socialize@Hiteshi</p>
        </div>

        <nav className="flex-grow flex flex-col justify-center">
          <ul className="space-y-6">
            <Link
              href="/dashboard/home"
              className="hover:text-gray-300 cursor-pointer active  flex gap-2 items-center"
            >
              <AiOutlineHome size={20} />
              <p>Home</p>
            </Link>
            <Link
              href="/dashboard/search"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <IoMdSearch size={20} />
              <p>Search</p>
            </Link>
            <Link
              href="/dashboard/create-post"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <MdAddCircleOutline size={20} />
              <p>Create Post</p>
            </Link>

            <Link
              href="/dashboard/users"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <LuUsersRound size={20} />
              <p>Users</p>
            </Link>
            <Link
              href="/dashboard/profile"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <img
                src={
                  user?.profile_picture ||
                  "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                }
                alt="profile"
                className="w-6 h-6 rounded-full"
              />
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

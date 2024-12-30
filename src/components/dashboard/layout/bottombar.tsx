"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";

const BottombarLayout = () => {
  const { user } = useAuth();
  return (
    <footer className="md:hidden bg-[#00070C] text-white py-3 text-center fixed bottom-0 left-0 right-0 ">
      <div className="flex justify-around">
        <Link
          href="/dashboard/home"
          className="hover:text-gray-300 cursor-pointer"
        >
          <AiOutlineHome size={20} />
        </Link>
        <Link
          href="/dashboard/search"
          className="hover:text-gray-300 cursor-pointer"
        >
          <IoMdSearch size={20} />
        </Link>
        <Link
          href="/dashboard/create-post"
          className="hover:text-gray-300 cursor-pointer"
        >
          <MdAddCircleOutline size={20} />
        </Link>
        <Link
          href="/dashboard/users"
          className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
        >
          <LuUsersRound size={20} />
        </Link>
        <Link
          href="/dashboard/profile"
          className="hover:text-gray-300 cursor-pointer"
        >
          <img
            src={
              user?.profile_picture ||
              "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
            }
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
        </Link>
      </div>
    </footer>
  );
};

export default BottombarLayout;

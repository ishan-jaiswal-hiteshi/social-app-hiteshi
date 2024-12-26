"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React from "react";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
              <p>Home</p>
            </Link>
            <Link
              href="/dashboard/search"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
              <p>Search</p>
            </Link>
            <Link
              href="/dashboard/create-post"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
              <p>Create Post</p>
            </Link>
            <Link
              href="/dashboard/profile"
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <img
                src={user?.profile_picture}
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
              // Clear the accessToken from localStorage
              localStorage.removeItem("accessToken");
            }}
            className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="red"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <p className="text-red-500">Log out</p>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLayout;

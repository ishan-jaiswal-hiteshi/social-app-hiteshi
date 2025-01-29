"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch, IoIosNotificationsOutline } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineEvent } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import UserProfilePicture from "@/utils/user-profile-picture";
import { usePathname, useRouter } from "next/navigation";
import { useNotification } from "@/context/notificationContext";
import Notifications from "@/components/notification";

const SidebarLayout = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const {
    isMessage,
    postNotifications,
    eventNotifications,
    resetPostNotification,
    resetEventNotification,
    myNotification,
    setMyNotification,
  } = useNotification();

  const handlNotificationClick = () => {
    if (!showNotifications) {
      setMyNotification(false);
      setShowNotifications(true);
    } else {
      setShowNotifications(false);
    }
  };

  const navItems = [
    {
      name: "Home",
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
      name: "Notifications",
      path: "#",
      icon: (
        <div className="relative">
          <IoIosNotificationsOutline size={24} />
          {myNotification && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
          )}
        </div>
      ),
      onClick: () => handlNotificationClick(),
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <LuUsersRound size={24} />,
    },
    {
      name: "Chats",
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
          onDragStart={(e) => e.preventDefault()}
        />
      ) : (
        <UserProfilePicture fullName={user?.full_name} size={24} />
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowNotifications(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth > 768 && pathname === "/dashboard/notifications") {
      router.push("/dashboard/home");
    }
  }, [pathname, router]);

  useEffect(() => {
    if (showNotifications) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <aside className="hidden md:flex bg-[#00070C] text-white p-4 w-52 fixed left-0 top-0 bottom-0 border-r border-gray-500">
        <div className="flex flex-col h-full justify-between items-start">
          <div className="mt-2 cursor-pointer hover:bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg">
            <Link className="text-lg font-bold" href="/dashboard/home">
              Socialize@Hiteshi
            </Link>
          </div>

          <nav className="flex-grow flex flex-col justify-start mt-8 w-full">
            <ul className="space-y-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item?.path}
                    onClick={item?.onClick}
                    className={`cursor-pointer flex gap-2 items-center px-2 py-2 rounded-lg ${
                      isActive(item?.path) ? "bg-gray-700" : "hover:bg-gray-800"
                    }`}
                  >
                    {item?.icon}
                    <p>{item?.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="cursor-pointer border border-gray-600 hover:bg-gray-800 px-3 py-2 rounded-lg w-full"
            onClick={() => setShowLogoutModal(true)}
          >
            <button className="flex gap-2 items-center">
              <FiLogOut size={20} color="white" />
              <p className="text-white ">Log out</p>
            </button>
          </div>
        </div>
      </aside>
      {showNotifications && (
        <div className="fixed top-16 left-56 bottom-16 flex items-center justify-center z-50 w-96">
          <div className="relative bg-black text-white px-1 py-4 rounded-lg shadow-lg max-w-md w-full mx-4 border h-full border-gray-500">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              ✕
            </button>
            <div className="h-full overflow-hidden pb-10">
              <Notifications />
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" bg-black text-white px-4 py-4 rounded-lg shadow-lg max-w-md w-full mx-4 border  border-gray-500">
            <p className="text-center text-gray-300 mb-4 pb-3">
              <strong>
                Are you sure you want to log out from Socialize@Hiteshi?
              </strong>
            </p>
            <div className="flex justify-center gap-5 ">
              <button
                className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarLayout;

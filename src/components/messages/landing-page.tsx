"use client";

import React from "react";
import { useAuth } from "@/context/authContext";
import UserProfilePicture from "@/utils/user-profile-picture";
import Link from "next/link";
import { toast } from "react-toastify";

const LandingPage = () => {
  const { user } = useAuth();
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleShareProfile = async () => {
    const copyLink = `${window.location.origin}/dashboard/user/${user?.id}/profile`;

    const fallbackCopyText = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("link copied to clipboard!");
    };

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copyLink);
        toast.success("link copied to clipboard!");
      } else {
        fallbackCopyText(copyLink);
      }
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="h-screen my-8 flex flex-col items-center pb-16 pt-8 md:pb-8  w-4/5">
      <div className="w-full max-w-4xl text-center mb-8 mt-8">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 bg-black rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.profile_picture ? (
              <img
                alt="Profile"
                src={user?.profile_picture}
                className="object-cover w-full h-full rounded-full"
                onDragStart={(e) => e.preventDefault()}
              />
            ) : (
              <UserProfilePicture fullName={user?.full_name} size={150} />
            )}
          </div>
          <h1 className="text-2xl font-bold mt-4">{getGreeting()}</h1>
          <h2 className="text-xl text-gray-400">@{user?.username}</h2>
          <button
            onClick={handleShareProfile}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800"
          >
            Share profile
          </button>
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-black border-2 border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center">
          <img
            src="/gifs/connect.gif"
            alt="Easy meetings"
            className="h-24 mb-4"
            onDragStart={(e) => e.preventDefault()}
          />
          <h3 className="text-lg font-semibold mb-2">
            Easy meetings with anyone
          </h3>
          <p className="text-gray-500 text-sm text-center mb-4">
            Share the invite with anyone even if they aren't on
            Socialize@Hiteshi. No downloads required.
          </p>
          {/* <Link href={"./users"}>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Meet Now
            </button>
          </Link> */}
        </div>

        <div className="bg-black border-2 border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center">
          <img
            src="/gifs/chats.gif"
            alt="Dial pad"
            className="h-24 mb-4"
            onDragStart={(e) => e.preventDefault()}
          />
          <h3 className="text-lg font-semibold mb-2">Chat with anyone</h3>
          <p className="text-gray-500 text-sm text-center mb-4">
            Chats on Socialize@Hiteshi are always free. Stay connected anytime,
            anywhere with seamless messaging.
          </p>
          {/* <Link href={"./messages"}>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Chat now
            </button>
          </Link> */}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

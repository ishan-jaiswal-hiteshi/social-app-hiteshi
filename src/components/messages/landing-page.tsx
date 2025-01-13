"use client";

import React from "react";
import { useAuth } from "@/context/authContext";
import UserProfilePicture from "@/utils/user-profile-picture";
import Link from "next/link";

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
    const profileLink = `http://localhost:3000/dashboard/user/${user?.id}/profile`;

    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this profile!",
          text: `Hey, check out ${user?.full_name}'s profile.`,
          url: profileLink,
        });
        alert("Profile link shared successfully!");
      } catch (error) {
        console.error("Error sharing profile link:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(profileLink);
        alert("Profile link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy profile link:", error);
        alert("Failed to copy the profile link. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen my-8 flex flex-col items-center py-8  w-4/5">
      <div className="w-full max-w-4xl text-center mb-8 mt-8">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 bg-blue-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.profile_picture ? (
              <img
                alt="Profile"
                src={user?.profile_picture}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <UserProfilePicture fullName={user?.full_name} size={150} />
            )}
          </div>
          <h1 className="text-2xl font-bold mt-4">{getGreeting()}</h1>
          <h2 className="text-xl text-gray-600">@{user?.username}</h2>
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
            src="/gifs/connect.gif" // Replace with actual SVG/image path
            alt="Easy meetings"
            className="h-24 mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">
            Easy meetings with anyone
          </h3>
          <p className="text-gray-600 text-sm text-center mb-4">
            Share the invite with anyone even if they aren’t on Skype. No sign
            ups or downloads required.
          </p>
          <Link href={"./users"}>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Meet Now
            </button>
          </Link>
        </div>

        <div className="bg-black border-2 border-gray-700 rounded-lg shadow-lg p-6 flex flex-col items-center">
          <img
            src="/gifs/chats.gif" // Replace with actual SVG/image path
            alt="Dial pad"
            className="h-24 mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Chat with anyone</h3>
          <p className="text-gray-600 text-sm text-center mb-4">
            Skype to Skype calls are always free, but you can also call mobiles
            and landlines from Skype at great low rates.
          </p>
          <Link href={"./messages"}>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Chat now
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

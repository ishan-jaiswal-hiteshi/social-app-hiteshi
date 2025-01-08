import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/axiosInstance";
import UserProfilePicture from "@/utils/user-profile-picture";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type UserData = {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
};

type UserDataProps = {
  userData: UserData;
  followStatus: boolean;
};

const UserCardList: React.FC<UserDataProps> = ({ userData, followStatus }) => {
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(followStatus);
  const router = useRouter();

  const profileNavigation = () => {
    if (user?.id === userData?.id) {
      router.push(`/dashboard/profile`);
    }
    router.push(`/dashboard/user/${userData?.id}/profile`);
  };

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/add-follower/${userData?.id}`, {
        followerId: user?.id,
      });
      await axiosInstance.post(`/add-following/${user?.id}`, {
        followingId: userData?.id,
      });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          other_data: {
            ...prevUser.other_data,
            followings: (prevUser.other_data?.followings || 0) + 1,
          },
        };
      });
      setIsFollowing(true);
    } catch (err) {
      console.error("Error in following user: ", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.post(`/remove-following/${user?.id}`, {
        followingId: userData?.id,
      });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          other_data: {
            ...prevUser.other_data,
            followings: (prevUser.other_data?.followings || 0) - 1,
          },
        };
      });
      setIsFollowing(false);
    } catch (err) {
      console.error("Error in unfollowing user: ", err);
    }
  };

  return (
    <div className="block border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black">
      <div className="flex justify-between items-center p-3">
        <div
          className="flex items-center cursor-pointer"
          onClick={profileNavigation}
        >
          {userData?.profile_picture ? (
            <img
              src={userData?.profile_picture}
              alt="profile"
              className="w-16 h-16 rounded-full mr-3"
              onDragStart={(e) => e.preventDefault()}
            />
          ) : (
            <div className="mr-3">
              <UserProfilePicture fullName={userData?.full_name} size={64} />
            </div>
          )}
          <div>
            <strong>{userData?.full_name}</strong>
            <p className="m-0 text-gray-500 text-sm truncate w-[ch-20]">
              @{userData?.username}
            </p>
          </div>
        </div>

        <div className="cursor-pointer w-[100px]">
          {user && user?.id === userData?.id ? (
            <></>
          ) : isFollowing ? (
            <button
              className="border border-gray-500 text-white px-2 py-1  w-full  rounded"
              onClick={handleUnfollow}
            >
              Following
            </button>
          ) : (
            <button
              className="bg-primary-dark text-white px-2 py-1 w-full rounded hover:bg-primary-light "
              onClick={handleFollow}
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCardList;

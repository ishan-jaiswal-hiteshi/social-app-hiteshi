import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/axiosInstance";
import React, { useState } from "react";

type UserData = {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
};
type UserDataProps = {
  userData: UserData;
  followStatus: boolean;
};

const UserCard: React.FC<UserDataProps> = ({ userData, followStatus }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(followStatus);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/add-follower/${userData?.id}`, {
        followerId: user?.id,
      });
      await axiosInstance.post(`/add-following/${user?.id}`, {
        followingId: userData?.id,
      });
      setIsFollowing(true);
    } catch (err) {
      console.error("Error in following user: ", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.post(`/remove-follower/${user?.id}`, {
        followerId: userData?.id,
      });
      setIsFollowing(false);
    } catch (err) {
      console.error("Error in unfollowing user: ", err);
    }
  };

  return (
    <>
      {user?.id !== userData?.id && (
        <div className="border border-gray-600 rounded-lg w-full mx-2  my-5 font-sans bg-black">
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center">
              <img
                src={
                  userData?.profile_picture ||
                  "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                }
                alt="profile"
                className="w-16 h-16 rounded-full mr-3"
              />
              <div>
                <strong>{userData?.full_name}</strong>
                <p className="m-0 text-gray-500 text-sm truncate w-[ch-20]">
                  @{userData?.username}
                </p>
              </div>
            </div>

            <div className="cursor-pointer">
              {isFollowing ? (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={handleUnfollow}
                >
                  Following
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-400"
                  onClick={handleFollow}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;

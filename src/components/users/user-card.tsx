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
  const router = useRouter();

  const profileNavigation = () => {
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
      setIsFollowing(false);
    } catch (err) {
      console.error("Error in unfollowing user: ", err);
    }
  };

  return (
    <>
      {user?.id !== userData?.id && (
        <div>
          {/* Mobile UI */}
          <div className="block md:hidden border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black">
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
                    <UserProfilePicture
                      fullName={userData?.full_name}
                      size={64}
                    />
                  </div>
                )}
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

          {/* Desktop UI */}
          <div className="hidden md:block w-60 h-64 m-2 max-w-sm bg-black border border-gray-600 rounded-lg shadow-lg">
            <div className="flex flex-col items-center pt-10">
              <div
                className="cursor-pointer justify-center items-center flex-col flex"
                onClick={profileNavigation}
              >
                <div className="mb-4">
                  {userData?.profile_picture ? (
                    <img
                      src={userData?.profile_picture}
                      alt="profile"
                      className="w-16 h-16 rounded-full mr-3"
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <UserProfilePicture
                      fullName={userData?.full_name}
                      size={64}
                    />
                  )}
                </div>
                <h5 className="mb-1 text-lg font-medium text-white">
                  {userData?.full_name}
                </h5>
                <span className="text-sm text-gray-500">
                  @{userData?.username}
                </span>
              </div>
              <div className="flex mt-4">
                {isFollowing ? (
                  <button
                    className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-400"
                    onClick={handleUnfollow}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-400"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                )}
              </div>
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
      )}
    </>
  );
};

export default UserCard;

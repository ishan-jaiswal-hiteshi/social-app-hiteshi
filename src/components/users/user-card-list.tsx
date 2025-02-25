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
  follow_status: string;
};

type UserDataProps = {
  userData: UserData;
};

const UserCardList: React.FC<UserDataProps> = ({ userData }) => {
  const { user, setUser } = useAuth();
  const [following, setFollowing] = useState<string>(userData?.follow_status);

  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const router = useRouter();

  const profileNavigation = () => {
    if (user?.id === userData?.id) {
      router.push(`/dashboard/profile`);
    }
    router.push(`/dashboard/user/${userData?.id}/profile`);
  };

  const handleFollow = async () => {
    try {
      setButtonLoading(true);

      const response = await axiosInstance.post(`/add-following`, {
        followingId: userData?.id,
      });

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followings: (prevUser?.followings || 0) + 1,
        };
      });

      setFollowing(response?.data?.follow_status);
    } catch (err) {
      console.error("Error in following user: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setButtonLoading(true);
      const response = await axiosInstance.post(`/remove-following`, {
        followingId: userData?.id,
      });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followings: (prevUser?.followings || 0) - 1,
        };
      });
      setFollowing(response?.data?.follow_status);
    } catch (err) {
      console.error("Error in unfollowing user: ", err);
    }
    setButtonLoading(false);
  };

  return (
    <div className="block border border-gray-600 rounded-lg w-full md:mx-2 my-2 font-sans bg-black">
      <div className="flex justify-between items-center py-3 px-1 md:px-3">
        <div
          className="flex items-center cursor-pointer"
          onClick={profileNavigation}
        >
          {userData?.profile_picture ? (
            <img
              src={userData?.profile_picture}
              alt="profile"
              className="md:w-16 w-10 h-10 md:h-16 rounded-full md:mr-3 mr-1"
              onDragStart={(e) => e.preventDefault()}
            />
          ) : (
            <div className="md:mr-3 mr-1">
              <UserProfilePicture fullName={userData?.full_name} size={60} />
            </div>
          )}
          <div>
            <strong className="md:truncate w-[ch-12]">
              @{userData?.username}
            </strong>
            <p className="m-0 text-gray-500 text-sm truncate w-[ch-20]">
              {userData?.full_name}
            </p>
          </div>
        </div>

        <div className="cursor-pointer w-[100px]">
          {user && user?.id === userData?.id ? (
            <></>
          ) : following === "followed" ? (
            <button
              onClick={handleUnfollow}
              className="border-gray-500 border active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              {buttonLoading ? (
                <div
                  className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Following"
              )}
            </button>
          ) : following === "pending" ? (
            <button
              onClick={handleUnfollow}
              className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              {buttonLoading ? (
                <div
                  className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Pending"
              )}
            </button>
          ) : following === "follow_back" ? (
            <button
              onClick={handleFollow}
              className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              {buttonLoading ? (
                <div
                  className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Follow Back"
              )}
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              {buttonLoading ? (
                <div
                  className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Follow"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCardList;

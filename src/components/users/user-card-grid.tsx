import { useAuth } from "@/context/authContext";
import UserProfilePicture from "@/utils/user-profile-picture";
import { useRouter } from "next/navigation";
import React from "react";

type UserData = {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
};

type UserDataProps = {
  userData: UserData;
};

const UserCardGrid: React.FC<UserDataProps> = ({ userData }) => {
  const { user } = useAuth();
  const router = useRouter();

  const profileNavigation = () => {
    if (user?.id === userData?.id) {
      router.push(`/dashboard/profile`);
    }
    router.push(`/dashboard/user/${userData?.id}/profile`);
  };

  return (
    <div className=" md:block w-60  m-2 max-w-sm bg-black border border-gray-600 rounded-lg shadow-lg">
      <div className="flex flex-col items-center py-5">
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
              <UserProfilePicture fullName={userData?.full_name} size={64} />
            )}
          </div>
          <h5 className="mb-1 text-lg font-medium text-white">
            @{userData?.username}
          </h5>
          <span className="text-sm text-gray-500">{userData?.full_name}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCardGrid;

"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import UserCard from "./user-card";
import { useAuth } from "@/context/authContext";
import { UserListSkeleton } from "@/utils/skeletons";
interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
}

const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [followings, setFollowings] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const [usersResponse, followingsResponse] = await Promise.all([
        axiosInstance.get("/get-all-users"),
        axiosInstance.get(`/get-followings/${user.id}`),
      ]);

      if (usersResponse?.data?.users) {
        setUsers(usersResponse.data.users);
      } else {
        console.warn("No users data received from API.");
      }

      if (followingsResponse?.data?.following) {
        setFollowings(followingsResponse.data.following);
      } else {
        console.warn("No followings data received from API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch users or followings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return <UserListSkeleton />;
  }

  return (
    <div className="p-2">
      <div className="m-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2">
        {users && users.length > 0 ? (
          users.map((userData) => {
            const isFollowing = followings.some(
              (data) => data.id === userData.id
            );
            return user?.id !== userData.id ? (
              <UserCard
                key={userData.id}
                userData={userData}
                followStatus={isFollowing}
              />
            ) : null;
          })
        ) : (
          <p className="text-center text-gray-500">No Users Available</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;

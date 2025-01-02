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
  const [loading, setLoading] = useState<boolean>(true);
  const [followings, setFollowings] = useState<UserData[]>([]);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance("/get-all-users");
      if (response?.data?.users) {
        setUsers(response.data.users);
      } else {
        console.warn("No users data received from API.");
      }
    } catch (error) {
      console.error("Error in fetching users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowings = async () => {
    try {
      if (!user?.id) return;
      const response = await axiosInstance.get(`/get-followings/${user.id}`);
      if (response?.data?.following) {
        setFollowings(response.data.following);
      } else {
        console.warn("No followings data received from API.");
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    if (user) {
      fetchFollowings();
    }
  }, [user]);

  if (loading) {
    return <UserListSkeleton />;
  }

  return (
    <div className="p-2">
      <div className="m-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 sm:ml-52 lg:grid-cols-3 gap-2">
        {users && users.length > 0 ? (
          users.map((userData) =>
            user?.id !== userData.id ? (
              <UserCard
                key={userData.id}
                userData={userData}
                followStatus={followings.some(
                  (data) => data.id === userData.id
                )}
              />
            ) : null
          )
        ) : (
          <p className="text-center text-gray-500">No Users Available</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;

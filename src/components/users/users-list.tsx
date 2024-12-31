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

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [followings, setFollowings] = useState<UserData[] | []>([]);

  const getAllUsers = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance("/get-all-users");
      if (response?.data) {
        setUsers(response?.data?.users);
      }
    } catch (error) {
      console.error("Error in fetching users", error);
      toast.error("Error in fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axiosInstance.get(`get-followings/${user?.id}`);
      if (response && response?.data) {
        setFollowings(response?.data?.following);
      }
    } catch (err) {
      console.log("Error In Fetching list of Followings,", err);
    }
  };

  useEffect(() => {
    getAllUsers();
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  if (loading) {
    <UserListSkeleton />;
  }

  return (
    <div className="p-2">
      <div className="m-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 sm:ml-52 lg:grid-cols-3 gap-2">
        {!loading && users && users?.length > 0
          ? users?.map((user) => {
              const isFollowing = followings?.some(
                (data) => data?.id === user?.id
              );
              return (
                <UserCard
                  key={user.id}
                  userData={user}
                  followStatus={isFollowing}
                />
              );
            })
          : !loading && (
              <p className="text-center text-gray-500">No User Available</p>
            )}
      </div>
    </div>
  );
};

export default UsersList;

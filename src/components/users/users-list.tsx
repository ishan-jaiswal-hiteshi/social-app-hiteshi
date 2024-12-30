"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import UserCard from "./user-card";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="p-2">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="animate-spin inline-block text-center w-12 h-12 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="mb-10">
        {!loading && users && users.length > 0
          ? users.map((user) => <UserCard key={user.id} userData={user} />)
          : !loading && (
              <p className="text-center text-gray-500">No User Available</p>
            )}
      </div>
    </div>
  );
};

export default UsersList;

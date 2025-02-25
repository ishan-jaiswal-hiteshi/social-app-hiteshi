"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import UserCard from "./user-card";
import { useAuth } from "@/context/authContext";
import { UserDynamicListSkeleton } from "@/utils/skeletons";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  follow_status: string;
  createdAt: string;
  updatedAt: string;
}

const LIMIT = 10;

const UsersList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const getAllUsers = async (offsetValue: number) => {
    try {
      const response = await axiosInstance.get("/get-all-users", {
        params: { limit: LIMIT, offset: offsetValue },
      });

      let fetchedUsers = response?.data?.users || [];

      if (fetchedUsers.length > 0) {
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          fetchedUsers.forEach((user: UserData) => {
            if (
              !updatedUsers.some((existingUser) => existingUser.id === user.id)
            ) {
              updatedUsers.push(user);
            }
          });
          return updatedUsers;
        });
      }

      if (fetchedUsers.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setUsers([]);
      setOffset(0);
      setHasMore(true);
      getAllUsers(0);
    }
  }, [user?.id]);

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + LIMIT);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (offset > 0) {
      getAllUsers(offset);
    }
  }, [offset, user?.id]);

  if (loading && offset === 0) {
    return <UserDynamicListSkeleton />;
  }

  return (
    <div className="p-2">
      <div className="m-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {users.map((userData, index) => {
          const isLastUser = users.length === index + 1;

          if (isLastUser) {
            return (
              <div ref={lastUserElementRef} key={userData.id}>
                <UserCard userData={userData} />
              </div>
            );
          }

          return <UserCard key={userData.id} userData={userData} />;
        })}
      </div>

      {loading && <UserDynamicListSkeleton />}
    </div>
  );
};

export default UsersList;

"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import UserCardList from "../users/user-card-list";
import { UserListSkeleton } from "@/utils/skeletons";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
}

interface FriendsListProps {
  users: UserData[];
}

const FriendsList: React.FC<FriendsListProps> = ({ users }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [followings, setFollowings] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`get-followings/${user.id}`);
      if (response?.data?.following) {
        setFollowings(response.data.following);
      }
    } catch (err) {
      console.error("Error fetching followings:", err);
      setError("Failed to fetch followings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user?.id]);

  return (
    <div className="py-2 px-1 md:px-2">
      {loading && (
        <div>
          <UserListSkeleton />
        </div>
      )}

      <div className="mb-10">
        {error && !loading && (
          <p className="text-center text-primary-light">{error}</p>
        )}

        {!loading && users && users.length > 0
          ? users.map((user) => {
              const isFollowing = followings.some(
                (data) => data.id === user.id,
              );
              return (
                <UserCardList
                  key={user.id}
                  userData={user}
                  followStatus={isFollowing}
                />
              );
            })
          : !loading && (
              <p className="text-center text-gray-500">No users available</p>
            )}
      </div>
    </div>
  );
};

export default FriendsList;

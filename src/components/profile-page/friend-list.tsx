"use client";

import React from "react";

import UserCardList from "../users/user-card-list";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  follow_status: string;
  createdAt: string;
  updatedAt: string;
}

interface FriendsListProps {
  users: UserData[];
}

const FriendsList: React.FC<FriendsListProps> = ({ users }) => {
  return (
    <div className="py-2 px-1 md:px-2">
      <div className="mb-10">
        {users && users.length > 0 ? (
          users.map((user) => {
            return <UserCardList key={user.id} userData={user} />;
          })
        ) : (
          <p className="text-center text-gray-500">No users available</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import FriendsList from "./friend-list";
import axiosInstance from "@/utils/axiosInstance";
import { User } from "@/props/authProps";

type FrinendsListModelProps = {
  user: User | null;
  handleFriendsToggle: () => void;
};

const FriendsListModel: React.FC<FrinendsListModelProps> = ({
  user,
  handleFriendsToggle,
}) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchAllFriends = async () => {
      try {
        const response = await axiosInstance.get(`/get-followers/${user?.id}`);
        if (response && response?.data) {
          setFriends(response?.data?.followers);
        }
      } catch (err) {
        console.error("Error fetching friends list", err);
      }
    };

    if (user?.id) {
      fetchAllFriends();
    }
  }, [user?.id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <button
          onClick={handleFriendsToggle}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
        >
          <IoClose className="h-6 w-6" />
        </button>
        <h3 className="text-lg font-semibold mb-4 text-red-500">{`${user?.full_name}'s friends`}</h3>
        <FriendsList users={friends} />
      </div>
    </div>
  );
};

export default FriendsListModel;

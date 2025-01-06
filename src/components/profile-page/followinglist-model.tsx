import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import FriendsList from "./friend-list";
import axiosInstance from "@/utils/axiosInstance";
import { User } from "@/props/authProps";

type FollowingListModelProps = {
  user: User | null;
  handleFollowingToggle: () => void;
};

const FollowingListModel: React.FC<FollowingListModelProps> = ({
  user,
  handleFollowingToggle,
}) => {
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllFollowings = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get(`/get-followings/${user?.id}`);
        if (response && response?.data) {
          setFollowings(response?.data?.following);
        }
      } catch (err) {
        console.log("Error In Fetching friends list", err);
      } finally {
      }
      setLoading(false);
    };
    if (user?.id) {
      fetchAllFollowings();
    }
  }, [user?.id]);

  return (
    <div>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="animate-spin inline-block text-center w-12 h-12 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="relative bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md max-h-screen overflow-y-auto border border-gray-500">
            <button
              onClick={handleFollowingToggle}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <IoClose className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-primary-light">{`${user?.full_name}'s followings`}</h3>
            <FriendsList users={followings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingListModel;

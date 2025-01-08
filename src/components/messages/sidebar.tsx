import React, { useState, useEffect } from "react";
import { User } from "@/props/authProps";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import { toast } from "react-toastify";

interface SidebarProps {
  onUserSelect: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onUserSelect }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchConnectedUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/get-connected-user/${user?.id}`
      );
      if (response && response?.data) {
        setUsers(response?.data?.users);
      }
    } catch (err) {
      console.error("Error Fetching connected users", err);
      toast.error("Couldn't fetch connected users!");
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnectedUsers();
    }
  }, [user]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden p-2 text-white bg-blue-500 rounded fixed top-4 right-4 z-50 ${
          isOpen && "hidden"
        }`}
      >
        Menu
      </button>

      <div
        className={`fixed top-0 right-0 bottom-0 h-full bg-black text-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "250px" }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-white absolute top-4 right-4"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold p-4 border-b border-gray-700">
          Connected Users
        </h2>
        <ul className="p-4 space-y-2">
          {users.map((userData) => (
            <li
              key={userData.id}
              onClick={() => {
                onUserSelect(userData);
                setIsOpen(false);
              }}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            >
              {userData?.full_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:block w-64 bg-black text-white h-full mt-4">
        <h2 className="text-lg font-bold p-4 border-b border-gray-700 ">
          Friends
        </h2>
        <ul className="p-4 space-y-2">
          {users.map((userData) => (
            <li
              key={userData.id}
              onClick={() => onUserSelect(userData)}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            >
              {userData?.full_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

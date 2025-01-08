import React, { useState, useEffect } from "react";
import { User } from "@/props/authProps";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import { toast } from "react-toastify";

interface SidebarProps {
  onUserSelect: (id: number, name: string) => void; // Updated to accept user name
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
      toast.error("Didn't fetched connected users!!");
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
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-white bg-blue-500 rounded"
      >
        Menu
      </button>

      <div
        className={`fixed top-0 right-0 bottom-0 h-full bg-gray-800 text-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
        style={{ width: "250px" }}
      >
        <h2 className="text-lg font-bold p-4 border-b border-gray-700">
          Connected Users
        </h2>
        <ul className="p-4 space-y-2">
          {users.map((userData) => (
            <li
              key={userData.id}
              onClick={() => {
                onUserSelect(userData.id, userData.full_name); // Pass ID and name
                setIsOpen(false);
              }}
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

import React, { useState, useEffect } from "react";
import { User } from "@/props/authProps";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import { toast } from "react-toastify";
import { IoIosMenu } from "react-icons/io";

interface SidebarProps {
  onUserSelect: (user: User) => void;
  selectedUserId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onUserSelect, selectedUserId }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleUserClick = (userData: User) => {
    setActiveUserId(userData.id);
    onUserSelect(userData);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden p-2 text-white  rounded fixed top-6 right-4 z-50 ${
          isOpen && "hidden"
        }`}
      >
        <IoIosMenu size={30} color="" />
      </button>

      {/* Sidebar */}
      <div
        className={`pt-4 fixed top-0 right-0 bottom-0 h-full bg-black text-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "250px" }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-white absolute top-6 right-4"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold p-4 mt-4 pt-4 border-b border-gray-700 ">
          Friends
        </h2>
        <ul className="p-4 space-y-2">
          {users.map((userData) => (
            <li
              key={userData.id}
              onClick={() => handleUserClick(userData)}
              className={`cursor-pointer p-2 rounded ${
                activeUserId === userData.id
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              {userData?.full_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:block w-64 md:w-52 bg-black text-white h-full mt-4 pt-4">
        <h2 className="text-lg font-bold p-4 border-b border-gray-700 ">
          Friends
        </h2>
        <ul className="p-4 space-y-2">
          {users.map((userData) => (
            <li
              key={userData.id}
              onClick={() => handleUserClick(userData)}
              className={`cursor-pointer p-2 rounded ${
                activeUserId === userData.id
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800"
              }`}
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

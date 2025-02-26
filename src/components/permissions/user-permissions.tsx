"use client";
import React, { useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { User } from "@/props/authProps";
import UserProfilePicture from "@/utils/user-profile-picture";

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState("");
  const [showUserList, setShowUserList] = useState<boolean>(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      setShowUserList(false);
      return;
    }

    setShowUserList(true);
    setLoadingUsers(true);

    try {
      const response = await axiosInstance.get(
        `/search-user/${query.toLowerCase()}`
      );
      setUsers(response?.data?.users || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const debouncedSearch = useCallback(() => {
    let timer: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => handleSearch(query), 1000);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const debounce = debouncedSearch();
    debounce(query);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setRole(user.role ?? "user");
    setShowUserList(false);

    const formattedPermissions = user.permissions
      ? Object.keys(user.permissions).reduce((acc, key) => {
          acc[key] = Boolean(user.permissions?.[key]);
          return acc;
        }, {} as Record<string, boolean>)
      : {};

    setPermissions(formattedPermissions);
  };

  const updatePermissions = async () => {
    if (!selectedUser) return;
    try {
      await axiosInstance.post(`/users/${selectedUser.id}/permissions`, {
        permissions,
        role,
      });
      toast.success("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions.");
    }
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-xl mx-auto relative">
        <input
          type="text"
          className="block w-full py-2 px-4 text-sm text-gray-300 bg-gray-800 border  border-red-500 rounded-lg  focus:ring-red-600 focus:border-red-500"
          placeholder="Search Users..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500 hover:text-red-600"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        )}

        {showUserList && searchQuery && (
          <ul
            className="absolute left-0 w-full bg-gray-900 shadow-lg rounded-lg mt-3 max-h-60 overflow-y-auto z-50 border border-gray-700"
            style={{ scrollbarWidth: "none" }}
          >
            {loadingUsers ? (
              <div className="flex items-center justify-center mt-4">
                <div
                  className="animate-spin inline-block text-center w-8 h-8 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-400 py-2">No users found.</p>
            ) : (
              users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="cursor-pointer px-4 py-2 flex items-center hover:bg-gray-700"
                >
                  <div className="mr-3">
                    {user?.profile_picture ? (
                      <img
                        src={user?.profile_picture}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserProfilePicture
                        fullName={user?.full_name}
                        size={32}
                      />
                    )}
                  </div>
                  <div>
                    <strong>@{user?.username}</strong>
                    <p className="text-gray-400 text-sm">{user?.full_name}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {selectedUser ? (
        <div className="w-full mx-auto mt-6 bg-gray-900 p-6 rounded-lg z-10 relative border border-gray-600">
          <div className="flex items-center gap-4">
            <div>
              {selectedUser?.profile_picture ? (
                <img
                  src={selectedUser?.profile_picture}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <UserProfilePicture
                  fullName={selectedUser?.full_name}
                  size={48}
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">@{selectedUser?.username}</h3>
              <h3 className="text-sm font-bold text-gray-400">
                {selectedUser?.full_name}
              </h3>
            </div>
          </div>

          <div className="mt-4 flex sm:flex-row flex-col justify-between">
            <label className="block mr-2  font-semibold uppercase mb-2 sm:mb-0">
              Role
            </label>

            <div className="flex  gap-4 ">
              <div className="flex items-center ">
                <input
                  id="role-user"
                  type="radio"
                  value="user"
                  name="role"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 focus:ring-red-600 cursor-pointer"
                />
                <label
                  htmlFor="role-user"
                  className="ml-2 text-sm font-medium text-gray-300 cursor-pointer"
                >
                  User
                </label>
              </div>

              <div className="flex items-center ">
                <input
                  id="role-admin"
                  type="radio"
                  value="admin"
                  name="role"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 focus:ring-red-600 cursor-pointer"
                />
                <label
                  htmlFor="role-admin"
                  className="ml-2 text-sm font-medium text-gray-300 cursor-pointer"
                >
                  Admin
                </label>
              </div>

              <div className="flex items-center ">
                <input
                  id="role-manager"
                  type="radio"
                  value="manager"
                  name="role"
                  checked={role === "manager"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 focus:ring-red-600 cursor-pointer"
                />
                <label
                  htmlFor="role-manager"
                  className="ml-2 text-sm font-medium text-gray-300 cursor-pointer"
                >
                  Manager
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold uppercase">Permissions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(permissions).map((permKey) => (
                <div
                  key={permKey}
                  className="flex items-center justify-between gap-4 mt-2"
                >
                  <label className="text-sm">{formatKey(permKey)}</label>
                  <select
                    value={permissions[permKey] ? "true" : "false"}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        [permKey]: e.target.value === "true",
                      })
                    }
                    className="w-64 p-1 border rounded bg-gray-800 text-white"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={updatePermissions}
              className="bg-red-500  border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto mt-6 text-gray-400 p-6 rounded-lg z-10 relative text-center">
          Search and select a user to review and update permissions.
        </div>
      )}
    </div>
  );
};

export default UserPermissions;

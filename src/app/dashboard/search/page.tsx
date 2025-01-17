"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { PostSkeleton, UserCardSkeleton } from "@/utils/skeletons";
import UserCardGrid from "@/components/users/user-card-grid";
import Post from "@/components/homepage/post";
import { useAuth } from "@/context/authContext";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
}

interface PostData {
  id: number;
  userId: number;
  User: {
    id: number;
    name: string;
    username: string;
    full_name: string;
    profile_picture: string;
  };
  content: string;
  mediaUrls: string[];
  createdAt: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  PostLikes: { userId: number }[];
}

const SearchPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axiosInstance(`/latest-users`);
      if (response?.data) {
        setUsers(response.data.users);
        setLoadingUsers(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await axiosInstance(`/latest-posts`);
      if (response?.data) {
        setPosts(response.data.posts);
        setLoadingPosts(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchUsers();
      fetchPosts();
      return;
    }

    try {
      setIsSearching(true);
      setLoadingUsers(true);
      setLoadingPosts(true);

      const response = await axiosInstance.get(
        `/search/${query.toLowerCase()}`
      );
      if (response?.data?.results) {
        setUsers(response.data.results.users || []);
        setPosts(response.data.results.posts || []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Error performing search.");
    } finally {
      setLoadingUsers(false);
      setLoadingPosts(false);
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timer);
        setLoadingUsers(true);
        setLoadingPosts(true);
        timer = setTimeout(() => handleSearch(query), 500);
      };
    })(),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || []);
  };

  const userListNavigation = () => {
    router.push(`/dashboard/users`);
  };

  const postListNavigation = () => {
    router.push(`/dashboard/home`);
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, [user]);

  return (
    <div className="text-white min-h-screen py-10">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-xl mx-auto mb-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <input
            type="text"
            id="search"
            className="appearance-none block w-full py-2 pl-10 pr-10 text-sm text-gray-400 bg-black border border-red-500 rounded-lg focus:ring-red-600 focus:border-red-500"
            placeholder="Search Users or Posts..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                fetchUsers();
                fetchPosts();
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
        </div>
      </form>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingUsers || isSearching
                ? Array.from({ length: 6 }).map((_, index) => (
                    <UserCardSkeleton key={index} />
                  ))
                : users.length > 0
                ? users.map((userData) => {
                    return user?.id !== userData.id ? (
                      <UserCardGrid key={userData.id} userData={userData} />
                    ) : null;
                  })
                : !loadingUsers && (
                    <p className="col-span-full text-center">No users found</p>
                  )}
              {!isSearching &&
                !loadingUsers &&
                users.length > 0 &&
                searchQuery.trim() === "" && (
                  <div className="flex bg-black my-2 mx-3 items-center justify-center p-4 border rounded-lg border-gray-700">
                    <button
                      className="text-primary-light hover:text-red-700"
                      onClick={userListNavigation}
                    >
                      See More
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-1 lg:grid-cols-2  mx-auto">
            {loadingPosts || isSearching
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="col-span-1">
                    <PostSkeleton />
                  </div>
                ))
              : posts.length > 0
              ? posts.map((post) => (
                  <div
                    key={post.id}
                    className="lg:w-96 md:w-80 sm:w-72 col-span-1"
                  >
                    <Post postData={post} onDeletePost={handlePostDelete} />
                  </div>
                ))
              : !loadingPosts && <></>}

            {!isSearching &&
              !loadingPosts &&
              posts.length > 0 &&
              searchQuery.trim() === "" && (
                <div className="col-span-full bg-black flex items-center justify-center p-4 border rounded-lg border-gray-700 mb-4">
                  <button
                    className="text-primary-light hover:text-red-700"
                    onClick={postListNavigation}
                  >
                    See More
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

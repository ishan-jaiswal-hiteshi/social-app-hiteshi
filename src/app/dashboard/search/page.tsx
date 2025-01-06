"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  const [users, setUsers] = useState<UserData[] | []>([]);
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [followings, setFollowings] = useState<UserData[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axiosInstance(`/latest-users`);
      if (response?.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await axiosInstance(`/latest-posts`);
      if (response?.data) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error fetching posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get(`/get-followings/${user.id}`);
      if (response?.data) {
        setFollowings(response.data.following);
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
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
    fetchFollowing();
  }, [user]);

  return (
    <div className="text-white min-h-screen py-10 ">
      {/* Search Bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-xl mx-auto mb-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 25 25"
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
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-400 bg-black border border-red-500 rounded-lg focus:ring-red-600 focus:border-red-500"
            placeholder="Search Users or Posts..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </form>

      {/* Users Section */}
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingUsers || isSearching
                ? Array.from({ length: 6 }).map((_, index) => (
                    <UserCardSkeleton key={index} />
                  ))
                : users.length > 0
                ? users.map((user) => {
                    const isFollowing = followings.some(
                      (follower) => follower.id === user.id
                    );
                    return (
                      <UserCardGrid
                        key={user.id}
                        userData={user}
                        followStatus={isFollowing}
                      />
                    );
                  })
                : !loadingUsers && (
                    <p className="col-span-full text-center">No users found</p>
                  )}
              {!isSearching &&
                !loadingUsers &&
                users.length > 0 &&
                searchQuery.trim() === "" && (
                  <div className="flex my-2 mx-3 items-center justify-center p-4 border rounded-lg border-gray-700">
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={userListNavigation}
                    >
                      See More
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="flex justify-center md:mx-40">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl">
            {loadingPosts || isSearching
              ? Array.from({ length: 4 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              : posts.length > 0
              ? posts.map((post) => (
                  <div>
                    <Post
                      key={post.id}
                      postData={post}
                      onDeletePost={handlePostDelete}
                    />
                  </div>
                ))
              : !loadingPosts && (
                  <p className="col-span-full text-center text-gray-500">
                    No Posts Available
                  </p>
                )}
            {!isSearching &&
              !loadingPosts &&
              posts.length > 0 &&
              searchQuery.trim() === "" && (
                <div className="col-span-full flex items-center justify-center p-4 border rounded-lg border-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700"
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

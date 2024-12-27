"use client";

import React, { useEffect, useState } from "react";
import Post from "./post";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

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
  mediaUrl: string;
  createdAt: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
}

const PostList = () => {
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllPosts = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance("/get-posts");
      if (response?.data) {
        setPosts(response?.data?.posts);
      }
    } catch (error) {
      toast.error("Unknown error occured.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || null);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="p-2">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="animate-spin inline-block text-center w-12 h-12 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="mb-10">
        {!loading && posts && posts.length > 0
          ? posts.map((post) => (
              <Post
                key={post.id}
                postData={post}
                onDeletePost={handlePostDelete}
              />
            ))
          : !loading && (
              <p className="text-center text-gray-500">No Posts Available</p>
            )}
      </div>
    </div>
  );
};

export default PostList;

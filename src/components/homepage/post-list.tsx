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
  PostLikes: { userId: number }[];
}

const PostList = () => {
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllPosts = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance("/get-posts");
      if (response?.data) {
        setPosts(response?.data?.posts);
      }
    } catch (error) {
      console.error("Error in fetching posts", error);
      toast.error("Error in fetching posts.");
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

  const PostSkeleton = () => {
    return (
      <div className="animate-pulse p-4 border w-96 border-gray-400 rounded-lg max-w-md mx-4 my-5 bg-gray-900">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-400"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-400 rounded w-1/2"></div>
            <div className="h-4 bg-gray-400 rounded w-1/4"></div>
          </div>
        </div>
        <div className="w-full h-48 bg-gray-400 rounded mb-4"></div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-400 rounded w-full"></div>
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-400 rounded w-16"></div>
          <div className="h-4 bg-gray-400 rounded w-16"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2">
      {loading && (
        <div className="w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
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

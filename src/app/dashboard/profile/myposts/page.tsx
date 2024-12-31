"use client";

import React, { useEffect, useState } from "react";
import Post from "../../../../components/homepage/post";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import { PostSkeleton } from "@/utils/skeletons";
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

const MyPosts: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserPosts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/get-post-by-userId/${user.id}`
      );
      if (response?.data) {
        setPosts(response?.data?.posts);
      }
    } catch (error) {
      toast.error("Error in fetching your posts.");
      console.error("Error in fetching your posts.", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || null);
  };

  useEffect(() => {
    getUserPosts();
  }, [user?.id]);

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      )}
      <div className="mb-10 text-white">
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

export default MyPosts;

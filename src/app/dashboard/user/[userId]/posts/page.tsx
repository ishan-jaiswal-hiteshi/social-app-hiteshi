"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { PostSkeleton } from "@/utils/skeletons";
import Post from "@/components/homepage/post";
import { usePathname } from "next/navigation";

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

const UserPosts: React.FC = () => {
  const pathname = usePathname();
  const userId = pathname?.split("/")[3];

  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserPosts = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-post-by-userId/${userId}`);
      if (response?.data) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      toast.error("Error in fetching posts.");
      console.error("Error in fetching posts.", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || null);
  };

  useEffect(() => {
    if (userId) {
      getUserPosts();
    }
  }, [userId]);

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      )}
      <div className="mb-10 text-white w-full">
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

export default UserPosts;

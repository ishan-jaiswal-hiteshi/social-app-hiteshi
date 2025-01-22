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
  reactionIds: number[];
  createdAt: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  PostLikes: { userId: number }[];
}

const PostbyID: React.FC = () => {
  const pathname = usePathname();
  const postId = pathname?.split("/")[3];

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getPostbyID = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-post/${postId}`);
      if (response?.data?.post) {
        setPost(response.data.post);
      }
    } catch (error) {
      toast.error("Error in getting post.");
      //console.error("Error in fetching posts.", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPost(null);
  };

  useEffect(() => {
    if (postId) {
      getPostbyID();
    }
  }, [postId]);

  return (
    <div className="p-2 justify-center items-center flex flex-col">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          {Array.from({ length: 1 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      )}
      <div className="mb-10 text-white w-full">
        {!loading && post ? (
          <Post key={post.id} postData={post} onDeletePost={handlePostDelete} />
        ) : (
          !loading && (
            <p className="text-center text-gray-500">Post not Available</p>
          )
        )}
      </div>
    </div>
  );
};

export default PostbyID;

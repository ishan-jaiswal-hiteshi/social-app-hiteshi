"use client";

import React, { useEffect, useState } from "react";
import Post from "./post";
import axiosInstance from "@/utils/axiosInstance";
import { PostSkeleton } from "@/utils/skeletons";
import Link from "next/link";
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

const PostList = () => {
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllPosts = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance("/get-posts");

      if (response?.data) {
        setPosts(response?.data?.posts);
        setLoading(false);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || null);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <div className="mb-6">
        <header className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-start bg-black  border-b border-gray-700">
          <Link
            className="text-md font-semibold text-white mx-5 my-3"
            href="/dashboard/home"
          >
            Socialize@Hiteshi
          </Link>
        </header>
      </div>

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
    </>
  );
};

export default PostList;

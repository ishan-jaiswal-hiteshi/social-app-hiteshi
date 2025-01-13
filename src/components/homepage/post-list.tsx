"use client";

import React, { useCallback, useEffect, useState } from "react";
import Post from "./post";
import axiosInstance from "@/utils/axiosInstance";
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

const PostList = () => {
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getAllPosts = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axiosInstance("/get-posts", {
        params: { limit: 4, offset: (pageNumber - 1) * 4 },
      });

      const fetchedPosts = response?.data?.posts || [];

      if (fetchedPosts.length > 0) {
        setPosts((prev) =>
          pageNumber === 1 ? fetchedPosts : [...prev, ...fetchedPosts]
        );
        setHasMore(fetchedPosts.length >= 4);
        setLoading(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostDelete = (postId: number) => {
    setPosts((prev) => prev?.filter((post) => post.id !== postId) || null);
  };

  const handleScroll = useCallback(() => {
    const container = document.querySelector(".above-1148\\:w-4\\/5");
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100 &&
      hasMore &&
      !loadingMore
    ) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    getAllPosts(page);
  }, [page]);

  useEffect(() => {
    const container = document.querySelector(".above-1148\\:w-4\\/5");
    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="p-2">
        {loading && (
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}
        <div className="mb-12">
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
        {loadingMore && (
          <div>
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={`loading-more-${index}`} />
            ))}
          </div>
        )}

        {!loading && !loadingMore && !hasMore && (
          <p className="text-center text-gray-500">No more posts available.</p>
        )}
      </div>
    </>
  );
};

export default PostList;

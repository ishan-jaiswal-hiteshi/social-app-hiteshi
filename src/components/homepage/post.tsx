"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";

type PostData = {
  id: number;
  user: {
    id: number;
    name: string;
    username: string;
    profile_picture_url: string;
  };
  content: string;
  media_url: string;
  timestamp: string;
  likes: {
    count: number;
    users: {
      id: number;
      name: string;
      username: string;
      profile_picture_url: string;
    }[];
  };
  comments: {
    count: number;
    list: {
      id: number;
      user: {
        id: number;
        name: string;
        username: string;
      };
      comment: string;
    }[];
  };
};

type PostProps = {
  postData: PostData;
};

const Post: React.FC<PostProps> = ({ postData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(postData?.likes?.count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(postData?.comments?.list || []);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  console.log(user);

  axios.defaults.baseURL = "http://192.168.100.208:5000";

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleLikeClick = async () => {
    const postLikeData = {
      userId: user?.id,
      postId: "7",
    };
    try {
      await axios.post(`/post/like-unlike`, postLikeData);
      if (isLiked) {
        setLikesCount((prev) => prev - 1);
      } else {
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error updating like status", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const commentData = {
      comment: commentText,
      userId: user?.id,
      postId: "7",
    };
    try {
      const response = await axios.post(`/create-comment`, commentData);
      const newComment = response?.data?.comment;
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const formatContentWithHashtags = (content: string) => {
    const hashtagRegex = /#\w+/g;
    const parts = content?.split(hashtagRegex);

    const hashtags = content?.match(hashtagRegex) || [];

    return parts?.map((part, index) => {
      if (hashtags[index]) {
        return (
          <div key={index} className="inline-block">
            <span>{part}</span>
            <span className="text-blue-500"> {hashtags[index]} </span>
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg max-w-md mx-auto my-5 font-sans bg-black">
      <div className="flex items-center p-3">
        <img
          src={postData?.user?.profile_picture_url}
          alt="profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <strong>{postData?.user?.name}</strong>
          <p className="m-0 text-gray-500 text-sm">
            @{postData?.user?.username}
          </p>
        </div>
      </div>

      <div>
        <img
          src={postData?.media_url}
          alt="post"
          className="w-full border-t border-b border-gray-300"
        />
        <div className="p-3">
          {formatContentWithHashtags(postData?.content)}
        </div>
      </div>

      <div className="border-t border-gray-300 p-2 flex justify-start gap-4">
        <div
          onClick={handleLikeClick}
          className="cursor-pointer flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isLiked ? "bg-red-500" : "text-gray-500"}`}
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
          </svg>
          <p>{likesCount} likes</p>
        </div>
        <div
          onClick={toggleComments}
          className="cursor-pointer flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 cursor-pointer"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M320-60v-221q-101-8-170.5-82T80-540q0-109 75.5-184.5T340-800h27l-63-64 56-56 160 160-160 160-56-56 63-64h-27q-75 0-127.5 52.5T160-540q0 75 52.5 127.5T340-360h60v107l107-107h113q75 0 127.5-52.5T800-540q0-75-52.5-127.5T620-720h-20v-80h20q109 0 184.5 75.5T880-540q0 109-75.5 184.5T620-280h-80L320-60Z" />
          </svg>
          <p>{postData?.comments?.count} comments</p>
        </div>
      </div>

      {showComments && (
        <div className="p-3 border-t border-gray-300">
          {comments?.map((comment) => (
            <div key={comment?.id} className="mb-3">
              <strong>{comment?.user?.name}</strong>{" "}
              <span className="text-gray-500">@{comment?.user?.username}</span>
              <p className="mt-1">{comment?.comment}</p>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow border border-gray-400 rounded p-2 text-black"
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

type Comment = {
  id: number;
  userId: number;
  postId: number;
  comment: string;
  likesCount: number;
  createdAt: string;
  User: {
    id: number;
    username: string;
    profile_picture: string | undefined;
    full_name: string;
  };
};

type PostData = {
  id: number;
  User: {
    id: number;
    full_name: string;
    username: string;
    profile_picture: string | undefined;
  };
  userId: number;
  content: string;
  mediaUrl: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  PostLikes: { userId: number }[];
};

type PostProps = {
  postData: PostData;
  onDeletePost: (postId: number) => void;
};

const Post: React.FC<PostProps> = ({ postData, onDeletePost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(postData?.likesCount);
  const [commnetsCount, setCommentsCount] = useState(postData?.commentsCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const toggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const response = await axiosInstance.get(`get-comments/${postData.id}`);
        if (response?.data) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments", error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments((prev) => !prev);
  };

  useEffect(() => {
    const userLikedPost = postData?.PostLikes?.some(
      (like) => like?.userId === user?.id
    );
    setIsLiked(userLikedPost);
  }, [postData, user?.id]);

  const handleLikeClick = async () => {
    const postLikeData = {
      userId: user?.id,
      postId: postData.id,
    };
    try {
      await axiosInstance.post(`/post/like-unlike`, postLikeData);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error updating like status", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && commentText.trim()) {
      handleCommentSubmit();
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await axiosInstance.delete(
        `/delete-post/${postData?.id}`
      );

      if (response) {
        toast.success(response?.data?.message);
        onDeletePost(postData?.id);
      }
    } catch (error) {
      console.error("Error Deleting Post", error);
      toast.error("Post did not deleted");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const commentData = {
      comment: commentText,
      userId: user?.id,
      postId: postData.id,
    };

    try {
      setLoadingComments(true);
      const response = await axiosInstance.post(`/create-comment`, commentData);
      const newComment = response?.data?.comment;
      newComment.User = user;
      setComments((prev) => [...prev, newComment]);
      setCommentsCount(() => commnetsCount + 1);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatContentWithHashtags = (content: string) => {
    const hashtagRegex = /#\w+/g;
    const parts = content?.split(hashtagRegex);

    const hashtags = content?.match(hashtagRegex) || [];

    return parts?.map((part, index) => (
      <span key={index}>
        {part}
        {hashtags[index] && (
          <span className="text-blue-500">{` ${hashtags[index]}`}</span>
        )}
      </span>
    ));
  };

  return (
    <div className="border border-gray-600 rounded-lg max-w-md mx-auto my-5 font-sans bg-black">
      <div className="relative flex items-center p-3">
        <img
          src={
            postData?.User?.profile_picture ||
            "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
          }
          alt="profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <strong>{postData?.User?.full_name}</strong>
          <p className="m-0 text-gray-500 text-sm">
            @{postData?.User?.username}
          </p>
        </div>
        {user?.id === postData?.userId && (
          <div className="absolute top-4 right-2 cursor-pointer">
            <MdDelete size={20} onClick={handleDeletePost} color="red" />
          </div>
        )}
      </div>
      <div>
        {postData?.mediaUrl && (
          <img
            src={postData?.mediaUrl}
            alt="post"
            className="w-full border-t border-b border-gray-300"
            onDoubleClick={handleLikeClick}
          />
        )}
        {postData?.content && (
          <div className="p-3">
            {formatContentWithHashtags(postData?.content)}
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 p-2 flex justify-start gap-4">
        <div
          onClick={handleLikeClick}
          className="cursor-pointer flex items-center gap-1"
        >
          {isLiked ? <FcLike size={20} /> : <FaRegHeart size={20} />}

          <p>{likesCount} likes</p>
        </div>
        <div
          onClick={toggleComments}
          className="cursor-pointer flex items-center gap-1"
        >
          <FaRegComment size={20} />
          <p>{commnetsCount} comments</p>
        </div>
      </div>

      {showComments && (
        <div className="p-3 border-t border-gray-300">
          {loadingComments ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div
                className="animate-spin inline-block text-center w-12 h-12 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            comments?.map((comment) => (
              <div key={comment?.id} className="mb-3">
                <div className=" flex">
                  <img
                    src={comment?.User?.profile_picture}
                    alt="profile"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <strong>{comment.User?.full_name}</strong>
                  <span className="m-0 ml-2 text-gray-500 text-sm">
                    @{comment.User?.username}
                  </span>
                </div>
                <p className=" ml-10 text-sm">{comment?.comment}</p>
              </div>
            ))
          )}

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Write a comment..."
              className="flex-grow bg-black rounded px-2 py-1 text-white"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

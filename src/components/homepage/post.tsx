"use client";
import { useRouter } from "next/navigation";
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
  mediaUrls: string[];
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
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(postData?.likesCount);
  const [commnetsCount, setCommentsCount] = useState(postData?.commentsCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 10;
  const [currentSlide, setCurrentSlide] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    handleSwipe(touchStart, touchEnd);
    setTouchStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseStart === null) return;
    const mouseEnd = e.clientX;
    handleSwipe(mouseStart, mouseEnd);
    setMouseStart(null);
  };

  const handleSwipe = (start: number, end: number) => {
    const swipeThreshold = 50; // Minimum distance to detect a swipe
    if (start - end > swipeThreshold) {
      // Swipe left
      setCurrentSlide((prev) =>
        prev === postData.mediaUrls.length - 1 ? 0 : prev + 1
      );
    } else if (end - start > swipeThreshold) {
      // Swipe right
      setCurrentSlide((prev) =>
        prev === 0 ? postData.mediaUrls.length - 1 : prev - 1
      );
    }
  };

  const navigateToProfile = () => {
    router.push(`./profile/${postData?.User?.id}`);
  };

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const shouldTruncate = postData?.content?.split(" ").length > wordLimit;

  const formatContentWithHashtags = (content: string) => {
    const hashtagRegex = /#\w+/g;
    const parts = content?.split(hashtagRegex);

    const hashtags = content?.match(hashtagRegex) || [];

    return parts?.map((part, index) => (
      <span key={index}>
        {part}
        {hashtags[index] && (
          <span className="text-blue-400">{` ${hashtags[index]}`}</span>
        )}
      </span>
    ));
  };

  const getDisplayContent = () => {
    if (!postData?.content) return "";
    if (isExpanded || !shouldTruncate)
      return formatContentWithHashtags(postData.content);

    return postData.content.split(" ").slice(0, wordLimit).join(" ") + "....";
  };

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

  return (
    <div className="border border-gray-600 rounded-lg max-w-md mx-auto my-5 font-sans bg-black">
      <div className="relative flex items-center p-3">
        <img
          src={
            postData?.User?.profile_picture ||
            "https://i.pinimg.com/736x/1a/09/3a/1a093a141eeecc720c24543f2c63eb8d.jpg"
          }
          alt="profile"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="cursor-pointer" onClick={() => navigateToProfile()}>
          <strong>@{postData?.User?.username}</strong>
          <p className="m-0 text-gray-500 text-sm">
            {postData?.User?.full_name}
          </p>
        </div>
        {user?.id === postData?.userId && (
          <div className="absolute top-4 right-2 cursor-pointer">
            <MdDelete size={20} onClick={handleDeletePost} color="red" />
          </div>
        )}
      </div>
      <div>
        {postData?.mediaUrls?.length > 0 && (
          <div
            className="relative w-full"
            style={{ maxHeight: "400px", maxWidth: "100%" }}
          >
            <div
              className="relative h-56 overflow-hidden rounded-lg md:h-72"
              onTouchStart={(e) => handleTouchStart(e)}
              onTouchEnd={(e) => handleTouchEnd(e)}
              onMouseDown={(e) => handleMouseDown(e)}
              onMouseUp={(e) => handleMouseUp(e)}
            >
              {postData.mediaUrls.map((url, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                  data-carousel-item={index}
                >
                  <img
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-full object-cover"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {postData.mediaUrls.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-2 h-2 rounded-full ${
                    currentSlide === index
                      ? "bg-red-600"
                      : "bg-gray-400 opacity-50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        )}

        {postData?.content && (
          <div className="p-3">
            <span>
              {getDisplayContent()}
              {shouldTruncate && !isExpanded && (
                <button
                  onClick={() => {
                    toggleContent();
                  }}
                  className="text-red-500 text-opacity-85 focus:outline-none ml-2"
                >
                  See More
                </button>
              )}
            </span>
            {shouldTruncate && isExpanded && (
              <button
                onClick={() => {
                  toggleContent();
                }}
                className="text-red-500 text-opacity-85 focus:outline-none ml-2"
              >
                See Less
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-500 p-2 flex justify-start gap-5">
        <div
          onClick={handleLikeClick}
          className="cursor-pointer flex items-center gap-1"
        >
          {isLiked ? <FcLike size={20} /> : <FaRegHeart size={20} />}

          <p>{likesCount} </p>
        </div>
        <div
          onClick={toggleComments}
          className="cursor-pointer flex items-center gap-1"
        >
          <FaRegComment size={20} />
          <p>{commnetsCount} </p>
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

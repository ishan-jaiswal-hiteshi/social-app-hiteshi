"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { FaRegComment } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { MdMoreVert, MdDeleteOutline, MdOutlineFileCopy } from "react-icons/md";
import { toast } from "react-toastify";
import UserProfilePicture from "@/utils/user-profile-picture";

import LoveEmojiPath from "../../assets/reactions/love_emoji.png";
import LaughingEmojiPath from "../../assets/reactions/laughing.png";
import ThumbsEmojiPath from "../../assets/reactions/thumbsup.png";
import AngryEmojiPath from "../../assets/reactions/angry.png";
import WowEmojiPath from "../../assets/reactions/wow.png";
import HeartEmoji from "../../assets/reactions/heart.png";

import Image from "next/image";
import { PostData } from "@/props/postProps";

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
  const { user, setUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 10;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<number | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { id: 1, emoji: HeartEmoji },
    { id: 2, emoji: ThumbsEmojiPath },
    { id: 3, emoji: LaughingEmojiPath },
    { id: 4, emoji: WowEmojiPath },
    { id: 5, emoji: LoveEmojiPath },
    { id: 6, emoji: AngryEmojiPath },
  ];

  const confirmDelete = () => {
    handleDeletePost();
    setShowConfirmation(false);
  };

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
    const swipeThreshold = 50;
    if (start - end > swipeThreshold) {
      setCurrentSlide((prev) =>
        prev === postData.mediaUrls.length - 1 ? 0 : prev + 1
      );
    } else if (end - start > swipeThreshold) {
      setCurrentSlide((prev) =>
        prev === 0 ? postData.mediaUrls.length - 1 : prev - 1
      );
    }
  };

  const navigateToProfile = (userId: number) => {
    if (userId === user?.id) {
      router.push(`/dashboard/profile`);
    } else {
      router.push(`/dashboard/user/${userId}/profile`);
    }
  };
  const navigateToPost = (postId: number) => {
    router.push(`${window.location.origin}/dashboard/home/${postId}`);
  };

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const shouldTruncate = postData?.content?.split(" ").length > wordLimit;

  const formatContentWithHashtags = (content: string) => {
    const hashtagRegex = /#\w+/g;

    return content.split("\n").map((line, lineIndex) => (
      <p key={lineIndex} className="whitespace-pre-line">
        {line.split(hashtagRegex).map((part, index) => (
          <span key={index}>
            {part}
            {line.match(hashtagRegex)?.[index] && (
              <span className="text-blue-400">{` ${
                line.match(hashtagRegex)?.[index] || ""
              }`}</span>
            )}
          </span>
        ))}
      </p>
    ));
  };

  const getDisplayContent = () => {
    if (!postData?.content) return "";

    if (isExpanded || !shouldTruncate)
      return formatContentWithHashtags(postData.content);

    const truncatedText = postData.content
      .split(" ")
      .slice(0, wordLimit)
      .join(" ");
    return formatContentWithHashtags(truncatedText);
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

  const renderCommentWithLinks = (text: string) => {
    const urlRegex =
      /(https?:\/\/[^\s]+)|((www\.[^\s]+)|([^\s]+\.(com|in|net|org|io|co|edu|gov|info|me|xyz|dev|app)))/gi;

    let lastIndex = 0;
    const parts = [];

    for (const match of text.matchAll(urlRegex)) {
      const url = match[0];

      parts.push(text.slice(lastIndex, match.index));

      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

      parts.push(
        <a
          key={lastIndex}
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {url}
        </a>
      );

      lastIndex = (match.index ?? 0) + url.length;
    }

    parts.push(text.slice(lastIndex));

    return <>{parts}</>;
  };

  useEffect(() => {
    if (postData?.PostLikes && user?.id) {
      const userLike = postData.PostLikes.find(
        (like) => like?.userId === user?.id
      );

      setIsLiked(!!userLike);

      setCurrentReaction(userLike?.reactionId || null);
    }
  }, [postData, user?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showOptions) {
        setShowOptions(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showOptions]);

  const handleLikeClick = async (reactionId: number) => {
    if (
      (isLiked && currentReaction === null) ||
      (isLiked && currentReaction === reactionId)
    ) {
      try {
        await axiosInstance.post(`/post/like-unlike`, {
          userId: user?.id,
          postId: postData.id,
        });
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
        setCurrentReaction(null);
      } catch (error) {
        console.error("Error updating like status", error);
      }
      return;
    }

    const postLikeData = {
      userId: user?.id,
      postId: postData.id,
      reactionId: reactionId,
    };

    try {
      await axiosInstance.post(`/post/like-unlike`, postLikeData);
      setLikesCount((prev) => (isLiked ? prev : prev + 1));
      setCurrentReaction(reactionId);
      setIsLiked(true);
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
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            posts: (prevUser?.posts || 0) - 1,
          };
        });
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

  const handleSharePost = async () => {
    const copyLink = `${window.location.origin}/dashboard/home/${postData?.id}`;
    setShowOptions(false);
    const fallbackCopyText = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("link copied to clipboard!");
    };

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copyLink);
        toast.success("link copied to clipboard!");
      } else {
        fallbackCopyText(copyLink);
      }
    } catch (error) {
      console.log("Error in copy profile", error);
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg max-w-md mx-auto my-5 font-sans bg-black">
      <div className="relative flex items-center p-3">
        <div
          className="mr-3 cursor-pointer"
          onClick={() => navigateToProfile(postData?.userId)}
        >
          {postData?.User?.profile_picture ? (
            <img
              src={postData?.User?.profile_picture}
              alt="profile"
              className="w-10 h-10 rounded-full  object-cover"
              onDragStart={(e) => e.preventDefault()}
            />
          ) : (
            <UserProfilePicture
              fullName={postData?.User?.full_name}
              size={40}
            />
          )}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigateToPost(postData?.id)}
        >
          <strong>@{postData?.User?.username}</strong>
          <p className="m-0 text-gray-500 text-sm">
            {postData?.User?.full_name}
          </p>
        </div>

        <div className="absolute top-4 right-2 cursor-pointer">
          <MdMoreVert
            size={20}
            onClick={() => setShowOptions((prev) => !prev)}
          />
          {showOptions && (
            <div
              className="absolute bg-black  shadow-md border-2 border-gray-700 rounded-md p-2 right-0 top-4"
              style={{ top: "100%", zIndex: 10 }}
            >
              <button
                className="text-gray-300 hover:text-red-500 text-sm"
                onClick={handleSharePost}
              >
                <div className="flex items-center space-x-1">
                  <MdOutlineFileCopy color="red" size={20} />
                  <span>Copy</span>
                </div>
              </button>
              {(user?.id === postData?.userId ||
                user?.role === "admin" ||
                user?.role === "manager") && (
                <button
                  className="text-gray-300 hover:text-red-500 text-sm "
                  onClick={() => {
                    setShowConfirmation(true);
                    setShowOptions(false);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <MdDeleteOutline color="red" size={20} />
                    <span>Delete</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        {postData?.mediaUrls?.length > 0 && (
          <div
            className="relative w-full"
            style={{ maxHeight: "400px", maxWidth: "100%" }}
          >
            <div
              className="relative h-56 overflow-hidden md:h-72"
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
                    className="w-full h-full object-contain"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>

            {postData?.mediaUrls?.length >= 2 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 ">
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
            )}
          </div>
        )}

        <div className="border-y border-gray-500 p-2 flex justify-start gap-5">
          <div>
            <div
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              className="relative cursor-pointer flex items-center gap-2"
            >
              <div
                onClick={() => handleLikeClick(currentReaction || 1)}
                className="flex items-center gap-2"
              >
                {isLiked && currentReaction ? (
                  <Image
                    alt="emojis"
                    src={
                      reactions.find((r) => r.id === currentReaction)?.emoji ||
                      HeartEmoji
                    }
                    className="text-[19px] p-0 h-6 w-6"
                  ></Image>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )}
                <p>{likesCount}</p>
              </div>

              {showReactions && (
                <div className="absolute bottom-6 left-0 flex space-x-2 bg-gray-800 p-2 rounded-lg">
                  {reactions.map((reaction) => (
                    <div
                      className={` h-7 w-7 cursor-pointer p-[2px] hover:scale-110 hover:bg-gray-500 rounded-full ${
                        currentReaction === reaction.id && "bg-gray-500"
                      }`}
                      onClick={() => handleLikeClick(reaction.id)}
                      key={reaction.id}
                    >
                      <Image
                        src={reaction.emoji}
                        alt="emoji"
                        className="w-6 h-6"
                      ></Image>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            onClick={toggleComments}
            className="cursor-pointer flex items-center gap-2"
          >
            <FaRegComment className="text-gray-300" size={20} />
            <p>{commnetsCount} </p>
          </div>
        </div>
        {postData?.content && (
          <div className=" px-3 py-2">
            <span className="text-sm text-gray-300">
              {getDisplayContent()}
              {shouldTruncate && !isExpanded && (
                <button
                  onClick={() => {
                    toggleContent();
                  }}
                  className=" text-opacity-85 focus:outline-none ml-1 tracking-[0.1rem]"
                >
                  ...
                </button>
              )}
            </span>
            {shouldTruncate && isExpanded && (
              <button
                onClick={() => {
                  toggleContent();
                }}
                className="text-opacity-85 focus:outline-none ml-1 tracking-[0.1rem]"
              >
                ...
              </button>
            )}
          </div>
        )}

        {showComments && (
          <div className="p-3 border-t border-gray-600 ">
            {loadingComments ? (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
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
                  <div
                    className=" flex cursor-pointer"
                    onClick={() => navigateToProfile(comment?.userId)}
                  >
                    <div className="mr-3 ">
                      {comment?.User?.profile_picture ? (
                        <img
                          src={comment?.User?.profile_picture}
                          alt="profile"
                          className="w-6 h-6 rounded-full"
                          onDragStart={(e) => e.preventDefault()}
                        />
                      ) : (
                        <UserProfilePicture
                          fullName={comment.User?.full_name}
                          size={28}
                        />
                      )}
                    </div>

                    <span className="m-0 font-bold  text-gray-500 text-sm">
                      @{comment.User?.username}
                    </span>
                  </div>
                  <p className="ml-10 text-sm text-gray-300">
                    {renderCommentWithLinks(comment?.comment)}
                  </p>
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
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-black border border-gray-400 p-5 rounded-md shadow-md max-w-sm mx-auto">
              <p className="text-center text-gray-300 mb-4 pb-3">
                <strong>Are you sure you want to delete this post?</strong>
              </p>
              <div className="flex justify-center gap-5 ">
                <button
                  className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none transition"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;

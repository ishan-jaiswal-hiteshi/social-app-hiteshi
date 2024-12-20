"use client";
import React, { useState } from "react";

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
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="border border-gray-300 rounded-lg max-w-md mx-auto my-5 font-sans bg-black ">
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
          <p>{postData?.content}</p>
        </div>
      </div>

      <div className="border-t border-gray-300 p-2 flex justify-start gap-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 cursor-pointer"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
          </svg>
          <p>{postData?.likes?.count} likes</p>
        </div>
        <div onClick={toggleComments} className="cursor-pointer">
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
          {postData?.comments?.list.map((comment) => (
            <div key={comment?.id} className="mb-3">
              <strong>{comment?.user?.name}</strong>{" "}
              <span className="text-gray-500">@{comment?.user?.username}</span>
              <p className="mt-1">{comment?.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;

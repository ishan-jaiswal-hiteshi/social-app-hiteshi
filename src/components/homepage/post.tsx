"use client";
import React, { useState } from "react";

// const postData = {
//   id: 12345,
//   user: {
//     id: 67890,
//     name: "John Doe",
//     username: "johndoe",
//     profilePictureUrl:
//       "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//   },
//   content: "Exploring the beauty of nature 🌿",
//   mediaUrl:
//     "https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?cs=srgb&dl=pexels-diimejii-3314294.jpg&fm=jpg",
//   timestamp: "2024-12-19T12:34:56Z",
//   likes: {
//     count: 120,
//     users: [
//       { id: 11111, name: "Jane Smith", username: "janesmith" },
//       { id: 22222, name: "Alex Johnson", username: "alexjohnson" },
//     ],
//   },
//   comments: {
//     count: 3,
//     list: [
//       {
//         id: 54321,
//         user: { id: 33333, name: "Emily Davis", username: "emilydavis" },
//         comment: "This is amazing!",
//         timestamp: "2024-12-19T13:00:00Z",
//         likes: {
//           count: 5,
//           users: [
//             { id: 44444, name: "Michael Brown", username: "michaelbrown" },
//           ],
//         },
//       },
//       {
//         id: 65432,
//         user: { id: 55555, name: "Chris Lee", username: "chrislee" },
//         comment: "Great post!",
//         timestamp: "2024-12-19T13:05:00Z",
//         likes: {
//           count: 2,
//           users: [
//             { id: 66666, name: "Taylor Wilson", username: "taylorwilson" },
//           ],
//         },
//       },
//     ],
//   },
// };

const Post = () => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "500px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* User Info */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <img
          src={postData.user.profilePictureUrl}
          alt="profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div>
          <strong>{postData.user.name}</strong>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
            @{postData.user.username}
          </p>
        </div>
      </div>

      <div>
        <img
          src={postData.mediaUrl}
          alt="post"
          style={{
            width: "100%",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        />
        <div style={{ padding: "10px" }}>
          <p>{postData.content}</p>
        </div>
      </div>

      <div
        style={{ borderTop: "1px solid #ddd" }}
        className="p-2 flex justify-start gap-2"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 -960 960 960"
          >
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
          </svg>
          <p>{postData.likes.count} likes</p>
        </div>
        <div onClick={toggleComments} style={{ cursor: "pointer" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 -960 960 960"
          >
            <path d="M320-60v-221q-101-8-170.5-82T80-540q0-109 75.5-184.5T340-800h27l-63-64 56-56 160 160-160 160-56-56 63-64h-27q-75 0-127.5 52.5T160-540q0 75 52.5 127.5T340-360h60v107l107-107h113q75 0 127.5-52.5T800-540q0-75-52.5-127.5T620-720h-20v-80h20q109 0 184.5 75.5T880-540q0 109-75.5 184.5T620-280h-80L320-60Z" />
          </svg>
          <p>{postData.comments.count} comments</p>
        </div>
      </div>

      {showComments && (
        <div style={{ padding: "10px", borderTop: "1px solid #ddd" }}>
          {postData.comments.list.map((comment) => (
            <div key={comment.id} style={{ marginBottom: "10px" }}>
              <strong>{comment.user.name}</strong>{" "}
              <span style={{ color: "#666" }}>@{comment.user.username}</span>
              <p style={{ margin: "5px 0 0" }}>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;

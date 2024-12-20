import React from "react";
import PostList from "../../components/homepage/post-list";

const Page = () => {
  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/670353238/video/4k-abstract-loop-futuristic-technology-background-with-lines-and-dots.jpg?s=640x640&k=20&c=kmxLhX7IZ5aa0KyphoUnEvFuawL-Un7G3-hfeokZFZo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <PostList />
    </div>
  );
};

export default Page;

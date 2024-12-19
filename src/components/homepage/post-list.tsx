import React from "react";
import postData from "../../utils/dummy-post-data";
import Post from "./post";

const PostList = () => {
  return (
    <div>
      {postData?.map((post) => (
        <Post key={post?.id} postData={post} />
      ))}
    </div>
  );
};

export default PostList;

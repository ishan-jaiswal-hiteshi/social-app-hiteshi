import React from "react";
import PostList from "../../../components/homepage/post-list";
import EventList from "@/components/homepage/event-list";

const Page = () => {
  return (
    <div className="min-h-screen text-white flex flex-row items-start justify-center  ">
      <div
        className="above-1148:w-3/5 h-screen overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <PostList />
      </div>

      <div
        className="w-2/5 h-screen overflow-y-auto hidden above-1148:block"
        style={{ scrollbarWidth: "none" }}
      >
        <EventList />
      </div>
    </div>
  );
};

export default Page;

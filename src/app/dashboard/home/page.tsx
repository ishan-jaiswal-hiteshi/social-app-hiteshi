import React from "react";
import PostList from "../../../components/homepage/post-list";
import EventList from "@/components/homepage/event-list";
import TopbarLayout from "@/components/dashboard/layout/topbar";

const Page = () => {
  return (
    <>
      <div className="mb-8 md:hidden">
        <TopbarLayout />
      </div>
      <div className="min-h-screen text-white flex flex-row items-start justify-center  ">
        <div
          className="above-1148:w-4/5 h-screen overflow-y-auto w-full"
          style={{ scrollbarWidth: "none" }}
        >
          <PostList />
        </div>

        <div
          className="w-2/5 h-screen overflow-y-auto hidden above-1148:block  border-l border-gray-600"
          style={{ scrollbarWidth: "none" }}
        >
          <EventList />
        </div>
      </div>
    </>
  );
};

export default Page;

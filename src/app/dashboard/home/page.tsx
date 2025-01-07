import React from "react";
import PostList from "../../../components/homepage/post-list";
import EventList from "@/components/homepage/event-list";
import Link from "next/link";
import { MdOutlineEvent } from "react-icons/md";

const Page = () => {
  return (
    <>
      <div className="mb-8 md:hidden">
        <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-black  border-b border-gray-700">
          <Link
            className="text-md font-semibold text-white mx-5 my-3"
            href="/dashboard/home"
          >
            Socialize@Hiteshi
          </Link>

          <Link
            className="text-md font-semibold text-white mx-5 my-3"
            href="/dashboard/events"
          >
            <MdOutlineEvent size={24} />
          </Link>
        </header>
      </div>
      <div className="min-h-screen text-white flex flex-row items-start justify-center  ">
        <div
          className="above-1148:w-4/5 h-screen overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <PostList />
        </div>

        <div
          className="w-1/5 h-screen overflow-y-auto hidden above-1148:block"
          style={{ scrollbarWidth: "none" }}
        >
          <EventList />
        </div>
      </div>
    </>
  );
};

export default Page;

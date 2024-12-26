"use client";
import { FiEdit } from "react-icons/fi";

interface ProfileHeaderProps {
  profilePicture: string;
  onEditClick: () => void;
  friends: number;
  posts: number;
  following: number;
}

export default function ProfileHeader({
  profilePicture,
  onEditClick,
  friends,
  posts,
  following,
}: ProfileHeaderProps) {
  return (
    <section className="relative block h-[500px]">
      <div
        className="absolute top-0 w-full h-full bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
        }}
      >
        <span className="w-full h-full absolute opacity-50 bg-black"></span>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden h-[70px] pointer-events-none"
        style={{ transform: "translateZ(0px)" }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="text-blueGray-200 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="relative flex flex-wrap justify-center -mt-32">
        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
          <div className="relative">
            <img
              alt="Profile"
              src={profilePicture}
              className="ring-4 ring-red-500 shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
            />
            <span className="top-14 left-10 absolute bg-red-600 p-2 rounded-full text-white hover:bg-red-600 cursor-pointer">
              <button
                type="button"
                onClick={onEditClick}
                className="p-0 m-0 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <FiEdit size={20} />
              </button>
            </span>
          </div>
        </div>
        <div className="w-full lg:w-4/12 px-4 lg:order-1">
          <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {friends}
              </span>
              <span className="text-sm text-blueGray-400">Friends</span>
            </div>
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {posts}
              </span>
              <span className="text-sm text-blueGray-400">Posts</span>
            </div>
            <div className="lg:mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {following}
              </span>
              <span className="text-sm text-blueGray-400">Following</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

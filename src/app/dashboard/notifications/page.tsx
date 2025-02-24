import Notifications from "@/components/notification";
import React from "react";

const page = () => {
  return (
    <div className="mt-5 text-white max-h-screen mb-10">
      <div className="max-w-lg mx-auto p-4  bg-gray-800 rounded-md">
        <Notifications />
      </div>
    </div>
  );
};

export default page;

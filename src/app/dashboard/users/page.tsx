import UsersList from "@/components/users/users-list";
import React from "react";
const Page = () => {
  return (
    <div className="overflow-y-auto min-h-screen text-white flex flex-col items-center justify-center mb-10">
      <UsersList />
    </div>
  );
};

export default Page;

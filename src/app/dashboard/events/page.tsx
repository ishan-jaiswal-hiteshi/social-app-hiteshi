"use client";

import React, { useState } from "react";
import AllEventsList from "@/components/events/events-list";
import { CreateEventForm } from "@/components/create-event";
import { MdAddCircleOutline } from "react-icons/md";

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="min-h-screen text-white  flex flex-row justify-between">
        <div
          className="above-1148:w-3/5 h-screen overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <AllEventsList />
        </div>
        <div className="min-h-screen h-[80%] border-r border-gray-500 hidden above-1148:block"></div>

        <div
          className="w-2/5 hidden above-1148:block mt-8 px-10 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <CreateEventForm />
        </div>
      </div>

      <div className="block above-1148:hidden fixed top-8 right-10">
        <button
          onClick={handleModalToggle}
          className="border flex justify-center border-gray-600  hover:bg-gray-800 text-primary-light px-2 py-2 rounded"
          type="button"
        >
          <MdAddCircleOutline size={24} />
          <p>Create Event</p>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <CreateEventForm onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

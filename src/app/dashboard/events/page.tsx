"use client";

import React, { useEffect, useState } from "react";
import AllEventsList from "@/components/events/events-list";
import { CreateEventForm } from "@/components/create-event";
import { MdAddCircleOutline } from "react-icons/md";

const Page = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1148) {
        setShowModal(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      <div className="min-h-screen text-white flex flex-row justify-between">
        <div
          className={`above-1148:w-3/5 h-screen ${
            showModal && "overflow-hidden fixed"
          }  overflow-y-auto above-1148:my-0 my-14 md:px-10 px-2`}
          style={{ scrollbarWidth: "none" }}
        >
          <AllEventsList />
        </div>

        <div
          className="w-2/5 hidden above-1148:block mt-8 mb-8 above-1148:ml-20  px-10 overflow-y-auto border-l border-gray-500"
          style={{ scrollbarWidth: "none" }}
        >
          <CreateEventForm />
        </div>
      </div>

      <div className="above-1148:hidden bg-black fixed top-2 right-2 flex items-center z-10">
        <button
          onClick={handleModalToggle}
          className="flex items-center justify-center space-x-2 border border-gray-600 hover:bg-gray-800 text-primary-light px-4 py-2 rounded-lg shadow-md"
          type="button"
        >
          <MdAddCircleOutline size={24} />
          <p className="text-sm font-medium">Create Event</p>
        </button>
      </div>

      {showModal && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 above-1148:hidden">
          <div className="relative bg-black text-white p-2 rounded-lg shadow-lg max-w-md w-full mx-10  border border-gray-500">
            <CreateEventForm onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

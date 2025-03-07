"use client";

import React, { useState } from "react";
import { Event } from "@/props/eventProps";
import { EventListSkeleton } from "@/utils/skeletons";
import { IoIosMenu } from "react-icons/io";

interface AllEventsListProps {
  onEventSelect: (event: Event) => void;
  selectedEventId: number | null;
  events: Event[];
  loading: boolean;
}

const AllEventsList: React.FC<AllEventsListProps> = ({
  onEventSelect,
  selectedEventId,
  events,
  loading,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEventSelect = (event: Event) => {
    onEventSelect(event);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="my-8 md:block hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <EventListSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <p className="text-gray-500 text-center my-8">No events available.</p>
    );
  }

  return (
    <div>
      <div className="fixed top-7 right-2 md:hidden">
        <button onClick={toggleMenu} className="text-white p-2 rounded-full">
          <IoIosMenu size={30} />
        </button>
      </div>

      <div
        className={` fixed inset-0 bg-black bg-opacity-70 z-10 backdrop-blur-md transition-transform ${
          menuOpen ? "transform-none" : "transform translate-x-full"
        } md:hidden`}
      >
        <div className="fixed top-0 right-0 h-full w-[70%] bg-black p-3 space-y-2 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventSelect(event)}
              className={`p-4 py-6 mb-3 rounded-lg cursor-pointer flex items-center space-x-4 ${
                selectedEventId === event.id
                  ? "bg-gray-800"
                  : "bg-black border-gray-700 border-2 hover:bg-gray-900"
              }`}
            >
              {event.mediaUrls && event.mediaUrls.length > 0 && (
                <img
                  src={event.mediaUrls[0]}
                  alt={event.name}
                  className="w-14 h-14 object-cover rounded-lg"
                  onDragStart={(e) => e.preventDefault()}
                />
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white line-clamp-1 ">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-1">
                  {new Date(event.eventDate).toLocaleDateString()} -{" "}
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[30%] h-screen" onClick={toggleMenu}></div>
      </div>

      <div className="md:block  hidden">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventSelect(event)}
            className={`p-4 py-6 mb-2 rounded-lg cursor-pointer flex items-center space-x-4 ${
              selectedEventId === event.id
                ? "bg-gray-800"
                : "bg-black border-gray-700 border-2 hover:bg-gray-900"
            }`}
          >
            {event.mediaUrls && event.mediaUrls.length > 0 && (
              <img
                src={event.mediaUrls[0]}
                alt={event.name}
                className="w-16 h-16 object-cover rounded-lg"
                onDragStart={(e) => e.preventDefault()}
              />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1 line-clamp-1 ">
                {event.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-1">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-sm text-gray-400 line-clamp-1">
                <strong>Date:</strong>{" "}
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEventsList;

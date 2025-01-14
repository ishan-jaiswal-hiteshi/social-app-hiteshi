"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { EventListSkeleton, EventsSkeleton } from "@/utils/skeletons";
import { IoIosMenu } from "react-icons/io"; // Import the menu icon

interface AllEventsListProps {
  onEventSelect: (event: Event) => void;
  selectedEventId: number | null; // Highlight the selected event
}

const AllEventsList: React.FC<AllEventsListProps> = ({
  onEventSelect,
  selectedEventId,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ events: Event[] }>(
        "get-events"
      );
      if (response && response.data) {
        setEvents(response.data.events); // Ensure the response matches the type
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in Fetching Events", err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleEventSelect = (event: Event) => {
    onEventSelect(event);
    setMenuOpen(false); // Close the menu when an event is selected
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle the menu visibility
  };

  if (loading) {
    return (
      <div className="my-8">
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
      {/* Menu Button for Mobile */}
      <div className="fixed top-7 right-2 lg:hidden">
        <button onClick={toggleMenu} className="text-white p-2 rounded-full">
          <IoIosMenu size={30} />
        </button>
      </div>

      {/* Menu - Event List with Blur and Transition from Right to Left */}
      <div
        className={` fixed inset-0 bg-black bg-opacity-70 z-10 backdrop-blur-md transition-transform ${
          menuOpen ? "transform-none" : "transform translate-x-full"
        } lg:hidden`}
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
              {/* Event Image */}
              {event.mediaUrls && event.mediaUrls.length > 0 && (
                <img
                  src={event.mediaUrls[0]}
                  alt={event.name}
                  className="w-14 h-14 object-cover rounded-lg"
                  onDragStart={(e) => e.preventDefault()}
                />
              )}

              {/* Event Details */}
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
      </div>

      {/* Event List for Desktop (Unchanged) */}
      <div className="lg:block  hidden">
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
            {/* Event Image */}
            {event.mediaUrls && event.mediaUrls.length > 0 && (
              <img
                src={event.mediaUrls[0]}
                alt={event.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}

            {/* Event Details */}
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

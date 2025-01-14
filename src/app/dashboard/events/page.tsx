"use client";

import React, { useEffect, useState } from "react";
import AllEventsList from "@/components/events/events-list";
import EventDetails from "@/components/events/event-details";
import { MdAddCircleOutline } from "react-icons/md";
import { CreateEventForm } from "@/components/create-event";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";

const Page = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const fetchAllEvents = async () => {
    try {
      const response = await axiosInstance.get<{ events: Event[] }>(
        "get-events"
      );
      if (response && response.data) {
        setEvents(response.data.events);

        if (response.data.events.length > 0 && !selectedEvent) {
          setSelectedEvent(response.data.events[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  return (
    <div className="min-h-screen flex flex-col  text-white">
      {/* Create Button */}
      <div className="bg-black fixed top-7 right-14 lg:right-10 items-center">
        <button
          onClick={handleModalToggle}
          className="flex items-center justify-center space-x-2 border border-gray-600 hover:bg-gray-800 text-primary-light px-4 py-2 rounded-lg shadow-md"
          type="button"
        >
          <MdAddCircleOutline size={24} />
          <p className="text-sm font-medium">Create</p>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow mt-12 lg:mt-7 ">
        {/* Event Details (Non-Scrollable) */}
        <div className="lg:w-2/3 h-auto px-4 lg:px-6 ">
          <EventDetails selectedEvent={selectedEvent} />
        </div>

        {/* Event List (Scrollable) */}
        <div
          className="lg:w-1/3 border-l-2 border-gray-700 overflow-y-auto h-[calc(100vh-80px)] px-4 mt-12 lg:px-2"
          style={{ scrollbarWidth: "none" }}
        >
          <AllEventsList
            onEventSelect={handleEventSelect}
            selectedEventId={selectedEvent?.id || null}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-black text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4 border border-gray-500">
            <CreateEventForm onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

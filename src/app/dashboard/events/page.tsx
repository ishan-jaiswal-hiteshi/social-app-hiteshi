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

        // Automatically select the latest event on first load
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

  return (
    <div className="">
      {/* Header Create Button */}
      <div className="bg-black fixed top-4 right-12 items-center">
        <button
          onClick={handleModalToggle}
          className="flex items-center justify-center space-x-2 border border-gray-600 hover:bg-gray-800 text-primary-light px-4 py-2 rounded-lg shadow-md"
          type="button"
        >
          <MdAddCircleOutline size={24} />
          <p className="text-sm font-medium">Create</p>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen mt-7 text-white">
        {/* Event Details */}
        <div className="lg:w-2/3 h-full px-4 lg:px-6 border-l border-gray-600">
          <EventDetails selectedEvent={selectedEvent} />
        </div>
        {/* Events List */}
        <div className="lg:w-1/3 border-l-2 border-gray-700 h-full overflow-y-auto px-4 mt-8 lg:px-2">
          <AllEventsList
            onEventSelect={handleEventSelect}
            selectedEventId={selectedEvent?.id || null}
          />
        </div>
      </div>

      {/* Create Event Modal */}
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

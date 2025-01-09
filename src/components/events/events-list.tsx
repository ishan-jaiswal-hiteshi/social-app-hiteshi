"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { EventsSkeleton } from "@/utils/skeletons";
import Events from "./events";

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

  const fetchAllEvents = async () => {
    try {
      const response = await axiosInstance.get<{ events: Event[] }>(
        "get-events"
      );
      if (response && response.data) {
        setEvents(response.data.events); // Ensure the response matches the type
      }
    } catch (err) {
      console.error("Error in Fetching Events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  if (loading) {
    return (
      <div className="my-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <EventsSkeleton key={index} />
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
    <div className="bg-black">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventSelect(event)}
          className={`p-4 mb-3 rounded-lg cursor-pointer ${
            selectedEventId === event.id
              ? "bg-gray-700"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          <h3 className="font-bold ">{event.name}</h3>
          <p className="text-sm text-gray-400">
            {new Date(event.eventDate).toLocaleDateString()} - {event.location}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllEventsList;

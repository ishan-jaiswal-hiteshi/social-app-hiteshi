"use client";

import React, { useEffect, useState } from "react";
import EventCard from "./event-card";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { EventCardSkeleton } from "@/utils/skeletons";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = async () => {
    try {
      const response = await axiosInstance.get("get-events", {
        params: { limit: 5 },
      });
      if (response && response?.data) {
        setEvents(response?.data?.events);
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
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <p className="text-gray-500 text-center">No events available.</p>;
  }

  return (
    <div className="mt-8 mb-6">
      <div className="w-full px-2 border-l border-gray-600">
        <h2 className="text-2xlfont-semibold text-white mb-2">Top Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;

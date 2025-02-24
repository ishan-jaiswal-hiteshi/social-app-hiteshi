"use client";

import React, { useEffect, useState } from "react";
import EventCard from "./event-card";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { EventCardSkeleton } from "@/utils/skeletons";
import Link from "next/link";

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
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in Fetching Events", err);
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
    return (
      <div className="mt-7 mb-6 ">
        <div className="w-full px-3 pt-4  text-center text-gray-500 my-8">
          No events available.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 mb-6 ">
      <div className="w-full px-3 pt-4 ">
        <h2 className="text-lg font-semibold text-white mb-2">
          Upcoming Events
        </h2>
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <Link href={"/dashboard/events"}>
          <div className="flex my-2 bg-black items-center justify-center p-4 border rounded-lg border-gray-700">
            <button className="text-primary-light hover:text-red-700">
              See More
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EventList;

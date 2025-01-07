"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { EventsSkeleton } from "@/utils/skeletons";
import Events from "./events";

const sortEvents = (events: Event[]) => {
  const today = new Date();
  const todayEvents = events.filter(
    (event) => new Date(event.eventDate).toDateString() === today.toDateString()
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > today
  );

  return { todayEvents, upcomingEvents };
};

const AllEventsList: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = async () => {
    try {
      const response = await axiosInstance.get("get-events");
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
      <div className="my-8 md:mx-20">
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
  const { todayEvents, upcomingEvents } = sortEvents(events);

  return (
    <div className="my-8 md:mx-20 mx-auto">
      {todayEvents && todayEvents.length > 0 && (
        <div>
          <div>
            {todayEvents.map((event) => (
              <Events key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div>
          <div>
            {upcomingEvents.map((event) => (
              <Events key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEventsList;

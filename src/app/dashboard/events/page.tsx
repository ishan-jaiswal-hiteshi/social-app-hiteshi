"use client";

import React, { useEffect, useState } from "react";
import AllEventsList from "@/components/events/events-list";
import EventDetails from "@/components/events/event-details";
import { MdAddCircleOutline } from "react-icons/md";
import { CreateEventForm } from "@/components/create-event";
import axiosInstance from "@/utils/axiosInstance";
import { Event } from "@/props/eventProps";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";

const Page = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleEventFetch = () => {
    fetchAllEvents();
  };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("get-events");
      if (response?.data?.events) {
        setEvents(response.data.events);

        const eventIdParam = searchParams.get("eventId");
        let selected = null;

        if (eventIdParam) {
          const eventId = parseInt(eventIdParam, 10);
          selected = response.data.events.find((e: Event) => e.id === eventId);
        }

        if (!selected && response.data.events.length > 0) {
          selected = response.data.events[0];
          router.push(`?eventId=${selected.id}`, { scroll: false });
        }

        setSelectedEvent(selected);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
    fetchAllEvents();
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    router.push(`?eventId=${event.id}`, { scroll: false });
  };

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
    <div className="min-h-screen flex flex-col text-white">
      {(user?.role === "admin" ||
        user?.role === "manager" ||
        user?.permissions?.can_create_event) && (
        <div className="bg-black fixed top-7 right-14 md:right-7 items-center">
          <button
            onClick={handleModalToggle}
            className="flex items-center justify-center space-x-2 border border-gray-600 hover:bg-gray-800 text-primary-light px-4 py-2 rounded-lg shadow-md"
            type="button"
          >
            <MdAddCircleOutline size={24} className="text-red-600" />
            <p className="text-sm font-medium text-red-500">Create</p>
          </button>
        </div>
      )}

      <div className="flex flex-grow mt-12 md:mt-7">
        <div className="md:w-2/3 w-full h-auto px-4 md:px-6 mt-4 mb-10 md:mb-0">
          <EventDetails
            selectedEvent={selectedEvent}
            onEventDelete={handleEventFetch}
          />
        </div>
        <div
          className="md:w-1/3 md:border-l-2 border-gray-700 overflow-y-auto h-[calc(100vh-100px)] px-4 mt-12 md:px-2"
          style={{ scrollbarWidth: "none" }}
        >
          <AllEventsList
            onEventSelect={handleEventSelect}
            selectedEventId={selectedEvent?.id || null}
            events={events}
            loading={loading}
          />
        </div>
      </div>

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

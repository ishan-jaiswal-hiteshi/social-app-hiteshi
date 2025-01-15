"use client";

import React from "react";
import { Event } from "@/props/eventProps";

interface EventDetailsProps {
  selectedEvent: Event | null;
}

const EventDetails: React.FC<EventDetailsProps> = ({ selectedEvent }) => {
  if (!selectedEvent) {
    return (
      <div className="text-gray-500 text-center my-8">
        No event selected. Click on an event to view details.
      </div>
    );
  }

  return (
    <div className="my-8 p-4 md:p-6 bg-black rounded-xl border-2 border-gray-800 shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        {selectedEvent.name}
      </h2>

      {selectedEvent.mediaUrls && selectedEvent.mediaUrls.length > 0 && (
        <div className="mb-4">
          <img
            src={selectedEvent.mediaUrls[0]}
            alt={selectedEvent.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      )}

      <div className="space-y-2">
        <p>
          <span className="font-semibold text-gray-300">Description:</span>{" "}
          {selectedEvent.description || "No description provided."}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Date:</span>{" "}
          {new Date(selectedEvent.eventDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Location:</span>{" "}
          {selectedEvent.location}
        </p>
        <p>
          <span className="font-semibold text-gray-300">Created By:</span>{" "}
          {selectedEvent.user.full_name} (
          <span className="italic">{selectedEvent.user.username}</span>)
        </p>
        <p className="text-gray-400 text-sm">
          Created At: {new Date(selectedEvent.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default EventDetails;

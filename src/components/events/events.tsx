import { Event } from "@/props/eventProps";
import React from "react";

interface EventCardProps {
  event: Event;
}

const Events: React.FC<EventCardProps> = ({ event }) => {
  const { name, description, eventDate, location, mediaUrls } = event;

  return (
    <div className="bg-black p-4 rounded-lg shadow-lg mx-auto flex md:flex-row flex-col gap-4 text-left my-2 border border-gray-600">
      {mediaUrls && mediaUrls.length > 0 && (
        <div onDragStart={(e) => e.preventDefault()}>
          <img
            src={mediaUrls[0]}
            alt={name}
            className="md:w-48 w-full h-48  rounded-lg"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <p className="text-sm text-gray-400 mb-1">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong>{" "}
          {new Date(eventDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default Events;

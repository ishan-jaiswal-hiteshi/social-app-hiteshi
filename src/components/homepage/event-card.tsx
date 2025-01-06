import { Event } from "@/props/eventProps";
import React from "react";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { name, description, eventDate, location, mediaUrls } = event;

  return (
    <div className="bg-black p-4 rounded-lg shadow-lg mx-auto  flex justify-start gap-4 text-left ">
      <div className="w-[40%]">
        {mediaUrls && mediaUrls.length > 0 ? (
          <img
            src={mediaUrls[0]}
            alt={name}
            className="w-full h-full object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="w-[60%]">
        <h3 className="text-xl font-semibold mb-2 ">{name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-1">{description}</p>
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

export default EventCard;

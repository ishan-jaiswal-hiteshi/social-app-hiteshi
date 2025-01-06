import { Event } from "@/props/eventProps";
import React from "react";

interface EventCardProps {
  event: Event;
}

const Events: React.FC<EventCardProps> = ({ event }) => {
  const { name, description, eventDate, location, mediaUrls } = event;

  return (
    <div className="bg-black p-4 rounded-lg shadow-lg mx-auto flex flex-col gap-4 text-left">
      <div>
        {mediaUrls && mediaUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mediaUrls.slice(0, 4).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${name} - Image ${index + 1}`}
                className={`object-cover rounded-lg ${
                  mediaUrls.length === 2
                    ? "h-48 w-full"
                    : mediaUrls.length === 3 && index === 0
                    ? "col-span-2 h-48 w-full"
                    : "h-24"
                }`}
              />
            ))}
            {mediaUrls.length > 4 && (
              <div className="relative flex items-center justify-center bg-gray-800 text-white text-sm font-bold rounded-lg">
                +{mediaUrls.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
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

import { Event } from "@/props/eventProps";
import React from "react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { name, description, eventDate, location, mediaUrls } = event;
  const router = useRouter();

  return (
    <div
      className="bg-black p-4 rounded-lg shadow-lg mx-auto  flex justify-start gap-4 text-left cursor-pointer border border-gray-600"
      onClick={() => router.push("/dashboard/events")}
    >
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="w-[40%]">
          <img
            src={mediaUrls[0]}
            alt={name}
            className="w-full h-full object-cover rounded-lg mb-4"
          />
        </div>
      )}
      <div className="w-[60%]">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-1">{description}</p>
        <p className="text-sm text-gray-400 mb-1 line-clamp-1">
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

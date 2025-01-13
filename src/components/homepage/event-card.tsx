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
      className="bg-black p-4 py-5 rounded-lg shadow-lg mx-auto  flex justify-start gap-4 text-left cursor-pointer border border-gray-600"
      onClick={() => router.push("/dashboard/events")}
    >
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="">
          <img
            src={mediaUrls[0]}
            alt={name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
      )}
      <div className="">
        <h3 className=" font-semibold mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-400  line-clamp-1">
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

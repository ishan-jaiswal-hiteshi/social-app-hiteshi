"use client";

import React, { useState } from "react";
import { Event } from "@/props/eventProps";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";

interface EventDetailsProps {
  selectedEvent: Event | null;
  onEventDelete: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  selectedEvent,
  onEventDelete,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const { user } = useAuth();
  if (!selectedEvent) {
    return (
      <div className="text-gray-500 text-center my-16">
        No event selected. Click on an event to view details.
      </div>
    );
  }

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/delete-event/${selectedEvent?.id}`
      );

      if (response) {
        setShowDeleteConfirmation(false);

        onEventDelete();
      }
    } catch (err) {
      console.log("Error in deleting the event");
    }
  };

  return (
    <div className="relative my-8 p-4 md:p-6 rounded-xl bg-gray-900 shadow-md">
      {(user?.role === "admin" ||
        user?.role === "manager" ||
        user?.permissions?.can_create_event) && (
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="absolute top-5 right-5 hover:bg-gray-400 transition p-2 rounded-full"
        >
          <MdDeleteOutline color="red" size={20} />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4 text-red-600">
        {selectedEvent?.name}
      </h2>

      {selectedEvent?.mediaUrls && selectedEvent?.mediaUrls?.length > 0 && (
        <div className="mb-4">
          <img
            src={selectedEvent?.mediaUrls[0]}
            alt={selectedEvent?.name}
            className="w-full h-64 object-contain rounded-lg shadow-md"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      )}

      <div className="space-y-2">
        <p>
          <span className="font-semibold text-gray-400">Description:</span>{" "}
          {selectedEvent.description || "No description provided."}
        </p>
        <p>
          <span className="font-semibold text-gray-400">Date:</span>{" "}
          {new Date(selectedEvent.eventDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold text-gray-400">Location:</span>{" "}
          {selectedEvent.location}
        </p>
        <p>
          <span className="font-semibold text-gray-400">Created By:</span>{" "}
          {selectedEvent.user.full_name} (
          <span className="italic">{selectedEvent.user.username}</span>)
        </p>
        <p className="text-gray-400 text-sm">
          Created At: {new Date(selectedEvent.createdAt).toLocaleString()}
        </p>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black border border-gray-400 p-5 rounded-md shadow-md max-w-sm mx-auto">
            <p className="text-center text-gray-300 mb-4 pb-3">
              <strong>Are you sure you want to delete this Event?</strong>
            </p>
            <div className="flex justify-center gap-5 ">
              <button
                className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none transition"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;

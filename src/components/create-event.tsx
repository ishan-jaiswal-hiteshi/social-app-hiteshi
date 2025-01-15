import { useState, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

interface CreateEventFormProps {
  onClose?: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onClose,
}) => {
  const { user } = useAuth();
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!eventName || !eventDate) {
      return;
    }

    try {
      setLoading(true);
      const mediaUrls = [];
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const mediaResponse = await axiosInstance.post(
          "/single-upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (mediaResponse && mediaResponse.data?.mediaUrl) {
          mediaUrls.push(mediaResponse.data?.mediaUrl);
        }
      }

      const uploadData = {
        userId: user?.id,
        name: eventName,
        eventDate: eventDate,
        description: eventDescription,
        location: location || "Hiteshi",
        mediaUrls: mediaUrls,
      };

      const eventResponse = await axiosInstance.post(
        "/create-event",
        uploadData
      );

      if (eventResponse) {
        toast.success("Event Created Successfully!");
        setEventDate("");
        setEventDescription("");
        setEventName("");
        setImage(null);
        setLocation("");
        setPreview(null);
        router.push("/dashboard/events");
        onClose?.();
      }
    } catch (error) {
      console.error("Error in creating an event", error);
      toast.error("Error in Creating Event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg ">
      <h2 className="text-xl font-bold mb-4">Create Event</h2>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent  rounded-full text-red-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).nodeName !== "TEXTAREA"
          ) {
            e.preventDefault();
            handleSubmit(e as React.FormEvent);
          }
        }}
      >
        <div className="mb-4">
          <label className="block mb-2">Event Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Event Date</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Location</label>
          <input
            type="text"
            placeholder="Hiteshi"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Event Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
            placeholder="Enter event description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Event Picture
          </label>
          <div
            className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {preview ? (
              <img
                src={preview}
                alt="Cover Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Choose Picture</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-primary-light px-4 py-2 rounded">
            Submit
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-2 border border-gray-500 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/authContext";

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
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (images.length + newFiles.length > 10) {
        toast.error("You can only upload up to 10 images.");
        return;
      }
      setImages((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!eventName || !eventDate) {
      toast.error("Event name and date are required.");
      return;
    }

    if (images.length === 0) {
      toast.error("At least one image is required.");
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append("files", image);
    });

    try {
      setLoading(true);
      const mediaResponse = await axiosInstance.post(
        "/multiple-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (mediaResponse && mediaResponse.data?.mediaUrls) {
        const uploadData = {
          userId: user?.id,
          name: eventName,
          eventDate: eventDate,
          description: eventDescription,
          location: location || "Hiteshi",
          mediaUrls: mediaResponse?.data?.mediaUrls,
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
          setImages([]);
          setLocation("");
          onClose?.();
        }
      } else {
        throw new Error("Media upload failed. No media URL received.");
      }
    } catch (error) {
      console.error("Error in creating an event", error);
      toast.error("Error in Creating Event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Event</h2>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent rounded-full text-red-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Event Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
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
        <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-center text-gray-300 hover:text-gray-400"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="text-gray-500"
                className="text-gray-500"
              >
                <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload images (Max: 10)
              </p>
            </div>
          </label>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
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

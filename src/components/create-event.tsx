interface CreateEventFormProps {
  onClose?: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onClose,
}) => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Event</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2">Event Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter event name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Event Date</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Event Description</label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
            placeholder="Enter event description"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded">
          Submit
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-red-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

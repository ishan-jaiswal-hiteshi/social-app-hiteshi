"use client";

interface ProfileModalProps {
  isOpen: boolean;
  profileData: {
    name: string;
    location: string;
    jobTitle: string;
    university: string;
    bio: string;
    profilePicture: string;
  };
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileModal({
  isOpen,
  profileData,
  onClose,
  onChange,
  onFileChange,
  onSubmit,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={onChange}
              className="w-full p-2 border rounded text-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={onChange}
              className="w-full p-2 border rounded text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={profileData.jobTitle}
              onChange={onChange}
              className="w-full p-2 border rounded text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">University</label>
            <input
              type="text"
              name="university"
              value={profileData.university}
              onChange={onChange}
              className="w-full p-2 border rounded text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={onChange}
              className="w-full p-2 border rounded text-gray-500"
              rows={4}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 active:bg-gray-400 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 active:bg-red-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

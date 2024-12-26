"use client";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Jenna Stones",
    username: "jennastones",
    profilePicture:
      "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg",
    otherDetails: {
      coverPicture:
        "https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80",
      location: "Los Angeles, California",
      jobTitle: "Solution Manager - Creative Tim Officer",
      university: "University of Computer Science",
      bio: "An artist of considerable range, Jenna writes, performs, and records all her music.",
      friends: 23,
      following: 48,
      posts: 75,
    },
  });
  const [editData, setEditData] = useState(profileData);
  const [files, setFiles] = useState<{
    profilePicture?: File;
    coverPhoto?: File;
  }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/me");
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data.", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "fullName" || name === "username") {
      setEditData((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditData((prev) => ({
        ...prev,
        otherDetails: { ...prev.otherDetails, [name]: value },
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const { name } = e.target;
      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  const uploadFile = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.publicUrl;
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setEditData(profileData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = { ...editData };

      // Upload files and add public URLs to updateData
      if (files.profilePicture) {
        updateData.profilePicture = await uploadFile(files.profilePicture);
      }
      if (files.coverPhoto) {
        updateData.otherDetails.coverPicture = await uploadFile(
          files.coverPhoto
        );
      }

      const response = await axiosInstance.put("/updateprofile", updateData);
      console.log("Profile updated successfully:", response.data);
      alert("Profile updated successfully!");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:ml-52">
      <div className="flex-grow flex flex-col">
        <section className="relative block h-[500px]">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${profileData.otherDetails.coverPicture})`,
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 w-full overflow-hidden h-[70px] pointer-events-none"
            style={{ transform: "translateZ(0px)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>

        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="Profile"
                        src={profileData.profilePicture}
                        className="ring-4 ring-red-500 shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                      />
                      <span className="top-14 left-10 absolute bg-red-600 p-2 rounded-full text-white hover:bg-red-600 cursor-pointer">
                        <button
                          type="button"
                          onClick={handleModalToggle}
                          className="p-0 m-0 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                          <FiEdit size={20} />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 flex flex-wrap justify-center sm:mt-24 lg:justify-end items-center gap-4 mt-24 ">
                    <button
                      className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-6 py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                    >
                      Connect
                    </button>
                    <button
                      className="border-2 border-red-500 active:border-red-300 active:text-red-300 uppercase text-red-400 font-bold hover:shadow-md shadow text-xs px-6 py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                    >
                      Message
                    </button>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profileData.otherDetails.friends}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Friends
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profileData.otherDetails.posts}
                        </span>
                        <span className="text-sm text-blueGray-400">Posts</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profileData.otherDetails.following}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Following
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profileData.fullName}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {profileData.otherDetails.location}
                  </div>
                  <hr className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10" />
                  <div className="mb-2 text-blueGray-600 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    {profileData.otherDetails.jobTitle}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    {profileData.otherDetails.university}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-red-500 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {profileData.otherDetails.bio}
                      </p>
                      <a href="#pablo" className="font-normal text-red-500">
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData.otherDetails.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editData.otherDetails.jobTitle}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">University</label>
                <input
                  type="text"
                  name="university"
                  value={editData.otherDetails.university}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={editData.otherDetails.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Cover Photo</label>
                <input
                  type="file"
                  name="coverPhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="px-4 py-2 bg-gray-300 active:bg-gray-400 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 active:bg-red-600 text-white rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-7 w-7 mr-1 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-30"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-25"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

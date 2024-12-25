"use client";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Jenna Stones",
    location: "Los Angeles, California",
    jobTitle: "Solution Manager - Creative Tim Officer",
    university: "University of Computer Science",
    bio: "An artist of considerable range, Jenna the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.",
    profilePicture:
      "https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg",
    friends: 23,
    following: 48,
    posts: 75,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setProfileData((prev) => ({ ...prev, profilePicture: fileURL }));
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false); // Close the modal after submission
    console.log("Updated Profile Data:", profileData);
  };

  return (
    <div className="min-h-screen flex flex-col md:ml-52">
      <div className="flex-grow flex flex-col">
        <section className="relative block h-[500px]">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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
                        src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
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
                          {profileData.friends}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Friends
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profileData.posts}
                        </span>
                        <span className="text-sm text-blueGray-400">Posts</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {profileData.following}
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
                    {profileData.name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {profileData.location}{" "}
                  </div>
                  <hr className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10" />

                  <div className="mb-2 text-blueGray-600 mt-10 ">
                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    {profileData.jobTitle}{" "}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    {profileData.university}{" "}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-red-500 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {profileData.bio}
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
                <label className="block text-sm font-medium ">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
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
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">University</label>
                <input
                  type="text"
                  name="university"
                  value={profileData.university}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">
                  Cover Photo
                </label>
                <input
                  type="file"
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
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

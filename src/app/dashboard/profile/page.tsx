"use client";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [friends, setFriends] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    profile_picture: "",
    other_data: {
      cover_picture: "",
      location: "",
      job_title: "",
      university: "",
      bio: "",
      friends: 0,
      following: 0,
      posts: 0,
    },
  });

  const [editData, setEditData] = useState(profileData);
  const [files, setFiles] = useState<{
    profile_picture?: File;
    cover_picture?: File;
  }>({});

  useEffect(() => {
    if (user) {
      setLoading(true);
      setProfileData({
        full_name: user.full_name || "",
        username: user.username || "",
        profile_picture:
          user?.profile_picture ||
          "https://i.pinimg.com/736x/1a/09/3a/1a093a141eeecc720c24543f2c63eb8d.jpg",
        other_data: {
          cover_picture:
            user?.other_data?.cover_picture ||
            "https://hiteshi.com/_next/static/media/logo.9b8ca92c.png",
          location: user?.other_data?.location || "No location added.",
          job_title: user?.other_data?.job_title || "No work details added.",
          university:
            user?.other_data?.university || "No education details added.",
          bio: user?.other_data?.bio || "No bio added.",
          friends: user?.other_data?.friends || 0,
          following: user?.other_data?.following || 0,
          posts: user?.other_data?.posts || 0,
        },
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "full_name" || name === "username") {
      setEditData((prev) => ({ ...prev, [name]: value }));
    } else if (name.startsWith("other_data.")) {
      const field = name.split(".")[1];
      setEditData((prev) => ({
        ...prev,
        other_data: { ...prev.other_data, [field]: value },
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      const { name } = e.target;
      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  const uploadFile = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.mediaUrl;
    } catch (error) {
      console.error("Failed to Upload", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditOpen(!isEditOpen);
    if (!isEditOpen) {
      setEditData(profileData);
    }
  };
  const handleFollowingToggle = () => {
    fetchAllFollowings();
    setIsFollowingOpen(!isFollowingOpen);
  };
  const handleFriendsToggle = () => {
    fetchAllFriends();
    setIsFriendsOpen(!isFriendsOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = { ...editData, userId: user?.id };
      if (files.profile_picture) {
        updateData.profile_picture = await uploadFile(files.profile_picture);
      }
      if (files.cover_picture) {
        updateData.other_data.cover_picture = await uploadFile(
          files.cover_picture
        );
      }

      const response = await axiosInstance.post("/profile-update", updateData);
      setProfileData(response.data.profile);
      toast.success("Profile Updated");
    } catch (error) {
      toast.error("Failed to Update");
      console.error("Failed to Upload", error);
    } finally {
      setIsSubmitting(false);
      setIsEditOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isEditOpen) {
          setIsEditOpen(false);
        }
        if (isFriendsOpen) {
          setIsFriendsOpen(false);
        }
        if (isFollowingOpen) {
          setIsFollowingOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditOpen, isFollowingOpen, isFriendsOpen]);

  const fetchAllFriends = async () => {
    try {
      const response = await axiosInstance.get(`/get-followers/${user?.id}`);
      if (response && response?.data) {
        setFriends(response?.data?.followers);
      }
    } catch (err) {
      console.log("Error In Fetching friends list", err);
    }
  };

  const fetchAllFollowings = async () => {
    try {
      const response = await axiosInstance.get(`/get-followings/${user?.id}`);
      if (response && response?.data) {
        setFollowings(response?.data?.following);
      }
    } catch (err) {
      console.log("Error In Fetching friends list", err);
    }
  };

  const Skeleton = () => (
    <div className="min-h-screen flex flex-col md:ml-52 p-6">
      <div className="relative block h-[500px] bg-gray-300 animate-pulse">
        <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gray-400 animate-pulse"></div>
      </div>

      <div className="relative py-16 bg-blueGray-200 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <div className="rounded-full ring-4 ring-red-500 shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16 bg-gray-400 animate-pulse"></div>
                  </div>
                </div>

                <div className="w-full lg:w-4/12 px-4 lg:order-3 flex flex-wrap justify-center sm:mt-24 lg:justify-end items-center gap-4 mt-24 ">
                  <button className="bg-gray-400 animate-pulse w-24 h-8 rounded-md"></button>
                  <button className="bg-gray-400 animate-pulse w-24 h-8 rounded-md"></button>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <div className="w-24 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <div className="w-24 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <div className="w-24 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-5">
                <div className="w-48 h-8 bg-gray-400 animate-pulse mx-auto rounded-md mb-4"></div>
                <div className="w-36 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
                <div className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10"></div>
                <div className="w-48 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
                <div className="w-48 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
              </div>

              <div className="mt-10 py-10 border-t border-red-500 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <div className="w-72 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-6"></div>
                    <div className="w-40 h-6 bg-gray-400 animate-pulse mx-auto rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col md:ml-52">
      <div className="flex-grow flex flex-col">
        <section className="relative block h-[500px]">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${profileData?.other_data?.cover_picture})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>

          <div className="fixed top-5 right-5 sm:hidden">
            <Link
              href="/"
              onClick={() => {
                localStorage.removeItem("accessToken");
              }}
              className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="red"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </svg>
            </Link>
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
                      <div className="rounded-full ring-4 ring-red-500 shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16">
                        <img
                          alt="Profile"
                          src={profileData?.profile_picture}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="top-14 left-10 absolute bg-red-600 p-2 rounded-full text-white hover:bg-red-600 cursor-pointer">
                        <button
                          type="button"
                          onClick={handleEditToggle}
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
                        <button onClick={handleFriendsToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.other_data?.friends}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Friends
                          </span>
                        </button>
                      </div>

                      <div className="mr-4 p-3 text-center">
                        <Link href="/dashboard/profile//myposts">
                          <span className="cursor-pointer text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.other_data?.posts}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Posts
                          </span>
                        </Link>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <button onClick={handleFollowingToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.other_data?.following}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Following
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profileData?.full_name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    {profileData?.other_data?.location}
                  </div>
                  <hr className="w-72 h-0.5 mx-auto my-5 bg-red-500 border-0 rounded md:my-5" />
                  <div className="mb-2 text-blueGray-600 mt-2">
                    {profileData?.other_data?.job_title}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    {profileData?.other_data?.university}
                  </div>
                </div>
                <div className="mt-7 py-10 border-t border-red-500 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {profileData?.other_data?.bio}
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
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="other_data.location"
                  value={editData.other_data.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Job Title</label>
                <input
                  type="text"
                  name="other_data.job_title"
                  value={editData.other_data.job_title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">University</label>
                <input
                  type="text"
                  name="other_data.university"
                  value={editData.other_data.university}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  name="other_data.bio"
                  value={editData.other_data.bio}
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
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Cover Photo</label>
                <input
                  type="file"
                  name="cover_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleEditToggle}
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
                    <div
                      className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isFriendsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-500">{`${user?.full_name}'s friends`}</h3>
            <p>Nothing to show here....</p>
          </div>
        </div>
      )}
      {isFollowingOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-500">{`${user?.full_name}'s followings`}</h3>
            <p>Nothing to show here....</p>
          </div>
        </div>
      )}
    </div>
  );
}

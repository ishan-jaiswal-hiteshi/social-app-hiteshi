"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import { ProfileSkeleton } from "@/utils/skeletons";
import UserProfilePicture from "@/utils/user-profile-picture";
import { IoClose } from "react-icons/io5";
import FriendsListModel from "@/components/profile-page/friendlist-model";
import FollowingListModel from "@/components/profile-page/followinglist-model";

interface FilesState {
  profile_picture?: File;
  cover_picture?: File;
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FilesState>({});

  const [previews, setPreviews] = useState<{
    profile_picture?: string;
    cover_picture?: string;
  }>({});

  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    profile_picture: "",
    cover_picture: "",
    location: "",
    job_title: "",
    university: "",
    bio: "",
    friends: 0,
    followings: 0,
    posts: 0,
    other_data: {},
  });

  const [editData, setEditData] = useState(profileData);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const confirmLogout = () => {
    handleLogout();
    setShowConfirmation(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      setProfileData({
        full_name: user.full_name || "",
        username: user.username || "",
        profile_picture: user?.profile_picture || "",
        cover_picture: user?.cover_picture || "",
        location: user?.location || "",
        job_title: user?.job_title || "",
        university: user?.university || "",
        bio: user?.bio || "",
        friends: user?.friends || 0,
        followings: user?.followings || 0,
        posts: user?.posts || 0,
        other_data: user.other_data || {},
      });

      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEditData((prev) => ({ ...prev, [name]: value }));
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

      const previewURL = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: previewURL }));
    }
  };

  const uploadFile = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosInstance.post("/single-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.mediaUrl;
    } catch (error) {
      console.error("Failed to Upload", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditOpen((prevState) => {
      const newState = !prevState;
      if (newState) {
        setEditData(profileData);
        const initialPreviews: { [key: string]: string } = {};

        if (profileData?.profile_picture) {
          initialPreviews["profile_picture"] = profileData?.profile_picture;
        }
        if (profileData?.cover_picture) {
          initialPreviews["cover_picture"] = profileData?.cover_picture;
        }

        setPreviews(initialPreviews);
      }

      return newState;
    });
  };

  const handleFollowingToggle = () => {
    setIsFollowingOpen(!isFollowingOpen);
  };

  const handleFriendsToggle = () => {
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
        updateData.cover_picture = await uploadFile(files.cover_picture);
      }

      const response = await axiosInstance.post("/profile-update", updateData);
      setProfileData(response.data.profile);
      setUser(response.data.profile);
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

  if (loading) {
    return <ProfileSkeleton />;
  }

  const handleProfileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFiles((prev) => ({ ...prev, profile_picture: file }));
      setPreviews((prev) => ({
        ...prev,
        profile_picture: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Please upload a valid image.");
    }
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFiles((prev) => ({ ...prev, cover_picture: file }));
      setPreviews((prev) => ({
        ...prev,
        cover_picture: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Please upload a valid image.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col">
        <section className="relative block h-[500px]">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${profileData?.cover_picture})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>

          <div className="fixed top-5 right-5 sm:hidden">
            <button
              onClick={() => {
                setShowConfirmation(true);
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
            </button>
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
                      <div className="rounded-full  shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16">
                        {profileData?.profile_picture ? (
                          <img
                            alt="Profile"
                            src={profileData?.profile_picture}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <UserProfilePicture
                            fullName={profileData?.full_name}
                            size={150}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 flex flex-wrap justify-center sm:mt-28 lg:justify-end items-center gap-4 lg:mt-0 mt-28">
                    <button
                      className="border-2 border-red-500 active:border-red-300 active:text-red-300 uppercase text-red-400 font-bold hover:shadow-md shadow text-xs px-6 py-2 rounded outline-none focus:outline-none ease-linear"
                      type="button"
                      onClick={handleEditToggle}
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <button onClick={handleFriendsToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.friends}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Friends
                          </span>
                        </button>
                      </div>

                      <div className="mr-4 p-3 text-center">
                        <Link href="/dashboard/profile//myposts">
                          <span className="cursor-pointer text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.posts}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Posts
                          </span>
                        </Link>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <button onClick={handleFollowingToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {profileData?.followings}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Following
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <h3 className="text-2xl  leading-normal mb-2 text-gray-400">
                    @{profileData?.username}
                  </h3>
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {profileData?.full_name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    {profileData?.location}
                  </div>
                  {(profileData?.job_title || profileData?.university) && (
                    <hr className="w-72 h-0.5 mx-auto my-5 bg-red-500 border-0 rounded md:my-5" />
                  )}
                  <div className="mb-2 text-blueGray-600 mt-2">
                    {profileData?.job_title}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    {profileData?.university}
                  </div>
                </div>
                {profileData?.bio && (
                  <hr className="w-72 h-0.5 mx-auto my-5 bg-red-500 border-0 rounded md:my-5" />
                )}
                <div className="text-center mb-4">
                  <div className="pt-2 flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p
                        className="text-lg leading-relaxed text-blueGray-700"
                        dangerouslySetInnerHTML={{
                          __html: profileData?.bio?.replace(/\n/g, "<br/>"),
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showConfirmation && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black border border-gray-400 p-5 rounded-md shadow-md max-w-sm mx-auto">
            <p className="text-center text-gray-300 mb-4 pb-3">
              <strong>
                Are you sure you want to log out from Socialize@Hiteshi?
              </strong>
            </p>
            <div className="flex justify-center gap-5 ">
              <button
                className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none transition"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div
            className="relative bg-black rounded-lg text-white shadow-lg p-6 w-full max-w-md  h-[90vh] overflow-y-auto  border border-gray-500"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={handleEditToggle}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <IoClose className="h-6 w-6" />
            </button>
            <div className="border-b-[1px] border-red-600">
              <h3 className=" font-bold mb-2 text-center text-2xl ">
                Edit Profile
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="mt-2">
              <div
                className="mb-4 flex flex-col items-center"
                onDrop={handleProfileDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <label className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div
                  className="w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() =>
                    document.getElementsByName("profile_picture")[0]?.click()
                  }
                >
                  {previews.profile_picture ? (
                    <img
                      src={previews.profile_picture}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Choose Picture</span>
                  )}
                </div>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  placeholder="Jhon Doe."
                  onChange={handleInputChange}
                  className="w-full p-2  rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData?.location}
                  placeholder="Indore."
                  onChange={handleInputChange}
                  className="w-full p-2  rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={editData?.job_title}
                  placeholder="Marketing Manager."
                  onChange={handleInputChange}
                  className="w-full p-2  rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">University</label>
                <input
                  type="text"
                  name="university"
                  value={editData?.university}
                  placeholder="University of Florida."
                  onChange={handleInputChange}
                  className="w-full p-2  rounded bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={editData?.bio}
                  placeholder="Birth day on 02 Aug."
                  onChange={handleInputChange}
                  className="w-full p-2  rounded bg-gray-700 text-white"
                  rows={2}
                ></textarea>
              </div>

              <div
                className="mb-4"
                onDrop={handleCoverDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <label className="block text-sm font-medium mb-2">
                  Cover Photo
                </label>
                <div
                  className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() =>
                    document.getElementsByName("cover_picture")[0]?.click()
                  }
                >
                  {previews.cover_picture ? (
                    <img
                      src={previews.cover_picture}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <span className="text-gray-500">Choose Picture</span>
                  )}
                </div>
                <input
                  type="file"
                  name="cover_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-light active:bg-primary-dark text-white rounded"
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
        <FriendsListModel
          user={user}
          handleFriendsToggle={handleFriendsToggle}
        />
      )}
      {isFollowingOpen && (
        <FollowingListModel
          user={user}
          handleFollowingToggle={handleFollowingToggle}
        />
      )}
    </div>
  );
}

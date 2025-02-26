"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ProfileSkeleton } from "@/utils/skeletons";
import { usePathname, useRouter } from "next/navigation";
import FriendsListModel from "@/components/profile-page/friendlist-model";
import FollowingListModel from "@/components/profile-page/followinglist-model";
import Link from "next/link";
import UserProfilePicture from "@/utils/user-profile-picture";
import { useAuth } from "@/context/authContext";
import { LoadingSpinner } from "@/utils/buttonLoading";

const UserProfile = () => {
  const pathname = usePathname();
  const userId = pathname?.split("/")[3];
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [following, setFollowing] = useState("none");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [userData, setUserData] = useState({
    full_name: "",
    username: "",
    id: 0,
    email: "",
    createdAt: "",
    updatedAt: "",
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
    role: "user",
  });

  useEffect(() => {
    const numericUserId = Number(userId);
    if (user?.id === numericUserId) {
      router.push("/dashboard/profile");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (userId) {
          const response = await axiosInstance.get(`/get-user-by-id/${userId}`);
          setUserData(response.data?.user);
          setLoading(false);
          setFollowing(response.data?.user?.follow_status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleFollowingToggle = () => {
    setIsFollowingOpen(!isFollowingOpen);
  };

  const handleFriendsToggle = () => {
    setIsFriendsOpen(!isFriendsOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
  }, [isFollowingOpen, isFriendsOpen]);

  const handleRedirectToMessage = () => {
    router.push(`/dashboard/messages?userid=${userData.id}`);
  };

  const handleConnect = async () => {
    try {
      setButtonLoading(true);

      const response = await axiosInstance.post(`/add-following`, {
        followingId: userData?.id,
      });

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followings: (prevUser?.followings || 0) + 1,
        };
      });
      setUserData((prevUserData) => ({
        ...prevUserData,
        friends: (prevUserData?.friends || 0) + 1,
      }));
      setFollowing(response?.data?.follow_status);
    } catch (err) {
      console.error("Error in following user: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRemoveFollowing = async () => {
    try {
      setButtonLoading(true);
      const response = await axiosInstance.post(`/remove-following`, {
        followingId: userData?.id,
      });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          followings: (prevUser?.followings || 0) - 1,
        };
      });
      setUserData((prevUserData) => ({
        ...prevUserData,
        friends: (prevUserData?.friends || 0) - 1,
      }));
      setFollowing(response?.data?.follow_status);
    } catch (err) {
      console.error("Error in unfollowing user: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!userData) {
    return <p>Profile not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-grow flex flex-col">
        <section className="relative block h-[500px]">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${
                userData?.cover_picture ||
                "https://hiteshi.com/_next/static/media/logo.9b8ca92c.png"
              })`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <span className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>
        </section>

        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-4/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <div className="rounded-full shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16">
                        {userData?.profile_picture ? (
                          <img
                            alt="Profile"
                            src={userData?.profile_picture}
                            className="object-cover w-full h-full"
                            onDragStart={(e) => e.preventDefault()}
                          />
                        ) : (
                          <UserProfilePicture
                            fullName={userData?.full_name}
                            size={150}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-2 lg:order-3 flex flex-wrap justify-center sm:mt-28 lg:justify-end items-center gap-4 lg:mt-0 mt-28">
                    {following === "followed" ? (
                      <button
                        onClick={handleRemoveFollowing}
                        className="border-gray-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      >
                        {buttonLoading ? <LoadingSpinner /> : "Following"}
                      </button>
                    ) : following === "requested" ? (
                      <button
                        onClick={handleRemoveFollowing}
                        className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      >
                        {buttonLoading ? <LoadingSpinner /> : "Requested"}
                      </button>
                    ) : following === "follow_back" ? (
                      <button
                        onClick={handleConnect}
                        className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      >
                        {buttonLoading ? <LoadingSpinner /> : "Follow Back"}
                      </button>
                    ) : (
                      <button
                        onClick={handleConnect}
                        className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      >
                        {buttonLoading ? <LoadingSpinner /> : "Follow"}
                      </button>
                    )}

                    {following === "followed" && (
                      <button
                        className="bg-red-500 border-red-500 border-2 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs md:w-[100px] w-[80px] py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                        onClick={handleRedirectToMessage}
                      >
                        Message
                      </button>
                    )}
                  </div>

                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <button onClick={handleFriendsToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {userData?.friends || 0}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Friends
                          </span>
                        </button>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <Link href={`./posts`}>
                          <span className="cursor-pointer text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {userData?.posts || 0}
                          </span>
                          <span className="text-sm text-blueGray-400">
                            Posts
                          </span>
                        </Link>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <button onClick={handleFollowingToggle}>
                          <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                            {userData?.followings || 0}
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
                    @{userData?.username}
                  </h3>
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {userData?.full_name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    {userData?.location}
                  </div>
                  {(userData?.job_title || userData?.university) && (
                    <hr className="w-72 h-0.5 mx-auto my-5 bg-red-500 border-0 rounded md:my-5" />
                  )}
                  <div className="mb-2 text-blueGray-600 mt-2">
                    {userData?.job_title}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    {userData?.university}
                  </div>
                </div>
                {userData?.bio && (
                  <hr className="w-72 h-0.5 mx-auto my-5 bg-red-500 border-0 rounded md:my-5" />
                )}
                <div className="text-center mb-4">
                  <div className="pt-2 flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p
                        className="text-lg leading-relaxed text-blueGray-700"
                        dangerouslySetInnerHTML={{
                          __html: userData?.bio?.replace(/\n/g, "<br/>"),
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isFriendsOpen && (
          <FriendsListModel
            user={userData}
            handleFriendsToggle={handleFriendsToggle}
          />
        )}
        {isFollowingOpen && (
          <FollowingListModel
            user={userData}
            handleFollowingToggle={handleFollowingToggle}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;

"use client";

import { useEffect } from "react";
import Auth from "../components/Auth/authLogic";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/dashboard/home");
    }
  }, [router]);

  return (
    <div
      className="min-h-screen bg-black text-white flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/670353238/video/4k-abstract-loop-futuristic-technology-background-with-lines-and-dots.jpg?s=640x640&k=20&c=kmxLhX7IZ5aa0KyphoUnEvFuawL-Un7G3-hfeokZFZo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="w-full flex justify-between items-center p-4 fixed top-0 z-10">
        <div className="lg:mx-10">
          <h1 className="font-bold text-2xl">Socialize@Hiteshi</h1>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 lg:px-8 pt-16">
        <div className="hidden lg:flex relative flex-shrink-0 w-96">
          <div className="relative z-10 border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-lg transform translate-x-[100px]">
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
              <div className="h-full w-full">
                <img
                  src="./profile.png"
                  className="w-[272px] h-[572px] object-cover"
                  alt="Mobile Slide 1"
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>

          <div className="absolute top-[-20px] left-4 border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-lg opacity-75">
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
              <div className="h-full w-full">
                <img
                  src="./home1.png"
                  className="w-[272px] h-[572px] object-cover"
                  alt="Mobile Slide 2"
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block h-[600px] w-[2px] bg-gray-600 mx-8"></div>

        <div className=" flex items-center justify-center back bg-white opacity-85 rounded-lg">
          <div className="w-fit max-w-md text-black p-6 rounded-lg shadow-lg">
            <Auth />
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-4 text-center text-gray-500">
        <p>&copy; 2025 Socialize@Hiteshi. All rights reserved.</p>
      </footer>
    </div>
  );
}

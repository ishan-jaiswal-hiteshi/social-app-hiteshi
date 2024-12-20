import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen">
        <div
          className="flex"
          style={{
            backgroundImage:
              "url('https://media.istockphoto.com/id/670353238/video/4k-abstract-loop-futuristic-technology-background-with-lines-and-dots.jpg?s=640x640&k=20&c=kmxLhX7IZ5aa0KyphoUnEvFuawL-Un7G3-hfeokZFZo=')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <aside className="hidden md:flex bg-[#00070C] text-white p-4 w-52 fixed left-0 top-0 bottom-0">
            <div className="flex flex-col h-full justify-between items-center">
              <div>
                <p className="text-lg font-bold">Social@Hiteshi</p>
              </div>

              <nav className="flex-grow flex flex-col justify-center">
                <ul className="space-y-6">
                  <Link
                    href="/dashboard/home"
                    className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#fff"
                    >
                      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                    </svg>
                    <p>Home</p>
                  </Link>
                  <Link
                    href="/dashboard/search"
                    className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#fff"
                    >
                      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                    <p>Search</p>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
                  >
                    <img
                      src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      alt="profile"
                      className="w-6 h-6 rounded-full"
                    />
                    <p>Profile</p>
                  </Link>
                </ul>
              </nav>

              <div>
                <Link
                  href="/dashboard/profile"
                  className="hover:text-gray-300 cursor-pointer flex gap-2 items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                  <p>Log out</p>
                </Link>
              </div>
            </div>
          </aside>

          <main className="flex-1 overflow-auto ">{children}</main>

          <footer className="md:hidden bg-[#00070C] text-white py-3 text-center fixed bottom-0 left-0 right-0 ">
            <div className="flex justify-around">
              <Link
                href="/dashboard/home"
                className="hover:text-gray-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#fff"
                >
                  <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                </svg>
              </Link>
              <Link
                href="/dashboard/search"
                className="hover:text-gray-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#fff"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </Link>
              <Link
                href="/dashboard/profile"
                className="hover:text-gray-300 cursor-pointer"
              >
                <img
                  src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/670353238/video/4k-abstract-loop-futuristic-technology-background-with-lines-and-dots.jpg?s=640x640&k=20&c=kmxLhX7IZ5aa0KyphoUnEvFuawL-Un7G3-hfeokZFZo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="w-full flex justify-between items-center p-4 fixed top-0 z-10">
        <div className="lg:mx-10 ">
          <h1 className="font-bold text-2xl">Socialize@Hiteshi</h1>
        </div>

        <Link
          href="/auth"
          className="text-white px-4 py-2 rounded-md hover:bg-red-400 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </Link>
      </nav>

      <main className="mx-auto file:flex-1 flex flex-col lg:flex-row items-center justify-center px-4 text-center mt-16 animate__animated animate__fadeIn animate__delay-1s gap-2">
        <div>
          <h2 className="text-4xl font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Welcome to <span className="text-[red]">Socialize @ Hiteshi</span>
          </h2>
          <p className="text-2xl max-w-2xl mb-8">
            A vibrant social media app designed for Users to connect, share, and
            explore. Join the ultimate hub where gaming meets community.
          </p>

          <Link
            href="/auth"
            className="bg-red-600 text-[white] px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-400 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-8">
          <Image
            src={"https://images.ui8.net/uploads/group-811_1617800621177.png"}
            alt="Social Connect"
            width={700}
            height={500}
            className="rounded-xl object-cover max-w-full h-auto"
          />
        </div>
      </main>

      <footer className="fixed bottom-0  w-full p-4 text-center text-gray-500">
        <p>&copy; 2024 Socialize@Hiteshi. All rights reserved.</p>
      </footer>
    </div>
  );
}

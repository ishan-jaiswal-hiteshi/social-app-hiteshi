import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socialize @ Hiteshi",
  description: "Socialize at Hiteshi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-spaceGrotesk`}
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/670353238/video/4k-abstract-loop-futuristic-technology-background-with-lines-and-dots.jpg?s=640x640&k=20&c=kmxLhX7IZ5aa0KyphoUnEvFuawL-Un7G3-hfeokZFZo=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {children}
      </body>
    </html>
  );
}

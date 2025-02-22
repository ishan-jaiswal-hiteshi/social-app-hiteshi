import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/notificationContext";

export const metadata: Metadata = {
  title: "Socialize@Hiteshi",
  description: "Socialize at Hiteshi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <body className={`antialiased font-spaceGrotesk background`}>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

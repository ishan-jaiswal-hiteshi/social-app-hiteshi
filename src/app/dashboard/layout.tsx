"use client";

import BottombarLayout from "@/components/dashboard/layout/bottombar";
import SidebarLayout from "@/components/dashboard/layout/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <SidebarLayout />
      <main className="flex-auto overflow-auto p-4">
        {children}
        <ToastContainer />
      </main>
      <BottombarLayout />
    </div>
  );
}

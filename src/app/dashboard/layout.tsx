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
    <div className="flex">
      <SidebarLayout />
      <main className="flex-1 overflow-auto ">
        {children}
        <ToastContainer />
      </main>
      <BottombarLayout />
    </div>
  );
}

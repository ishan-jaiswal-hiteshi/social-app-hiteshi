import BottombarLayout from "@/components/dashboard/layout/bottombar";
import SidebarLayout from "@/components/dashboard/layout/sidebar";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarLayout />
      <main className="flex-1 overflow-auto px-4 ml-0 md:ml-52">
        {" "}
        {children}
        <ToastContainer />
      </main>
      <BottombarLayout />
    </div>
  );
}

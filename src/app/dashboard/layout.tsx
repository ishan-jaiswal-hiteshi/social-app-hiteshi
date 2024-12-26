import BottombarLayout from "@/components/dashboard/layout/bottombar";
import SidebarLayout from "@/components/dashboard/layout/sidebar";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen">
        <div className="flex">
          <SidebarLayout />
          <main className="flex-1 overflow-auto ">
            {children}
            <ToastContainer />
          </main>
          <BottombarLayout />
        </div>
      </body>
    </html>
  );
}

import BottombarLayout from "@/components/dashboard/layout/bottombar";
import SidebarLayout from "@/components/dashboard/layout/sidebar";

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
          <main className="flex-1 overflow-auto ">{children}</main>
          <BottombarLayout />
        </div>
      </body>
    </html>
  );
}

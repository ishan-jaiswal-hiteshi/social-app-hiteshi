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
          <SidebarLayout />
          <main className="flex-1 overflow-auto ">{children}</main>
          <BottombarLayout />
        </div>
      </body>
    </html>
  );
}

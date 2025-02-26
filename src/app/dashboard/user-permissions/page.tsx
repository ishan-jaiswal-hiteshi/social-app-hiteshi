"use client";
import UserPermissions from "@/components/permissions/user-permissions";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && user?.role !== "admin") {
      router.push("/dashboard/home");
    }
  }, [user]);

  if (!user) return null;
  return (
    <div className="min-h-screen text-white ">
      <UserPermissions />
    </div>
  );
};

export default Page;

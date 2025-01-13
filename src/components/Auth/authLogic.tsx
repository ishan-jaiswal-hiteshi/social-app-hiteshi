"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { isValidateEmail, isValidOTP } from "@/utils/input_Validations";
import AuthForm from "@/components/Auth/loginForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Auth() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    userName: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.fullName) {
      const cleanedFullName = formData.fullName
        .replace(/\s+/g, "")
        .toLowerCase();
      const userName = cleanedFullName.substring(0, 7);
      setFormData((prev) => ({ ...prev, userName }));
    }
  }, [formData.fullName]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidateEmail(formData.email)) {
      setError("Please use your Hiteshi's mail");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/send-otp", {
        email: formData.email,
      });

      if (response.status === 200) {
        const { isNewUser } = response.data;
        setIsNewUser(isNewUser);
        setEmailSubmitted(true);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNewUser) {
      if (!formData.fullName.trim()) {
        setError("Full Name is required for new users.");
        return;
      }
      if (!formData.userName.trim()) {
        setError("Username is required for new users.");
        return;
      }
      if (!formData.otp.trim()) {
        setError("OTP is required.");
        return;
      }
    } else if (!isValidOTP(formData.otp)) {
      setError("Please enter a valid OTP.");
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = "/verify-otp";
    const payload = isNewUser
      ? {
          email: formData.email,
          otp: formData.otp,
          username: formData.userName,
          full_name: formData.fullName,
        }
      : { email: formData.email, otp: formData.otp };

    try {
      const response = await axiosInstance.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const result = response.data;
        localStorage.setItem("accessToken", result.token);
        await loginUser();

        router.push("/dashboard/home");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <AuthForm
      formData={formData}
      loading={loading}
      error={error}
      isNewUser={isNewUser}
      emailSubmitted={emailSubmitted}
      handleInputChange={handleInputChange}
      handleEmailSubmit={handleEmailSubmit}
      handleSubmit={handleSubmit}
    />
  );
}

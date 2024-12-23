"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import {
  isValidFullName,
  isValidUserName,
  isValidateEmail,
  isValidOTP,
} from "@/utils/input_Validations";
export default function Auth() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    redirect("/dashboard/home");
  }
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    userName: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(true);
  const [emailSubmitted, setEmailSubmitted] = useState(true);

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
      const response = await axios.post("/api/check-user", {
        email: formData.email,
      });

      if (response.status === 200) {
        const { isNewUser } = response.data;
        setIsNewUser(isNewUser);
        setEmailSubmitted(true);
      } else {
        throw new Error("Failed to check, Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidFullName(formData.fullName)) {
      setError("Please enter valid Full Name");
      return;
    }
    if (!isValidUserName(formData.userName)) {
      setError("Please enter valid Username");
      return;
    }
    if (!isValidOTP(formData.otp)) {
      setError("Please enter valid OTP");
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = isNewUser ? "/api/signup" : "/api/verify-otp";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to complete, Please try again."
        );
      }

      const result = await response.data;
      if (!isNewUser) {
        localStorage.setItem("accessToken", result.token);
      }

      redirect("/dashboard/home");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An Unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 mx-auto">
      <form
        onSubmit={emailSubmitted ? handleSubmit : handleEmailSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-center mx-auto mb-6">
          <img
            className="w-auto h-8"
            src="https://hiteshi.com/_next/static/media/logo.9b8ca92c.png"
            alt="Logo"
          />
        </div>

        {!emailSubmitted && (
          <div className="relative flex items-center mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
        )}

        {emailSubmitted && isNewUser && (
          <>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                name="fullName"
                maxLength={16}
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                name="userName"
                maxLength={16}
                value={formData.userName}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Username"
                required
              />
            </div>
          </>
        )}

        {emailSubmitted && (
          <div className="relative flex items-center mb-4">
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 6) {
                  handleInputChange(e);
                }
              }}
              className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Enter OTP"
              required
            />
          </div>
        )}

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-400 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Processing..."
            : !emailSubmitted
            ? "Next"
            : isNewUser
            ? "Create my Acount"
            : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

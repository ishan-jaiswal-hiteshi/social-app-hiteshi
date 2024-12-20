// Setting this as a client component
"use client";

import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    userName: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Handling inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handling email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      //Checking for Existing user
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

  // Handling full form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        localStorage.setItem("authToken", result.token);
      }

      //console.log("Process successful:", result);
      // Redirect or further actions after success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An Unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen px-6 mx-auto">
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
                value={formData.userName}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Username"
                required
              />
            </div>
            <div className="relative flex items-center mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {emailSubmitted && !isNewUser && (
          <div className="relative flex items-center mb-4">
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
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
            ? "Sign Up"
            : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

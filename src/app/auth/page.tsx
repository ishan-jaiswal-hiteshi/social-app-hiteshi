// Setting this as a client component
"use client";

import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Handeling inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Handeling submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    //Defining APIs endpoint
    const endpoint = isSignUp ? "/api/signup" : "/api/signin";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        const errorResponse = await response.data;
        throw new Error(errorResponse.message || "Failed to authenticate.");
      }

      const result = await response.data;
      const { token } = result;

      // Saving token to local storage
      localStorage.setItem("authToken", token);

      // Redirect or perform further actions after authentication
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen px-6 mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-center mx-auto mb-6">
          <img
            className="w-auto h-8"
            src="https://hiteshi.com/_next/static/media/logo.9b8ca92c.png"
            alt="Logo"
          />
        </div>

        <div className="flex items-center justify-center mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 pb-2 text-center font-medium ${
              !isSignUp
                ? "text-black border-b-2 border-red-600"
                : "text-gray-400"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 pb-2 text-center font-medium ${
              isSignUp
                ? "text-black border-b-2 border-red-600"
                : "text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isSignUp && (
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
        )}

        {isSignUp && (
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
        )}

        <div className="relative flex items-center mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:outline-none"
            placeholder="Email address"
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

        {/* Showcasing error */}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-400 transition duration-300 ease-in-out transform hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {/* Daynamic Sign/Up button */}
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-red-500 hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

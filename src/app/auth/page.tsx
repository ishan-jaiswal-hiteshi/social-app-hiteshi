"use client";
import { useState } from "react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="bg-black">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
                  ? "text-black border-b-2 border-blue-500"
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
                  ? "text-black border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {isSignUp ? (
            <>
              <div className="relative flex items-center mb-4">
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:outline-none"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative flex items-center mb-4">
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:outline-none"
                  placeholder="Email address"
                />
              </div>

              <div className="relative flex items-center mb-4">
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:outline-none"
                  placeholder="Password"
                />
              </div>
            </>
          ) : (
            <>
              <div className="relative flex items-center mb-4">
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:outline-none"
                  placeholder="Email address"
                />
              </div>

              <div className="relative flex items-center mb-4">
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  className="block w-full py-3 pl-10 text-gray-700 border rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:outline-none"
                  placeholder="Password"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-gray-900 px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-400 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-500 hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

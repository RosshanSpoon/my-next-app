"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use Link for navigation between pages

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // To control the modal visibility
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (based on localStorage)
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      // If not logged in, redirect to login page
      router.push("/login");
    } else {
      setIsAuthenticated(true); // User is logged in
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Don't render the homepage content if not logged in
  }

  const handleProfileIconClick = () => {
    setShowProfileModal(true); // Show the modal when the icon is clicked
  };

  const closeProfileModal = () => {
    setShowProfileModal(false); // Close the modal
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-xl font-bold">Fork</div>
          <div className="flex items-center space-x-6">
            <Link href="/home" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
            {/* Profile Icon */}
            <div className="relative">
              <button
                className="text-white hover:text-gray-300"
                onClick={handleProfileIconClick} // Open the profile modal
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                >
                  <path
                    fill="currentColor"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-8">
        <h1 className="text-3xl font-bold">Welcome to the Homepage!</h1>
        
        {/* Section for Learn and Detect */}
        <div className="flex space-x-8">
          {/* Learn Section */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg w-72 text-center cursor-pointer hover:bg-blue-600">
            <h2 className="text-2xl font-bold">Learn</h2>
            <p className="mt-4">Explore how to protect yourself from online threats.</p>
            <Link
              href="/learn"
              className="mt-4 inline-block text-blue-100 hover:text-blue-200"
            >
              Go to Learn Section
            </Link>
          </div>

          {/* Detect Section */}
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg w-72 text-center cursor-pointer hover:bg-green-600">
            <h2 className="text-2xl font-bold">Detect</h2>
            <p className="mt-4">Learn how to identify phishing and AI-generated content.</p>
            <Link
              href="/detect"
              className="mt-4 inline-block text-green-100 hover:text-green-200"
            >
              Go to Detect Section
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeProfileModal} // Close the modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md w-80"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Profile</h2>
            <p className="text-gray-700">Welcome to your profile page!</p>
            <p className="text-gray-600 mt-4">Here you can view and update your profile.</p>
            <div className="mt-6 text-center">
              <button
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={closeProfileModal} // Close the modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

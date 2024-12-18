"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [isChatbotLoaded, setIsChatbotLoaded] = useState(false); // Track if chatbot script has loaded
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }

    // Apply dark mode classes to the HTML element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load Dialogflow chatbot script only if not already present
    if (typeof window !== "undefined" && !isChatbotLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      script.onload = () => setIsChatbotLoaded(true); // Mark chatbot as loaded
      document.body.appendChild(script);

      // Cleanup: Remove the script when component is unmounted
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [router, isDarkMode, isChatbotLoaded]); // Ensure it runs only on the client

  const handleProfileLinkClick = () => setShowProfileModal(true);
  const closeProfileModal = () => setShowProfileModal(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Handle log out
  const handleLogOut = () => {
    localStorage.removeItem("isLoggedIn");
    setShowProfileModal(false);
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } min-h-screen`}
    >
      {/* Navigation Bar */}
      <nav className="bg-gray-800 dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-xl font-bold">Fork</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            {/* Profile Link */}
            <button
              onClick={handleProfileLinkClick}
              className="text-white hover:text-gray-300"
            >
              Profile
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-gray-300"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col items-start bg-gray-700 text-white space-y-4 px-4 py-2">
            <Link
              href="/"
              className="text-white hover:text-gray-300"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            {/* Profile Link in Mobile Menu */}
            <button
              onClick={() => {
                toggleMobileMenu();
                handleProfileLinkClick();
              }}
              className="text-white hover:text-gray-300 flex items-center"
            >
              Profile
            </button>
            {/* Dark Mode Toggle in Mobile */}
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-gray-300 text-left"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-10 px-4 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          Welcome to the Homepage!
        </h1>

        {/* Learn and Detect Sections */}
        <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
          <Link
            href="/learn"
            className="bg-blue-900 text-white p-10 rounded-lg shadow-lg w-full md:w-96 text-center cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold">Learn</h2>
            <p className="mt-4">
              Stay aware of online threats like phishing scams and deepfakes to
              protect yourself and others.
            </p>
          </Link>

          <Link
            href="/detect"
            className="bg-green-500 text-white p-10 rounded-lg shadow-lg w-full md:w-96 text-center cursor-pointer hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold">Detect</h2>
            <p className="mt-4">
              Spot AI-generated text and images to ensure you&apos;re
              engaging with authentic content.
            </p>
          </Link>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeProfileModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              User Profile
            </h2>
            <p className="text-gray-700">Welcome to your profile page!</p>
            <p className="text-gray-600 mt-4">
              Here you can view and update your profile.
            </p>
            <div className="mt-6 text-center">
              <button
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={closeProfileModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Integration (Only load on client side) */}
      {isChatbotLoaded && (
        <div className="mt-10 w-full flex justify-center">
          <df-messenger
            intent="WELCOME"
            chat-title="Fork"
            agent-id="968b0cec-78e6-45a9-86fc-b36ca1d57549"
            language-code="en"
            conversation-opening="false"
            hide="true"
          ></df-messenger>
        </div>
      )}
    </div>
  );
}

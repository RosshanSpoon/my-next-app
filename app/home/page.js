"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import Link from "next/link"; // Use Link for navigation between pages

export default function Learn() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    return null; // Don't render the learn page content if not logged in
  }

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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-8">
        <h1 className="text-3xl font-bold">Learn How to Protect Yourself!</h1>
        
        {/* YouTube Video Embedding */}
        <div className="mt-10 w-full max-w-4xl">
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your desired YouTube URL
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

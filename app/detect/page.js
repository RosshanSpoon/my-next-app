"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation

export default function Detect() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(""); // Clear any previous errors
    }
  };

  // Handle file selection via file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(""); // Clear any previous errors
    }
  };

  // Handle form submission (if needed for further processing)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a file to detect.");
      return;
    }

    // Proceed with file processing (for demo purposes, we just log the file)
    console.log("File uploaded:", file);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-xl font-bold">Fork</div>
          <div className="flex items-center space-x-6">
            <a href="/home" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="/about" className="text-white hover:text-gray-300">
              About
            </a>
            <a href="/contact" className="text-white hover:text-gray-300">
              Contact
            </a>
            {/* Profile Icon */}
            <div className="relative">
              <button
                className="text-white hover:text-gray-300"
                onClick={() => router.push("/profile")}
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Detect Content</h2>
          <p className="mt-4 text-center text-gray-600">
            Upload a file to detect AI-generated content or phishing.
          </p>

          {/* Error message */}
          {error && <div className="mt-4 text-red-600 text-sm text-center">{error}</div>}

          <div
            className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} // Allow the drop event
            style={{ height: "200px" }}
          >
            <div className="text-center">
              <p className="text-lg text-gray-600">Drag and drop a file here</p>
              <p className="text-sm text-gray-400">OR</p>
              <label
                htmlFor="file-upload"
                className="mt-2 inline-block text-blue-500 hover:underline cursor-pointer"
              >
                Browse Files
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {file && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">File: {file.name}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Detect Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

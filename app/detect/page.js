"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import axios from "axios";
import Link from "next/link"; // Use Link for navigation between pages

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(""); // For image preview
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // To show loading state
  const [result, setResult] = useState(null); // To store API response
  const [textInput, setTextInput] = useState(""); // Text input state
  const [textResult, setTextResult] = useState(null);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile)); // Set the preview URL
      setError(""); // Clear any previous errors
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Handle file selection via file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Set the preview URL
      setError(""); // Clear any previous errors
    }
  };

  // Handle form submission (if needed for further processing)
  const handleSubmit = async (file) => {
    if (!file) {
      setError("Please upload a file to detect.");
      return;
    }

    console.log("File uploaded:", file); // Log uploaded file

    setIsProcessing(true);
    setError(""); // Clear previous errors
    setResult(null); // Reset result

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Sending request to Hugging Face API...");

      const fileBytes = await file.arrayBuffer();
      const base64EncodedImage = btoa(
        new Uint8Array(fileBytes).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector/", // Replace with the actual model URL
        { inputs: base64EncodedImage }, // Model expects image in this format
        {
          headers: {
            "Authorization": `Bearer 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`, // Replace with your Hugging Face API key
            "Content-Type": "application/json",
          },
        }
      );

      // Log the full response to check its structure
      console.log("Response from Hugging Face:", response.data);

      setResult(response.data); // Store the result in state
    } catch (err) {
      console.error("Error in request:", err);
      setError("Error detecting AI content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitText = async () => {
    if (!textInput.trim()) {
      setError("Please enter some text to detect.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTextResult(null);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/shahxeebhassan/bert_base_ai_content_detector",
        { inputs: textInput },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      setTextResult(response.data);
    } catch (err) {
      console.error("Error detecting text content:", err);
      setError("Error detecting text content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
 
  // Open the modal
  const openModal = () => setIsModalOpen(true);
 
  // Close the modal
  const closeModal = () => setIsModalOpen(false);
 
  // Handle log out
  const handleLogOut = () => {
    console.log("User logged out");
    setIsModalOpen(false);
    router.push("/login"); // Redirect to login page
  };

  // Automatically call handleSubmit whenever the file state changes (user uploads a file)
  useEffect(() => {
    if (file) {
      handleSubmit(file);
    }
  }, [file]);

  const renderDetectionResult = () => {
    if (textResult && textResult[0]) {
      const label1 = textResult[0].find((item) => item.label === "LABEL_1");
      if (label1) {
        const aiPercentage = label1.score * 100;
        const resultText = aiPercentage > 60 ? "AI Generated" : "Human";
        return (
          <div className="mt-6 text-center text-gray-600">
            <h3 className="text-lg font-bold">Detection Results:</h3>
            <p className="text-lg font-semibold text-blue-500">{resultText}</p>
            <p className="text-sm text-gray-600">AI Percentage: {aiPercentage.toFixed(2)}%</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen`}>
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
          <button onClick={openModal} className="text-white hover:text-gray-300">
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
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
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
          <Link href="/" className="text-white hover:text-gray-300" onClick={toggleMobileMenu}>
            Home
          </Link>
          {/* Profile Link in Mobile Menu */}
          <button onClick={openModal} className="text-white hover:text-gray-300 text-left">
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

    {/* Profile Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
          <h2 className="text-2xl font-bold text-center">Profile</h2>
          <div className="mt-4">
            <p className="text-gray-800 dark:text-gray-300">User information goes here.</p>
            <div className="mt-6 text-center">
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Log Out
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Detect Content</h2>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
            Upload a file or enter text to detect AI-generated content or phishing.
          </p>

          {/* Error message */}
          {error && <div className="mt-4 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

          {/* File Upload Section */}
          <div
            className="mt-8 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex justify-center items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ height: "200px" }}
          >
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">Drag and drop a file here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">OR</p>
              <label
                htmlFor="file-upload"
                className="mt-2 inline-block text-blue-500 dark:text-blue-400 hover:underline cursor-pointer"
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
              {/* Image Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Uploaded Preview"
                  className="mt-4 mx-auto max-h-48 rounded shadow"
                />
              )}
            </div>
          )}

          {/* Result or processing state */}
          {isProcessing && (
            <div className="mt-6 text-center text-gray-600">Processing...</div>
          )}

          {result && (
            <div className="mt-6 text-center text-gray-600">
              <h3 className="text-lg font-bold">Detection Results:</h3>

              {/* Find the AI percentage (assuming 'artificial' is the label for AI content) */}
              {result.map((item, index) => {
                if (item.label === "artificial") {
                  const aiPercentage = item.score * 100;

                  // Determine AI or Human based on percentage
                  const label = aiPercentage > 60 ? "AI Generated" : "Human";

                  return (
                    <div key={index} className="mt-4">
                      <p className="text-lg font-semibold text-blue-500">{label}</p>
                      <p className="text-sm text-gray-600">
                        AI Percentage: {aiPercentage.toFixed(2)}%
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Text Input Section */}
          <div className="mt-8">
            <textarea
              className="w-full p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              rows="4"
              placeholder="Enter text to detect AI content..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              onClick={handleSubmitText}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Detect Text"}
            </button>
          </div>

          {/* Display Results */}
          {renderDetectionResult()}
        </div>
      </div>
    </div>
  );
}

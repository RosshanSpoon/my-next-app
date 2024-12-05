"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import axios from "axios";
import Link from "next/link"; // Use Link for navigation between pages

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(""); // For image preview
  const [error, setError] = useState("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // To show loading state
  const [result, setResult] = useState(null); // To store API response

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
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-xl font-bold">Fork</div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">
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
              <ul className="mt-4">
                {result.map((item, index) => (
                  <li key={index} className="mt-2">
                    <span className="font-semibold">{item.label}</span>:{" "}
                    <span>{(item.score * 100).toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
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

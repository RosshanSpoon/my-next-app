"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export default function Learn() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for Profile
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track the current video in the carousel
  const [modelEmail, setModelEmail] = useState(""); // Store phishing email content
  const [aiResponse, setAiResponse] = useState(""); // Store AI response
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false); // Modal for AI response
  const [isEmailReloading, setIsEmailReloading] = useState(false); // Reload email content
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();
  // Replace these with your actual values
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // API key stored in .env.local
  const PHISHING_PROMPT = process.env.NEXT_PUBLIC_PHISHING_PROMPT; // Prompt stored in .env.local

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
  }, [router, isDarkMode]); // Include isDarkMode in the dependency array

  // Gemini
  useEffect(() => {
    // Function to call the Gemini API
    async function fetchPhishingEmail() {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Model configuration
        const generationConfig = {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        };

        // Safety settings
        const safetySettings = [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ];

        // Set up chat
        const chat = model.startChat({
          generationConfig,
          safetySettings,
        });

        // Send the phishing prompt
        const result = await chat.sendMessage(PHISHING_PROMPT);
        const response = result.response;
        setModelEmail(response.text()); // Update state with the result
      } catch (error) {
        console.error("Error fetching phishing email:", error);
        setModelEmail("Failed to load email content. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once complete
      }
    }

    fetchPhishingEmail(); // Fetch email on load
  }, [API_KEY, PHISHING_PROMPT, isEmailReloading]);

  async function handleButtonClick(prompt) {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const chat = model.startChat({
        generationConfig,
      });

      const result = await chat.sendMessage(prompt);
      setAiResponse(result.response.text());
      setIsResponseModalOpen(true); // Open response modal
    } catch (error) {
      console.error("Error prompting AI:", error);
      setAiResponse("Failed to generate response. Please try again later.");
      setIsResponseModalOpen(true); // Open response modal for error
    } finally {
      setLoading(false);
    }
  }

  // Close the AI response modal and reload the email modal
  function handleModalClose() {
    setIsResponseModalOpen(false);
    setIsEmailReloading((prev) => !prev); // Toggle state to reload email modal
  }

  const formatResponseText = (text) => {
    // Replace **bold** text with <strong> tags and remove unnecessary * symbols
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Replace **word** with <strong>word</strong>
      .replace(/\*{2,}/g, ""); // Remove any remaining * symbols

    // Add <p> tags for line breaks and paragraphs
    const paragraphs = formattedText
      .split("\n")
      .map((para, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: para }}></p>
      ));

    return paragraphs;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Open the profile modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  // Handle log out
  const handleLogOut = () => {
    console.log("User logged out");
    setIsModalOpen(false);
    router.push("/login"); // Redirect to login page
  };

  // Questions and correct answers for the quiz
  const questions = [
    // Existing phishing questions
    {
      id: 1,
      question: "What is phishing?",
      options: [
        "A technique to send spam emails",
        "A method to steal sensitive information through deceptive means",
        "A type of antivirus software",
        "A way to hack websites",
      ],
      correctAnswer: 1,
    },
    // Add 3 new phishing questions here:
    {
      id: 6,
      question:
        "Which of the following is a sign that an email might be a phishing attempt?",
      options: [
        "The sender's email address is from a known organization",
        "The email contains suspicious links or attachments",
        "The email is addressed to you personally",
        "The email has your name and other correct details",
      ],
      correctAnswer: 1,
    },
    {
      id: 7,
      question:
        "What should you do if you receive a suspicious email asking for personal information?",
      options: [
        "Ignore it and do nothing",
        "Click on the links to verify the information",
        "Report it to your IT department or email provider",
        "Reply with the requested information",
      ],
      correctAnswer: 2,
    },
    {
      id: 8,
      question: "What is spear phishing?",
      options: [
        "A type of phishing that targets a large number of people at once",
        "A phishing attempt that uses publicly available information to target a specific individual",
        "Phishing that targets organizations through their websites",
        "A method to deliver malicious software to a wide audience",
      ],
      correctAnswer: 1,
    },
    // Existing deepfake questions
    {
      id: 9,
      question: "What is a deepfake?",
      options: [
        "A technique used to make videos and audio more realistic",
        "A type of machine learning algorithm used to create fake media",
        "A new type of software that records audio automatically",
        "A form of encryption for videos and audio",
      ],
      correctAnswer: 1,
    },
    // Add 7 new deepfake questions here:
    {
      id: 10,
      question:
        "Which of the following is a potential use of deepfake technology?",
      options: [
        "Creating false news reports",
        "Enhancing the quality of legitimate videos",
        "Encrypting video content",
        "Improving video compression algorithms",
      ],
      correctAnswer: 0,
    },
    {
      id: 11,
      question: "How can deepfake videos be harmful?",
      options: [
        "They can manipulate public opinion and spread misinformation",
        "They make videos more entertaining",
        "They help improve video editing software",
        "They allow celebrities to create new content",
      ],
      correctAnswer: 0,
    },
    {
      id: 12,
      question: "Which technology is used to create deepfakes?",
      options: [
        "Face recognition software",
        "Generative Adversarial Networks (GANs)",
        "Holographic imaging",
        "Quantum computing",
      ],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "What is one way to detect deepfake videos?",
      options: [
        "Checking for inconsistencies in facial expressions or lighting",
        "Listening for unusual background noise",
        "Watching videos in high resolution only",
        "Making sure the video is from a verified source",
      ],
      correctAnswer: 0,
    },
    {
      id: 14,
      question: "Why are deepfakes particularly dangerous in politics?",
      options: [
        "They can create fake speeches or actions from politicians, influencing elections",
        "They make political debates more entertaining",
        "They provide truthful information",
        "They allow politicians to communicate directly with voters",
      ],
      correctAnswer: 0,
    },
    {
      id: 15,
      question:
        "What can individuals do to protect themselves from deepfake content?",
      options: [
        "Verify the source of videos and check for inconsistencies",
        "Always trust videos from popular social media platforms",
        "Only watch videos on trusted websites",
        "Avoid watching videos altogether",
      ],
      correctAnswer: 0,
    },
  ];

  const handleOptionClick = (optionIndex) => {
    if (selectedOption === null) {
      // Only allow selection if no option has been chosen
      setSelectedOption(optionIndex);

      // Store whether the answer is correct or not
      const isCorrect =
        optionIndex === questions[currentQuestionIndex].correctAnswer;
      setQuizAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex].id]: isCorrect,
      }));
    }
  };

  const handleNextClick = () => {
    // Check if there are more questions
    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for the next question
      setShowResult(false); // Hide the result until the user selects an answer
    } else {
      // Show final results after the last question
      setShowResult(true);
    }
  };

  // Function to reset the quiz
  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0); // Go back to the first question
    setSelectedOption(null); // Reset the selected option
    setQuizAnswers({}); // Reset the quiz answers
    setShowResult(false); // Hide the result
  };

  // Video URLs for the carousel
  const videos = [
    "https://www.youtube.com/embed/gSQgbCo6PAg",
    "https://www.youtube.com/embed/WFc6t-c892A",
    "https://www.youtube.com/embed/Twy6T_OHWeM",
  ];

  // Change the video in the carousel
  const goToNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
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
            <button
              onClick={openModal}
              className="text-white hover:text-gray-300"
            >
              Profile
            </button>
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
            <Link
              href="/"
              className="text-white hover:text-gray-300"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <button
              onClick={openModal}
              className="text-white hover:text-gray-300 text-left"
            >
              Profile
            </button>
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

      {/* Modal for Profile */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md w-80"
            onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicked inside
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
                className="text-gray-700 hover:text-gray-900"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {/* Video Carousel Card */}
          <div className="w-full sm:w-3/4 lg:w-2/5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
              Watch these Videos
            </h2>
            <div className="relative">
              {/* Previous Button */}
              <button
                onClick={goToPrevVideo}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full dark:bg-gray-400 dark:text-black"
              >
                &lt;
              </button>

              {/* Video Embed */}
              <div
                className="w-full max-w-[800px] mx-auto"
                style={{ height: "400px" }}
              >
                <iframe
                  src={`${videos[currentVideoIndex]}?rel=0&controls=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextVideo}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full dark:bg-gray-400 dark:text-black"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="w-full sm:w-3/4 lg:w-2/5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10 sm:mt-0">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
              Test Your Knowledge!
            </h2>

            {showResult ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Results
                </h3>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  You got {Object.values(quizAnswers).filter(Boolean).length}{" "}
                  out of {questions.length} correct!
                </p>
                <div className="mt-6">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleRetakeQuiz} // Retake the quiz
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {questions[currentQuestionIndex].question}
                  </h3>
                  <div className="space-y-3 mt-4">
                    {questions[currentQuestionIndex].options.map(
                      (option, index) => {
                        const isCorrect =
                          index ===
                          questions[currentQuestionIndex].correctAnswer;
                        const isSelected = selectedOption === index;

                        // Option style based on whether it's selected or correct
                        const optionStyle = isSelected
                          ? isCorrect
                            ? "bg-green-500 text-white" // Correct answer selected
                            : "bg-red-500 text-white" // Incorrect answer selected
                          : "bg-white dark:bg-gray-700"; // Default background for unselected options

                        return (
                          <button
                            key={index}
                            className={`w-full text-left p-3 rounded-lg border ${optionStyle} dark:border-gray-600`}
                            onClick={() => handleOptionClick(index)}
                            disabled={selectedOption !== null} // Disable options after one is selected
                          >
                            {option}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Identify Phishing Emails */}
          <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md mt-10">
            {/* Email Content Modal */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Can You Identify Phishing Emails?
              </h2>
              {loading ? <p>Loading email content...</p> : <p>{modelEmail}</p>}
            </div>

            {/* Buttons */}
            <div className="mt-6 text-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg mx-2"
                onClick={() =>
                  handleButtonClick(
                    "This is an email you generated to test if I can identify phishing emails: " +
                      modelEmail +
                      " I think this is a real email. Praise me if I'm right and tell me why I'm right. If I'm wrong, correct me and show me why I'm wrong. Highlights key stuffs like typos, wrongly wrtten emails and other important points. Highlight what makes it real or fake. Give short concise answers instead of large paragraphs."
                  )
                }
                disabled={loading}
              >
                Real Email
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mx-2"
                onClick={() =>
                  handleButtonClick(
                    "This is an email you generated to test if I can identify phishing emails: " +
                      modelEmail +
                      " I think this is a phishing email. Praise me if I'm right and tell me why I'm right. If I'm wrong, correct me and show me why I'm wrong. Highlights key stuffs like typos, wrongly wrtten emails and other important points. Highlight what makes it real or fake. Give short concise answers instead of large paragraphs."
                  )
                }
                disabled={loading}
              >
                Phishing Email
              </button>
            </div>

            {isResponseModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div
                  className="bg-white w-96 h-96 p-6 rounded-lg shadow-lg overflow-y-auto"
                  style={{ maxHeight: "90vh" }} // Ensure responsiveness
                >
                  <h2 className="text-lg font-bold mb-4 text-center">
                    AI Response
                  </h2>
                  <p>{formatResponseText(aiResponse)}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    onClick={handleModalClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

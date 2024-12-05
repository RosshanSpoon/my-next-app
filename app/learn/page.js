"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Learn() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Questions and correct answers for the quiz
  const questions = [
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
    {
      id: 2,
      question: "Which of the following is a common sign of a phishing email?",
      options: [
        "Personalized greetings and accurate details",
        "An urgent call to action, such as 'Reset your password now!'",
        "Emails from known contacts only",
        "Professional grammar and spelling",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "What is sniffing in the context of cybersecurity?",
      options: [
        "Tracking user activities on social media",
        "Intercepting and analyzing data packets on a network",
        "Sending unsolicited promotional messages",
        "Encrypting sensitive data for security",
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "How can you protect yourself from phishing attacks?",
      options: [
        "Click on every link to verify its authenticity",
        "Avoid installing antivirus software",
        "Verify the sender's email address and avoid clicking on suspicious links",
        "Use public Wi-Fi for sensitive activities",
      ],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "What should you do if you suspect you've fallen victim to phishing?",
      options: [
        "Ignore the situation and hope for the best",
        "Change your passwords immediately and report the incident",
        "Share the phishing email with friends",
        "Uninstall your antivirus software",
      ],
      correctAnswer: 1,
    },
  ];

  const handleOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);

    // Store whether the answer is correct or not
    const isCorrect = optionIndex === questions[currentQuestionIndex].correctAnswer;
    setQuizAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: isCorrect,
    }));
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset for the next question
    } else {
      setShowResult(true); // Show result after the last question
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p> {/* Placeholder while checking authentication */}
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} min-h-screen`}>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-xl font-bold">Fork</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
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
            <Link href="/" className="text-white hover:text-gray-300" onClick={toggleMobileMenu}>Home</Link>
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

      {/* Modal for Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded-lg shadow-md w-80"
            onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicked inside
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Profile</h2>
            <p className="text-gray-700">Welcome to your profile page!</p>
            <p className="text-gray-600 mt-4">Here you can view and update your profile.</p>
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
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-8">
        <h1 className="text-3xl font-bold">Learn How to Protect Yourself!</h1>

        {/* Quiz Section */}
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          {showResult ? (
            <div>
              <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
              <p className="text-center mt-4 text-gray-600">
                You scored{" "}
                {Object.values(quizAnswers).filter(Boolean).length} out of{" "}
                {questions.length}.
              </p>
              <p className="text-center text-gray-500 mt-2">
                Review the material and try again if needed!
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className="text-lg font-bold mb-6">
                {questions[currentQuestionIndex].question}
              </p>
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={`cursor-pointer p-4 border rounded-lg ${
                      selectedOption !== null
                        ? index === questions[currentQuestionIndex].correctAnswer
                          ? "bg-green-500 text-white"
                          : index === selectedOption
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {selectedOption !== null && (
                <button
                  onClick={handleNextClick}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "View Results"
                    : "Next Question"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    return null; // Don't render the learn page content if not logged in
  }

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

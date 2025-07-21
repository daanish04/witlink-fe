"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LeaderboardPage from "./LeaderboardPage";
import { toast } from "sonner";

const QuestionsPage = ({ room, socket }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuestionActive, setIsQuestionActive] = useState(true); // To manage question state (active/inactive for answering)
  const [showLeaderboard, setShowLeaderboard] = useState(false); // New state for game end

  // Define time per question based on difficulty
  const timePerQuestion = {
    EASY: 30,
    MEDIUM: 45,
    HARD: 60,
  };

  // Effect to fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError(null); // Clear previous errors
        if (!room.id) {
          setError("Room ID is missing.");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}api/questions/${room.id}`
        );
        if (response.data && Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
          setCurrentQuestionIndex(0);
          // Set initial time for the first question
          setTimeLeft(timePerQuestion[room.difficulty] || 30);
          setIsQuestionActive(true); // Start question as active
        } else {
          setError("Invalid question data received from server.");
          setQuestions([]); // questions array to be empty on error
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || "An unexpected network error occurred."
          );
        } else {
          setError(err.message || "An unknown error occurred.");
        }
      }
    };

    if (room.status === "RUNNING" && room.id) {
      fetchQuestions();
    }
  }, [room.status, room.id, room.difficulty]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isQuestionActive && timeLeft > 0 && questions.length > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isQuestionActive && timeLeft === 0 && questions.length > 0) {
      // Time's up - auto-submit
      handleAnswerSubmit(true);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isQuestionActive, questions.length]);

  const handleAnswerSubmit = (isAutoSubmit = false) => {
    // If not auto-submitting and no answer is selected, do nothing
    if (!isAutoSubmit && selectedAnswer === null) {
      return;
    }

    setIsQuestionActive(false);

    const currentQuestion = questions[currentQuestionIndex];
    const playerAnswer = selectedAnswer; // Will be null if timer ran out without selection

    // Emit answer to server via Socket.IO
    if (socket) {
      socket.emit("submit-answer", {
        roomId: room.id,
        answer: playerAnswer, // Send the selected answer (or null)
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: playerAnswer === currentQuestion.correctAnswer, // Calculate correctness
      });
    }

    // Determine next action after a short delay to allow for visual feedback/processing
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null); // Clear selected answer for next question
        setTimeLeft(timePerQuestion[room.difficulty] || 30); // Reset timer
        setIsQuestionActive(true); // Activate next question
      } else {
        // Game finished
        toast.info("Game finished!");
        setShowLeaderboard(true); // Transition to leaderboard view
      }
    }, 1500); // 1.5-second delay before moving to the next question/leaderboard
  };

  const handleAnswerSelect = (answer) => {
    if (isQuestionActive) {
      setSelectedAnswer(answer);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <h2 className="text-3xl font-bold text-red-700">
          Error Loading Questions
        </h2>
        <p className="text-lg text-gray-700">{error}</p>
        <button
          // onClick={() => window.location.reload()}
          // set the game status back to "WAITING"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back to Room Rules
        </button>
      </div>
    );
  }

  if (showLeaderboard) {
    // Render Leaderboard component when game is finished
    // You'll need to pass actual score/game results here from your game state/socket
    return <LeaderboardPage room={room} socket={socket} />;
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <h2 className="text-3xl font-bold text-indigo-700">
          No Questions Available
        </h2>
        <p className="text-lg text-gray-700">
          Please check your topic and difficulty settings or try again.
        </p>
        <Link
          href={"/"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Home
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 max-w-4xl mx-auto p-4">
      <div className="w-full">
        {/* Timer */}
        <div className="text-center mb-6">
          <div
            className={`text-2xl font-bold ${
              timeLeft <= 10 ? "text-red-600" : "text-indigo-700"
            }`}
          >
            Time: {timeLeft}s
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = option.charAt(0); // 'A', 'B', 'C', 'D'
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  disabled={!isQuestionActive} // Disable button if not active
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors
                    ${
                      isQuestionActive && selectedAnswer === optionLetter
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800" // Selected
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50" // Normal
                    }
                    ${
                      !isQuestionActive &&
                      optionLetter === currentQuestion.correctAnswer
                        ? "bg-green-100 border-green-600" // Correct answer after submission
                        : ""
                    }
                    ${
                      !isQuestionActive &&
                      selectedAnswer === optionLetter &&
                      selectedAnswer !== currentQuestion.correctAnswer
                        ? "bg-red-100 border-red-600" // Incorrect selected answer after submission
                        : ""
                    }
                    ${!isQuestionActive ? "cursor-not-allowed opacity-80" : ""}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={() => handleAnswerSubmit(false)} // Explicitly indicate not auto-submit
            disabled={selectedAnswer === null || !isQuestionActive} // Disable if no answer or not active
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedAnswer === null || !isQuestionActive
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;

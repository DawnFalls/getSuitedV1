/**
 * 📝 Questionnaire Page
 *
 * This page delivers field-specific or mixed-question quizzes to assess users' technical understanding.
 * Users choose a major (or “Choose Your Career” for mixed fields), answer questions,
 * and receive a final score. Results are optionally saved if the user is authenticated.
 *
 * 📦 Features:
 * - Authenticated user detection and score persistence
 * - Dynamic loading of questions based on major selection
 * - Career path recommendation based on dominant correct field
 */
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import "./Questionnaire.css";


/** Interface for each quiz question */
interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  field: string;
}

interface UserData {
  _id: string;
  name: string;
  profilePicture?: string;
}

const Questionnaire: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [fieldScores, setFieldScores] = useState<Record<string, number>>({});

  const majors = [
    "Choose Your Career",
    "Data Engineering",
    "Software Engineering",
    "Web/App Development",
    "Artificial Intelligence",
    "Cybersecurity",
  ];

  /**
   * 📦 Load user from localStorage if available
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  /**
   * 🔄 When major changes, fetch questions accordingly
   */
  useEffect(() => {
    if (selectedMajor) {
      resetQuiz();
      if (selectedMajor === "Choose Your Career") {
        fetchAllQuestions();
      } else {
        fetchQuestions(selectedMajor);
      }
    } else {
      setQuestions([]);
    }
  }, [selectedMajor]);

  const fetchQuestions = async (major: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/questionnaire/${encodeURIComponent(major)}`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Fetching questions failed:", error);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5001/questionnaire");
      const shuffled = response.data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } catch (error) {
      console.error("Fetching all questions failed:", error);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

    /**
   * ⏭ Move to next question or finish the quiz
   */
  const handleNextQuestion = () => {
    const current = questions[currentQuestionIndex];
    const isCorrect = selectedOption === current.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (selectedMajor === "Choose Your Career") {
        setFieldScores((prev) => ({
          ...prev,
          [current.field]: (prev[current.field] || 0) + 1,
        }));
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption("");
    } else {
      setQuizCompleted(true);
      saveScore(score + (isCorrect ? 1 : 0)); 
    }
  };

  const saveScore = async (finalScore: number) => {
    if (!user?._id) {
      console.warn("⚠️ User not logged in — skipping score save");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found — skipping score save");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5001/users/${user._id}/score`,
        { score: finalScore },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const updatedUser = response.data;
        const updatedUserObj = { ...user, score: updatedUser.score };
        localStorage.setItem("user", JSON.stringify(updatedUserObj));
        setUser(updatedUserObj);
        console.log("✅ Score saved and user updated");
      }
    } catch (error) {
      console.error("❌ Error saving score:", error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption("");
    setFieldScores({});
  };

  const getRecommendedField = (): string => {
    const entries = Object.entries(fieldScores);
    if (entries.length === 0) return "No field identified";
    return entries.reduce((max, entry) => (entry[1] > max[1] ? entry : max))[0];
  };

  return (
    <>
      <Navbar user={user} />
      <div className="questionnaire-container">
        <div className="questionnaire-content">
          <h1>Select Your Major</h1>
          <p>Choose a field of study to tailor your experience:</p>

          <select
            onChange={(e) => setSelectedMajor(e.target.value)}
            value={selectedMajor}
            className="dropdown"
          >
            <option value="">-- Select a Major --</option>
            {majors.map((major, idx) => (
              <option key={idx} value={major}>
                {major}
              </option>
            ))}
          </select>

          {selectedMajor && questions.length > 0 && !quizCompleted && (
            <div className="question-section">
              <h2>
                {selectedMajor} - Question {currentQuestionIndex + 1} of{" "}
                {questions.length}
              </h2>
              <p>{questions[currentQuestionIndex].question}</p>

              <div className="options">
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <label key={idx} className="option-item">
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                className="next-btn"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          )}

          {quizCompleted && (
            <div className="score-section">
              <h3>
                ✅ Your Final Score: {score} / {questions.length}
              </h3>

              {selectedMajor === "Choose Your Career" && (
                <>
                  <h4>📊 Field Performance:</h4>
                  <ul>
                    {Object.entries(fieldScores).map(([field, count]) => (
                      <li key={field}>
                        {field}: {count} correct
                      </li>
                    ))}
                  </ul>
                  <h3>🚀 Recommended Career Path: {getRecommendedField()}</h3>
                </>
              )}

              <button onClick={resetQuiz} className="next-btn">
                🔁 Retry Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Questionnaire;

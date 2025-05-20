/**
 * 💻 TechnicalInterview Component
 *
 * This component simulates the technical part of an AI interview.
 * Users are presented with a series of technical questions and are asked to respond using **pseudocode**.
 * Each answer is sent to an evaluation service, which scores the logic and returns feedback.
 *
 * 📦 Features:
 * - Uses Monaco Editor for clean pseudocode input
 * - Fetches questions dynamically based on the interview role
 * - Submits pseudocode to a backend evaluator
 * - Provides AI-generated feedback and score
 * - Aggregates results and passes them to the parent component
 */
import React, { useEffect, useState } from 'react';
import { fetchTechnicalQuestions, evaluatePseudocode } from '../../services/interviewService';
import MonacoEditor from 'react-monaco-editor';
import { EvaluationResult, InterviewDetails } from '../../type/interview';

/**
 * Props for the TechnicalInterview component
 * @property interviewDetails - Interview configuration selected by the user
 * @property onInterviewComplete - Callback triggered with all evaluated answers
 */
interface TechnicalInterviewProps {
  interviewDetails: InterviewDetails;
  onInterviewComplete: (results: EvaluationResult[]) => void;
}

const TechnicalInterview: React.FC<TechnicalInterviewProps> = ({ interviewDetails, onInterviewComplete }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

    /**
   * 🔄 Fetch questions on component mount based on interview details
   */
  useEffect(() => {
    const loadQuestions = async () => {
      const res = await fetchTechnicalQuestions(interviewDetails);
      setQuestions(res.questions);
    };
    loadQuestions();
  }, [interviewDetails]);

    /**
   * 📤 Submit pseudocode to backend evaluator and process the result
   */
  const handleRunCode = async () => {
    const currentQuestion = questions[currentIndex];
    setLoading(true);
    setFeedback('');

    console.log('Submitted pseudocode:', code);

    try {
      const evaluation = await evaluatePseudocode(currentQuestion, code);

      const result: EvaluationResult = {
        question: currentQuestion,
        codeAnswer: code,
        codeScore: evaluation.score,
        feedback: evaluation.feedback,
      };

      const updatedResults = [...results, result];
      setResults(updatedResults);
      setFeedback(evaluation.feedback);

      if (currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setCode('');
          setFeedback('');
        }, 1500);
      } else {
        onInterviewComplete(updatedResults);
      }
    } catch (err) {
      console.error(err);
      setFeedback('⚠️ Error evaluating your answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1}</h2>
      <p className="mb-4 text-lg">{questions[currentIndex]}</p>
      <MonacoEditor
        width="100%"
        height="300"
        language="plaintext"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button
        onClick={handleRunCode}
        className="mt-4 bg-green-600 text-white py-2 px-6 rounded-xl font-bold hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Submit'}
      </button>

      {feedback && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow">
          <p className="text-sm text-gray-800 whitespace-pre-line">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default TechnicalInterview;
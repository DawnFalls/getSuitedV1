/**
 * 🧠 TrainingChatbot Page
 *
 * Allows users to:
 * - Upload a PDF transcript of their interview evaluation
 * - Analyze past evaluation files
 * - Ask questions and receive AI-generated career advice
 *
 * 📦 Features:
 * - Uses AI to respond based on uploaded evaluation context
 * - Integrates with backend to fetch user details and evaluations
 * - Accepts PDF uploads or selects from stored files
 */
import React, { useState, useEffect } from 'react';
import { fetchCareerAdvice, uploadInterviewTranscript, fetchUserEvaluations } from '../../services/trainingService';
import './TrainingChatbot.css';
import Navbar from '../../components/Navbar/Navbar';

interface Message {
  user: boolean;
  text: string;
}

interface Evaluation {
  fileName: string;
  fileUrl: string;
}

const TrainingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [user, setUser] = useState<{ name: string; email: string; profilePicture?: string } | null>(null);

/**
   * 🔐 Load authenticated user from JWT token
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5001/auth/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              email: data.decoded.email,
              profilePicture: data.decoded.profilePicture,
            });
          }
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  // Fetch existing evaluation PDFs once we have the user email
  useEffect(() => {
    const loadEvals = async () => {
      if (!user?.email) return;
      try {
        const evals = await fetchUserEvaluations(user.email);
        setEvaluations(evals);
      } catch (err) {
        console.error('Error loading evaluations:', err);
      }
    };
    loadEvals();
  }, [user]);

  // Handle PDF file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  // Upload new interview PDF
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadInterviewTranscript(file);
      setMessages(prev => [
        ...prev,
        { user: false, text: 'Interview transcript uploaded. You can now ask about your answers.' }
      ]);
      setUploaded(true);
    } catch (err) {
      console.error('Upload error:', err);
      setMessages(prev => [
        ...prev,
        { user: false, text: 'Failed to upload transcript. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send a previously uploaded evaluation PDF to the chatbot
  const handleAnalyzeEvaluation = async (evalItem: Evaluation) => {
    setLoading(true);
    try {
      await uploadInterviewTranscript({ url: evalItem.fileUrl } as any);
      setMessages(prev => [
        ...prev,
        { user: false, text: `Analysis started for ${evalItem.fileName}. You can now ask about this evaluation.` }
      ]);
      setUploaded(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setMessages(prev => [
        ...prev,
        { user: false, text: `Failed to analyze ${evalItem.fileName}. Please try again.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send chat message (question about transcript)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { user: true, text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetchCareerAdvice(input);
      setMessages(prev => [...prev, userMsg, { user: false, text: response }]);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setMessages(prev => [...prev, userMsg, { user: false, text: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <Navbar user={user} />

      {/* PDF Upload Section */}
      <div className="upload-section">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="upload-button"
        >
          {loading && !uploaded ? 'Uploading...' : 'Upload Interview PDF'}
        </button>
      </div>

      {/* Existing Evaluations */}
      <div className="evaluations-section">
        <h3>Your Evaluation Reports</h3>
        {evaluations.length > 0 ? (
          <ul className="evaluations-list">
            {evaluations.map((evalItem, idx) => (
              <li key={idx}>
                <button
                  className="eval-button"
                  onClick={() => handleAnalyzeEvaluation(evalItem)}
                  disabled={loading}
                >
                  Analyze {evalItem.fileName}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No evaluation reports found.</p>
        )}
      </div>

      {/* Messages Section */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'ai-message'}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={uploaded ? 'Ask about your transcript...' : 'Upload or select a transcript first'}
          disabled={loading || !uploaded}
          className="input-field"
        />
        <button type="submit" disabled={loading || !uploaded} className="send-button">
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default TrainingChatbot;

/**
 * 🧠 InterviewHome Page
 *
 * This component controls the full flow of the interview simulation on getSuited.
 * It manages the registration check, disclaimer modal, interview setup,
 * behavioral questions, technical questions, and finally redirects to the evaluation page.
 *
 * 📦 Features:
 * - Auth check via JWT token
 * - Disclaimer agreement required before proceeding
 * - Step-by-step interview stage management
 * - Supports both behavioral and technical interview modes
 * - Stores intermediate results and passes all results to the evaluation page
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerModal from '../../components/Interview/DisclaimerModal';
import InterviewSetupForm from '../../components/Interview/InterviewSetupForm/InterviewSetupForm';
import StartInterview from '../../components/Interview/BehavioralInterview/BehavioralInterview';
import TechnicalInterview from '../../components/Interview/TechnicalInterview';
import { EvaluationResult, InterviewDetails } from '../../type/interview';
import Navbar from '../../components/Navbar/Navbar';

/** Authenticated user structure */
interface UserData {
  name: string;
  email: string;  // Added email field
  profilePicture?: string;
}

/**
 * 🔐 Inline Modal for users who are not signed in
 */
const RegisterPromptModal: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      textAlign: 'center',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    }}>
      <h2>Please Sign In or Register</h2>
      <p>You must be signed in to take the interview.</p>
      <button
        onClick={onRedirect}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Login
      </button>
    </div>
  </div>
);

const InterviewHome: React.FC = () => {
  const [step, setStep] = useState<'registerCheck' | 'registerPrompt' | 'disclaimer' | 'position' | 'behavioral' | 'technical' | 'combined'>('registerCheck');
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

    /**
   * 🧾 On mount or when `step` changes to 'registerCheck':
   * - Checks for a valid token
   * - If valid → loads user and proceeds to disclaimer
   * - If invalid → shows login/register modal
   */
  useEffect(() => {
    if (step === 'registerCheck') {
      const token = localStorage.getItem('token');
  
      if (token) {
        fetch("http://localhost:5001/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => {
            if (res.status === 200) return res.json();
            throw new Error("Unauthorized");
          })
          .then(data => {
            setUser({
              name: data.decoded.name,
              email: data.decoded.email,  // Save the user's email
              profilePicture: data.decoded.profilePicture,
            });
            setStep('disclaimer');
          })
          .catch(() => {
            localStorage.removeItem("token");
            setStep('registerPrompt');
          });
      } else {
        setStep('registerPrompt');
      }
    }
  }, [step]);

  const handleAcceptDisclaimer = () => {
    setStep('position');
  };

    /**
   * 📝 Interview setup complete (role, company, seniority, etc.)
   * Starts the behavioral or combined interview flow
   */
  const handleCompleteSetup = (details: InterviewDetails) => {
    setInterviewDetails(details);
    setStep('combined'); // Or 'behavioral' / 'technical'
  };

   /**
   * 🎤 Behavioral interview finished
   * Stores results and transitions to technical round
   */
  const handleBehavioralComplete = (behavioralResults: EvaluationResult[]) => {
    setResults(behavioralResults);
    setStep('technical');
  };

  /**
   * 💻 Technical interview finished
   * Combines results and redirects to evaluation
   */
  const handleTechnicalComplete = (technicalResults: EvaluationResult[]) => {
    const allResults = [...results, ...technicalResults];
    navigate('/evaluation', { state: { results: allResults } });
  };

  return (
    <div>
      {user && <Navbar user={user} />}

      {step === 'registerPrompt' && (
        <RegisterPromptModal onRedirect={() => navigate('/signin')} />
      )}
      {step === 'disclaimer' && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
      {step === 'position' && <InterviewSetupForm onComplete={handleCompleteSetup} />}
      {step === 'behavioral' && interviewDetails && (
        <StartInterview interviewDetails={interviewDetails} onInterviewComplete={handleBehavioralComplete} />
      )}
      {step === 'technical' && interviewDetails && (
        <TechnicalInterview interviewDetails={interviewDetails} onInterviewComplete={handleTechnicalComplete} />
      )}
      {step === 'combined' && interviewDetails && (
        <StartInterview interviewDetails={interviewDetails} onInterviewComplete={handleBehavioralComplete} />
      )}
    </div>
  );
};

export default InterviewHome;
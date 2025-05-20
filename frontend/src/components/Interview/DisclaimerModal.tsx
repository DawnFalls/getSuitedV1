import React from 'react';
/**
 * ⚠️ DisclaimerModal Component
 *
 * A full-screen modal displayed before starting the AI interview simulation.
 * Informs users about the use of their webcam and microphone, pseudocode expectations,
 * and how AI will process and evaluate their responses.
 *
 * 📦 Features:
 * - Blocks the rest of the UI (fullscreen overlay)
 * - Requires user consent before proceeding
 * - Styled with inline styles for simplicity (no external CSS required)
 */


/**
 * Props for DisclaimerModal
 * @property onAccept - Callback triggered when the user clicks the “I Agree” button
 */
interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
      }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Interview Disclaimer</h2>
        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
          Welcome to the getSuited AI Interview Simulation. This feature is designed to provide a comprehensive and realistic interview experience. Please read the following carefully before proceeding:
          <br /><br />
          1. You will be guided through a series of behavioral and technical interview questions based on your role selection.
          <br />
          2. Your <strong>webcam</strong> and <strong>microphone</strong> will be used to analyze facial expressions, body language, speaking tone, and vocal emotion.
          <br />
          3. Each behavioral answer is recorded and processed with AI to evaluate your confidence, emotional consistency, and non-verbal cues.
          <br />
          4. Each technical question must be answered using <strong>pseudocode only</strong>. The system will evaluate logical correctness, not programming syntax.
          <br />
          5. AI-generated feedback will be provided at the end, combining behavioral and technical evaluation results.
          <br />
          6. Your interview performance is not shared externally and is only stored temporarily for session-based analysis.
          <br /><br />
          By clicking "I Agree," you consent to the use of your camera and microphone for the purposes outlined above and agree to proceed with the simulated interview.
        </p>
        <div className="text-center">
          <button
            onClick={onAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl mt-4"
          >
            I Agree, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;

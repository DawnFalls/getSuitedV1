/**
 * 🧾 InterviewSetupForm Component
 *
 * A user-friendly form used to configure interview parameters before starting an AI-driven mock interview.
 * It collects the user's intended role, work preferences, and company name to personalize the interview session.
 *
 * 📋 Key Fields:
 * - Position (e.g., Software Engineer, Data Engineer)
 * - Work Type (Internship, Full-Time, etc.)
 * - Seniority Level (Junior, Mid, Senior)
 * - Work Model (Remote, Onsite, Hybrid)
 * - Company Name
 *
 * 📦 Features:
 * - Validates that all fields are filled before proceeding
 * - Uses controlled form inputs via `useState`
 * - Sends form data up via `onComplete` callback
 */
import React, { useState } from 'react';
import './InterviewSetupForm.css';
import Icon1 from '../../../assets/career-icon-1.jpg';
import Icon2 from '../../../assets/career-icon-2.png';

interface InterviewDetails {
  position: string;
  workType: string;
  seniority: string;
  companyName: string;
  workModel: string;
}

interface InterviewSetupFormProps {
  /**
   * Called when the form is completed successfully
   * @param details - full interview setup form values
   */
  onComplete: (details: InterviewDetails) => void;
}

const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({ onComplete }) => {
  const [details, setDetails] = useState<InterviewDetails>({
    position: '',
    workType: '',
    seniority: '',
    companyName: '',
    workModel: '',
  });

  const handleChange = (field: keyof InterviewDetails, value: string) => {
    setDetails({ ...details, [field]: value });
  };

  const handleSubmit = () => {
    if (!details.position || !details.workType || !details.seniority || !details.companyName || !details.workModel) {
      alert('Please complete all fields before starting.');
      return;
    }
    onComplete(details);
  };

  return (
    <div className="interview-bg">
      <img src={Icon1} alt="Career 1" className="career-icon icon-left" />
      <img src={Icon2} alt="Career 2" className="career-icon icon-right" />
  
      {/* Title moved out of form container */}
      <h2 className="interview-title">Interview Setup</h2>
  
      <div className="interview-form-container">
        {/* Position */}
        <div className="flex flex-col">
          <label>Position    </label>
          <select
            value={details.position}
            onChange={(e) => handleChange('position', e.target.value)}
          >
            <option value="">Select a Position</option>
            {[
              'Software Engineer',
              'Backend Developer',
              'Frontend Designer',
              'Full Stack Developer',
              'Data Engineer',
              'AI/ML Engineer',
              'Cybersecurity Specialist',
              'Database Administrator',
              'Mobile App Developer',
              'DevOps Engineer',
            ].map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
  
        {/* Work Type */}
        <div className="flex flex-col">
          <label>Work Type    </label>
          <select
            value={details.workType}
            onChange={(e) => handleChange('workType', e.target.value)}
          >
            <option value="">Select Work Type</option>
            {['Internship', 'Full-Time', 'Part-Time'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
  
        {/* Seniority */}
        <div className="flex flex-col">
          <label>Seniority Level    </label>
          <select
            value={details.seniority}
            onChange={(e) => handleChange('seniority', e.target.value)}
          >
            <option value="">Select Seniority</option>
            {['Junior', 'Mid-Level', 'Senior'].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
  
        {/* Work Model */}
        <div className="flex flex-col">
          <label>Work Model    </label>
          <select
            value={details.workModel}
            onChange={(e) => handleChange('workModel', e.target.value)}
          >
            <option value="">Select Work Model</option>
            {['Remote', 'Onsite', 'Hybrid'].map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
  
        {/* Company Name */}
        <div className="flex flex-col col-span-full">
          <label>Company Name    </label>
          <input
            type="text"
            placeholder="Enter Company Name"
            value={details.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </div>
  
        {/* Submit */}
        <button onClick={handleSubmit} className="start-btn">
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewSetupForm;
import React from "react";
import "./Errorbox.css";

interface ErrorBoxProps {
  message: string;
  retryAction?: () => void;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message, retryAction }) => {
  return (
    <div className="error-box">
      <div className="error-header">
        <span>Error</span>
      </div>
      <div className="error-body">
        <p>{message}</p>
      </div>
      {retryAction && (
        <div className="error-footer">
          <button onClick={retryAction} className="retry-button">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorBox;
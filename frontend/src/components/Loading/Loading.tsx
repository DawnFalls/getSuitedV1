// src/components/Loading/Loading.tsx
import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="suitcase-loader">
        <div className="briefcase" />
        <p className="loading-text">Suiting you up for success...</p>
      </div>
    </div>
  );
};

export default Loading;
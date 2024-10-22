import React from 'react';
import './ProgressBar.css'; // Ensure you have this CSS file for styles

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;

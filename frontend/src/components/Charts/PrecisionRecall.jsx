import React from 'react';

const PrecisionRecall = () => {
  return (
    <div className="simple-chart">
      <h4>Precision-Recall Curve</h4>
      <div className="chart-placeholder">
        <div className="chart-mock">
          <svg viewBox="0 0 100 60" className="mock-svg">
            <line x1="10" y1="50" x2="90" y2="10" stroke="var(--primary-blue)" strokeWidth="2" />
            <circle cx="30" cy="35" r="2" fill="var(--primary-blue)" />
            <circle cx="50" cy="25" r="2" fill="var(--primary-blue)" />
            <circle cx="70" cy="15" r="2" fill="var(--primary-blue)" />
          </svg>
        </div>
        <div className="chart-info">
          <p><strong>Average Precision:</strong> 0.92</p>
          <p><strong>Precision:</strong> 89.7%</p>
          <p><strong>Recall:</strong> 96.1%</p>
        </div>
      </div>
    </div>
  );
};

export default PrecisionRecall;

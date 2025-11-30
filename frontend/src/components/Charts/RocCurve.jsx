import React from 'react';

const RocCurve = () => {
  return (
    <div className="simple-chart">
      <h4>ROC Curve</h4>
      <div className="chart-placeholder">
        <div className="chart-mock">
          <svg viewBox="0 0 100 60" className="mock-svg">
            <line x1="10" y1="50" x2="90" y2="10" stroke="var(--secondary-teal)" strokeWidth="2" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="var(--gray-400)" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
        </div>
        <div className="chart-info">
          <p><strong>AUC Score:</strong> 0.94</p>
          <p><strong>Optimal Threshold:</strong> 0.63</p>
        </div>
      </div>
    </div>
  );
};

export default RocCurve;

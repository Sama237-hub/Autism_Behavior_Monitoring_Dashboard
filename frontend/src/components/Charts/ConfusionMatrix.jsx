import React from 'react';

const ConfusionMatrix = () => {
  const data = {
    truePositive: 45,
    falsePositive: 8,
    falseNegative: 5,
    trueNegative: 42
  };

  const total = data.truePositive + data.falsePositive + data.falseNegative + data.trueNegative;

  return (
    <div className="confusion-matrix-container">
      <div className="confusion-matrix">
        <div className="matrix-labels">
          <div className="label-axis-y">Predicted Positive</div>
          <div className="label-axis-x">Predicted Negative</div>
        </div>
        
        <div className="matrix-grid">
          <div className="matrix-cell true-positive">
            <div className="cell-content">
              <div className="cell-value">{data.truePositive}</div>
              <div className="cell-label">True Positive</div>
              <div className="cell-percentage">
                {((data.truePositive / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="matrix-cell false-positive">
            <div className="cell-content">
              <div className="cell-value">{data.falsePositive}</div>
              <div className="cell-label">False Positive</div>
              <div className="cell-percentage">
                {((data.falsePositive / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="matrix-cell false-negative">
            <div className="cell-content">
              <div className="cell-value">{data.falseNegative}</div>
              <div className="cell-label">False Negative</div>
              <div className="cell-percentage">
                {((data.falseNegative / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="matrix-cell true-negative">
            <div className="cell-content">
              <div className="cell-value">{data.trueNegative}</div>
              <div className="cell-label">True Negative</div>
              <div className="cell-percentage">
                {((data.trueNegative / total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="matrix-legend">
        <div className="legend-item">
          <div className="legend-color true-positive"></div>
          <span>True Positive</span>
        </div>
        <div className="legend-item">
          <div className="legend-color false-positive"></div>
          <span>False Positive</span>
        </div>
        <div className="legend-item">
          <div className="legend-color false-negative"></div>
          <span>False Negative</span>
        </div>
        <div className="legend-item">
          <div className="legend-color true-negative"></div>
          <span>True Negative</span>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
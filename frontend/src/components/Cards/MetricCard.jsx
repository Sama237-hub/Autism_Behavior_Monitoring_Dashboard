import React from 'react';

const MetricCard = ({ title, value, change, trend, icon }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'var(--accent-green)';
    if (trend === 'down') return 'var(--accent-red)';
    return 'var(--gray-500)';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <div className="metric-card hover-lift">
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <div className="metric-trend" style={{ color: getTrendColor() }}>
          {getTrendIcon()} {change}
        </div>
      </div>
      
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value">{value}</div>
      </div>
      
      <div className="metric-progress">
        <div 
          className="progress-bar"
          style={{
            width: '75%',
            backgroundColor: getTrendColor()
          }}
        ></div>
      </div>
    </div>
  );
};

export default MetricCard;
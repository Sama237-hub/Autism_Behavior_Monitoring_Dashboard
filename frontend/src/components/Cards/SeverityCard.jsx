import React from 'react';

const SeverityCard = ({ level, count, percentage, trend, description }) => {
  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'mild': return 'var(--accent-green)';
      case 'moderate': return 'var(--accent-orange)';
      case 'severe': return 'var(--accent-red)';
      default: return 'var(--primary-blue)';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="severity-card hover-lift">
      <div 
        className="severity-header"
        style={{ borderBottomColor: getLevelColor(level) }}
      >
        <h3 className="severity-level" style={{ color: getLevelColor(level) }}>
          {level}
        </h3>
        <div className="severity-trend">
          {getTrendIcon(trend)} {trend}
        </div>
      </div>
      
      <div className="severity-content">
        <div className="severity-count">{count}</div>
        <div className="severity-percentage">{percentage}% of total</div>
        
        {description && (
          <div className="severity-description">
            {description}
          </div>
        )}
      </div>
      
      <div className="severity-progress">
        <div 
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getLevelColor(level)
          }}
        ></div>
      </div>
    </div>
  );
};

export default SeverityCard;
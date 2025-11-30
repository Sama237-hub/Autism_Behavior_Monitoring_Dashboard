import React from 'react';

const DiagnosisCard = ({ patientId, confidence, severity, severityConfidence, timestamp, age, gender }) => {
  return (
    <div className="diagnosis-card hover-lift">
      <div className="diagnosis-header">
        <span className="patient-id">{patientId}</span>
        <div className="confidence-badge high">
          {confidence}% Diagnosis
        </div>
      </div>
      
      <div className="diagnosis-details">
        <div className="detail-item">
          <span className="detail-label">Diagnosis Confidence</span>
          <span className="detail-value">{confidence}%</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Severity Level</span>
          <span className="detail-value">{severity}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Severity Confidence</span>
          <span className="detail-value">{severityConfidence}%</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Age / Gender</span>
          <span className="detail-value">{age} / {gender}</span>
        </div>
      </div>
      
      <div className="diagnosis-footer">
        <span className="timestamp">{timestamp}</span>
        <div className="model-badges">
          <span className="model-badge">SVM</span>
          <span className="model-badge">GB</span>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisCard;
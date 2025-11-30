import React, { useState, useEffect } from 'react';
import MetricCard from '../components/Cards/MetricCard';
import DiagnosisCard from '../components/Cards/DiagnosisCard';
import SeverityCard from '../components/Cards/SeverityCard';
import ConfusionMatrix from '../components/Charts/ConfusionMatrix';
import RocCurve from '../components/Charts/RocCurve';
import PrecisionRecall from '../components/Charts/PrecisionRecall';
import SeverityDistributionChart from '../components/Charts/SeverityDistributionChart';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [modelData, setModelData] = useState({
    diagnosis_model: { accuracy: 0, precision: 0, recall: 0, f1_score: 0 },
    severity_model: { accuracy: 0, precision: 0, recall: 0, f1_score: 0 }
  });
  const [recentPredictions, setRecentPredictions] = useState([]);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        console.log('Fetching model performance data...');
        
        // Try to get real data from backend
        const performanceResponse = await fetch('http://localhost:5000/api/model-performance');
        const predictionsResponse = await fetch('http://localhost:5000/api/recent-predictions');
        if (performanceResponse.ok && predictionsResponse.ok) {
          const performanceData = await performanceResponse.json();
          const predictionsData = await predictionsResponse.json();
          
          setModelData(performanceData);
          setRecentPredictions(predictionsData);
          console.log('Real data loaded successfully');
        } else {
          throw new Error('Backend API not responding properly');
        }
      } catch (error) {
        console.log('Using fallback data:', error.message);
        // Fallback data - REPLACE WITH YOUR ACTUAL MODEL METRICS
        setModelData({
          diagnosis_model: {
            accuracy: 87.3,    // YOUR ACTUAL DIAGNOSIS MODEL ACCURACY
            precision: 85.2,   // YOUR ACTUAL PRECISION
            recall: 89.1,      // YOUR ACTUAL RECALL
            f1_score: 87.1,    // YOUR ACTUAL F1 SCORE
            model_name: "SVM Diagnosis Model"
          },
          severity_model: {
            accuracy: 82.5,    // YOUR ACTUAL SEVERITY MODEL ACCURACY
            precision: 81.3,   // YOUR ACTUAL PRECISION
            recall: 83.7,      // YOUR ACTUAL RECALL
            f1_score: 82.5,    // YOUR ACTUAL F1 SCORE
            model_name: "GradientBoosting Severity Model"
          }
        });
        
        setRecentPredictions([
          {
            patient_id: "PT-001",
            diagnosis_confidence: 92,
            diagnosis_result: "Autism",
            severity_level: "Moderate",
            severity_confidence: 88,
            age: 8,
            gender: "Male",
            timestamp: "2024-01-15"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout - check backend connection');
        setLoading(false);
      }
    }, 5000);

    fetchModelData();

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading model performance data...</p>
        <small>Checking backend connection on port 5000</small>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Autism Behavior Analytics</h1>
        <p className="dashboard-subtitle">Dual Model Performance: Diagnosis + Severity Assessment</p>
      </div>

      {/* Diagnosis Model Metrics */}
      <div className="model-section">
        <h2>Diagnosis Model Performance</h2>
        <div className="metrics-grid">
          <MetricCard
            title="Diagnosis Accuracy"
            value={`${modelData.diagnosis_model.accuracy}%`}
            change="Random Forest Model"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Diagnosis Precision"
            value={`${modelData.diagnosis_model.precision}%`}
            change="Random Forest Model"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Diagnosis Recall"
            value={`${modelData.diagnosis_model.recall}%`}
            change="Random Forest Model"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Diagnosis F1 Score"
            value={`${modelData.diagnosis_model.f1_score}%`}
            change="Randome Forest Model"
            trend="up"
            icon=""
          />
        </div>
      </div>

      {/* Severity Model Metrics */}
      <div className="model-section">
        <h2>Severity Model Performance</h2>
        <div className="metrics-grid">
          <MetricCard
            title="Severity Accuracy"
            value={`${modelData.severity_model.accuracy}%`}
            change="GradientBoosting"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Severity Precision"
            value={`${modelData.severity_model.precision}%`}
            change="GradientBoosting"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Severity Recall"
            value={`${modelData.severity_model.recall}%`}
            change="GradientBoosting"
            trend="up"
            icon=""
          />
          <MetricCard
            title="Severity F1 Score"
            value={`${modelData.severity_model.f1_score}%`}
            change="GradientBoosting"
            trend="up"
            icon=""
          />
        </div>
      </div>



      {/* Combined Predictions */}
      <div className="predictions-section">
        <h2>Recent Combined Predictions</h2>
        <p>Showing results from both Diagnosis and Severity models</p>
        <div className="diagnosis-cards">
          {recentPredictions.length > 0 ? (
            recentPredictions.map((prediction, index) => (
              <DiagnosisCard
                key={index}
                patientId={prediction.patient_id}
                confidence={prediction.diagnosis_confidence}
                severity={prediction.severity_level}
                severityConfidence={prediction.severity_confidence}
                timestamp={prediction.timestamp}
                age={prediction.age}
                gender={prediction.gender}
              />
            ))
          ) : (
            <p>No prediction data available</p>
          )}
          <SeverityCard
            level="Total Analyzed"
            count={250}
            percentage={100}
            trend="stable"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
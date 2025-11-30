
import React, { useState, useEffect } from 'react';
import ResultsTable from '../components/Data/ResultsTable';
import ConfusionMatrix from '../components/Charts/ConfusionMatrix';
import RocCurve from '../components/Charts/RocCurve';
import PrecisionRecall from '../components/Charts/PrecisionRecall';
import SeverityDistributionChart from '../components/Charts/SeverityDistributionChart';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import '../styles/pages/metrics.css';

const Metrics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="metrics-page">
      <div className="page-header">
        <h1>Performance Metrics</h1>
        <p>Detailed analysis of model performance and diagnostic results</p>
      </div>

      <div className="metrics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          📈 Charts
        </button>
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📋 Results
        </button>
      </div>

      <div className="metrics-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="metric-large">
              <div className="metric-value">94.2%</div>
              <div className="metric-label">Overall Accuracy</div>
              <div className="metric-trend positive">+2.3% from last month</div>
            </div>
            <div className="metric-large">
              <div className="metric-value">89.7%</div>
              <div className="metric-label">Precision</div>
              <div className="metric-trend positive">+1.8% from last month</div>
            </div>
            <div className="metric-large">
              <div className="metric-value">96.1%</div>
              <div className="metric-label">Recall</div>
              <div className="metric-trend positive">+3.2% from last month</div>
            </div>
            <div className="metric-large">
              <div className="metric-value">92.8%</div>
              <div className="metric-label">F1 Score</div>
              <div className="metric-trend positive">+2.5% from last month</div>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-full">
            <div className="chart-row">
              <div className="chart-full">
                <h3>Confusion Matrix</h3>
                <ConfusionMatrix />
              </div>
              <div className="chart-full">
                <h3>ROC Curve</h3>
                <RocCurve />
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-full">
                <h3>Precision-Recall Curve</h3>
                <PrecisionRecall />
              </div>
              <div className="chart-full">
                <h3>Severity Distribution</h3>
                <SeverityDistributionChart />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-section">
            <ResultsTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default Metrics;
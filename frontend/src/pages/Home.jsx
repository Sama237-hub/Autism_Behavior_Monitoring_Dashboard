import React from 'react';
import UploadCSV from '../components/Data/UploadCSV';
import '../styles/pages/home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Autism Diagnosis
            <span className="gradient-text"> AI System</span>
          </h1>
          <p className="hero-description">
            Advanced machine learning platform for accurate autism spectrum disorder diagnosis 
            and severity assessment using behavioral data analysis.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">94.2%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat">
              <div className="stat-value">2.1s</div>
              <div className="stat-label">Avg. Diagnosis</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Cases Analyzed</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="floating-card card-1">
              <div className="card-icon">🧠</div>
              <h4>AI Analysis</h4>
              <p>Deep learning models</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">📊</div>
              <h4>Real-time Metrics</h4>
              <p>Live performance data</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🛡️</div>
              <h4>Secure & Private</h4>
              <p>HIPAA compliant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <div className="section-header">
          <h2>Get Started</h2>
          <p>Upload your dataset to begin analysis</p>
        </div>
        <UploadCSV />
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>Key Features</h2>
          <p>Comprehensive autism diagnosis platform</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>High Precision</h3>
            <p>Advanced algorithms with 94%+ accuracy in autism spectrum disorder detection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Results</h3>
            <p>Get comprehensive diagnosis reports in under 3 seconds per case</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Detailed Analytics</h3>
            <p>Comprehensive metrics and visualization tools for deep insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Continuous Learning</h3>
            <p>Model improves continuously with new data and feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
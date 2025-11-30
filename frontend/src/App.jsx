import React from 'react';
import { ThemeProvider } from './context/ThemeContext'; // احذف السطر المكرر
import MainLayout from './components/Layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Metrics from './pages/Metrics';
import './styles/theme.css';
import './styles/base/reset.css';
import './styles/base/typography.css';
import './styles/utils/animations.css';
import './styles/utils/responsive.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
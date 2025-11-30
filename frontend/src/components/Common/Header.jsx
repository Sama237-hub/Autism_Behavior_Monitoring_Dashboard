import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="logo-section">
            <img src="/Logo.jpeg" alt="Autism Diagnosis System" className="logo" />
            <h1 className="app-title">Autism Diagnosis AI</h1>
          </div>
        </div>
        
        <div className="header-right">
          <ThemeToggle />
          <div className="user-profile">
            <div className="user-avatar">
              <span>AD</span>
            </div>
            <span className="user-name">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
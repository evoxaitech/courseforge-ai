import React from 'react';
import './Navbar.css';

export default function Navbar({ onNavigate, creditsUsed = 0, totalCredits = 25 }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          <span className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="11" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M6 16h6M9 13v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="logo-text">CourseForgeAI</span>
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-link" onClick={() => onNavigate('dashboard')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
            <rect x="7.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
            <rect x="1" y="7.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
            <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
          Dashboard
        </button>
        <button className="nav-link" onClick={() => onNavigate('generator')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L8.5 5.5H12.5L9.5 8L10.5 12L7 9.5L3.5 12L4.5 8L1.5 5.5H5.5L7 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          Generate Course
        </button>
        <button className="nav-link" onClick={() => onNavigate('courses')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3.5C2 2.67 2.67 2 3.5 2H10.5C11.33 2 12 2.67 12 3.5V11C12 11.55 11.55 12 11 12H3C2.45 12 2 11.55 2 11V3.5Z" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 5.5h4M5 8h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          My Courses
        </button>
      </div>

      <div className="navbar-right">
        <div className="navbar-credits">
          <span className="credits-label">Credits Used</span>
          <span className="credits-value">{creditsUsed}<span className="credits-total">/{totalCredits}</span></span>
          <span className="credits-remaining">{totalCredits - creditsUsed} remaining</span>
        </div>
        <button className="upgrade-btn">
          Upgrade
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
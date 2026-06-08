import React from 'react';
import './Navbar.css';

export default function Navbar({ onNavigate, creditsUsed = 0, totalCredits = 25, currentView }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          <span className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3" width="14" height="12" rx="2.5" fill="white" opacity="0.9"/>
              <rect x="5" y="7" width="8" height="1.5" rx="0.75" fill="#7c3aed"/>
              <rect x="5" y="10" width="5" height="1.5" rx="0.75" fill="#7c3aed" opacity="0.6"/>
            </svg>
          </span>
          <span className="logo-text">CourseForgeAI</span>
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-link" onClick={() => onNavigate('dashboard')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Dashboard
        </button>
        <button className="nav-link" onClick={() => onNavigate('generator')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.2 4.8H12.5L9.15 7.2L10.35 11L7 8.6L3.65 11L4.85 7.2L1.5 4.8H5.8L7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
          </svg>
          Generate Course
        </button>
        <button className="nav-link" onClick={() => onNavigate('courses')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 7h6M4 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
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
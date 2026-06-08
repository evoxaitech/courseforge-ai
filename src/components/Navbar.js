import React from 'react';
import './Navbar.css';

export default function Navbar({ onNavigate, creditsUsed = 0, totalCredits = 25 }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          <span className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.4"/>
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
        <button className="nav-link nav-link-active" onClick={() => onNavigate('generator')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          Generate Course
        </button>
        <button className="nav-link" onClick={() => onNavigate('courses')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <button className="upgrade-btn" onClick={() => {}}>
          Upgrade
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
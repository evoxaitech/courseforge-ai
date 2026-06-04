import React from 'react';
import './Navbar.css';

export default function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">CourseForge</span>
          <span className="logo-badge">AI</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-brand">by EVOX AI TECH</div>
      </div>
    </nav>
  );
}
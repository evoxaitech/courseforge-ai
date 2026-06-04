import React from 'react';
import './Sidebar.css';

const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'generator', icon: '✦', label: 'Generate Course' },
  { id: 'courses',   icon: '▤',  label: 'My Courses' },
];

const COLORS = ['#7C5CFC','#10D9A0','#F59E0B','#38BDF8'];

export default function Sidebar({ currentView, onNavigate, recentCourses = [], onCourseClick, creditsUsed = 0, onDeleteCourse }) {
  const pct = Math.min((creditsUsed / 25) * 100, 100);

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <div className="sidebar-label">Menu</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {recentCourses.length > 0 && (
        <div className="sidebar-recent">
          <div className="sidebar-label">Recent</div>
          {recentCourses.map((c, i) => (
            <div key={c.id} className="course-pill-wrapper">
              <button className="course-pill" onClick={() => onCourseClick(c.id)}>
                <span className="course-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="course-pill-title">{c.title}</span>
              </button>
              <button
                className="course-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDeleteCourse && onDeleteCourse(c.id); }}
                title="Delete course"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-footer">
        <div className="usage-header">
          <span className="usage-label">Credits Used</span>
          <span className="usage-value">{creditsUsed}/25</span>
        </div>
        <div className="usage-track">
          <div className="usage-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="usage-sub">
          <span>{25 - creditsUsed} remaining</span>
          <button className="upgrade-link">Upgrade ↗</button>
        </div>
      </div>
    </aside>
  );
}
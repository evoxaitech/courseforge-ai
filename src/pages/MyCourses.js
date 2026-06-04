import React, { useState } from 'react';
import './MyCourses.css';

export default function MyCourses({ courses, onCourseClick, onDelete, onNavigate, onNotif }) {
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">My Courses</div>
            <div className="page-subtitle">{courses.length} curriculum{courses.length !== 1 ? 's' : ''} generated</div>
          </div>
          <button className="btn-primary" onClick={() => onNavigate('generator')}>✦ New Course</button>
        </div>
      </div>

      {courses.length > 0 && (
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <div className="empty-title">No courses yet</div>
          <div className="empty-desc">Generate your first AI curriculum!</div>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate('generator')}>✦ Generate Now</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⌕</div>
          <div className="empty-title">No results</div>
          <div className="empty-desc">Try a different search term</div>
        </div>
      ) : (
        <div className="courses-list">
          {filtered.map(c => (
            <div key={c.id} className="course-row" onClick={() => onCourseClick(c.id)}>
              <div className="course-row-main">
                <div className="course-row-title">{c.title}</div>
                <div className="course-row-tagline">{c.tagline}</div>
                <div className="course-row-meta">
                  {c.totalHours && <span className="tag purple">{c.totalHours}h</span>}
                  {c.totalLessons && <span className="tag green">{c.totalLessons} lessons</span>}
                  {c.modules && <span className="tag amber">{c.modules.length} modules</span>}
                  <span className="course-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); onDelete(c.id); onNotif('Course deleted'); }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
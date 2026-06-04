import React from 'react';
import './Dashboard.css';

export default function Dashboard({ courses, onNavigate, onCourseClick }) {
  const stats = [
    { icon: '📚', label: 'Total Courses', value: courses.length, color: 'purple' },
    { icon: '📦', label: 'Total Modules', value: courses.reduce((a, c) => a + (c.modules?.length || 0), 0), color: 'blue' },
    { icon: '✦', label: 'Total Lessons', value: courses.reduce((a, c) => a + (c.totalLessons || 0), 0), color: 'green' },
    { icon: '⏱', label: 'Total Hours', value: courses.reduce((a, c) => a + (c.totalHours || 0), 0), color: 'amber' },
  ];

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="dash-hero">
          <div>
            <div className="page-title">Welcome to CourseForge AI ✦</div>
            <div className="page-subtitle">Generate complete course curriculums in under 60 seconds.</div>
          </div>
          <button className="btn-primary" onClick={() => onNavigate('generator')}>
            ✦ Generate Course
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-icon-wrap">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-section">
        <div className="dash-section-header">
          <div className="section-title">Recent Courses</div>
          {courses.length > 0 && (
            <button className="section-link" onClick={() => onNavigate('courses')}>View all →</button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="dash-empty">
            <div className="empty-icon">✦</div>
            <div className="empty-title">No courses yet</div>
            <div className="empty-desc">Generate your first AI curriculum!</div>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate('generator')}>
              ✦ Generate Now
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.slice(0, 6).map(c => (
              <div key={c.id} className="course-card" onClick={() => onCourseClick(c.id)}>
                <div className="course-card-stripe" />
                <div className="course-card-body">
                  <div>
                    <div className="course-card-title">{c.title}</div>
                    <div className="course-card-tagline">{c.tagline}</div>
                  </div>
                  <div className="course-card-footer">
                    {c.totalHours && <span className="tag purple">{c.totalHours}h</span>}
                    {c.totalLessons && <span className="tag green">{c.totalLessons} lessons</span>}
                    {c.modules && <span className="tag amber">{c.modules.length} modules</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dash-section">
        <div className="dash-section-header">
          <div className="section-title">Coming Soon</div>
        </div>
        <div className="coming-grid">
          {[
            { icon: '🎬', title: 'Video Lessons', desc: 'AI-generated video content for each lesson' },
            { icon: '🎨', title: 'Animated Explainers', desc: 'Auto-animated visual explainers' },
            { icon: '👥', title: 'Student Enrollment', desc: 'Invite students and track progress' },
            { icon: '📱', title: 'Mobile App', desc: 'CourseForge on iOS & Android' },
          ].map((f, i) => (
            <div key={i} className="coming-card">
              <span className="coming-icon">{f.icon}</span>
              <div>
                <div className="coming-title">{f.title}</div>
                <div className="coming-desc">{f.desc}</div>
              </div>
              <span className="coming-badge">SOON</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
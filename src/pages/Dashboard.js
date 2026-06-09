import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function getActivityData(courses) {
  const map = {};
  courses.forEach(c => {
    const d = new Date(c.createdAt);
    const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    map[key] = (map[key] || 0) + 1;
  });
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    days.push({ day: key, courses: map[key] || 0 });
  }
  return days;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-value">{payload[0].value} course{payload[0].value !== 1 ? 's' : ''}</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ courses, onNavigate, onCourseClick }) {
  const stats = [
    { icon: '📚', label: 'Total Courses', value: courses.length, color: 'purple' },
    { icon: '📦', label: 'Total Modules', value: courses.reduce((a, c) => a + (c.modules?.length || 0), 0), color: 'blue' },
    { icon: '✦', label: 'Total Lessons', value: courses.reduce((a, c) => a + (c.totalLessons || 0), 0), color: 'green' },
    { icon: '⏱', label: 'Total Hours', value: courses.reduce((a, c) => a + (c.totalHours || 0), 0), color: 'amber' },
  ];

  const activityData = useMemo(() => getActivityData(courses), [courses]);

  return (
    <div className="page fade-in">

      {/* Hero */}
      <div className="dash-hero-banner">
        <div className="dash-hero-dots" />
        <div className="dash-hero-glow" />
        <div className="dash-hero-content">
          <div className="dash-hero-badge">✦ AI-POWERED</div>
          <h1 className="dash-hero-title">Build Courses.<br/><span>10x Faster.</span></h1>
          <p className="dash-hero-sub">Generate complete course curriculums in under 60 seconds using Claude AI.</p>
          <div className="dash-hero-buttons">
            <button className="dash-hero-btn" onClick={() => onNavigate('generator')}>✦ Generate Course</button>
            <button className="dash-hero-btn-secondary" onClick={() => onNavigate('courses')}>View Features</button>
          </div>

          {/* Preview Card */}
          <div className="dash-hero-preview">
            <div className="preview-top">
              <div className="preview-icon">🎓</div>
              <div>
                <div className="preview-title">Python Basics</div>
                <div className="preview-sub">12 modules · 40 lessons</div>
              </div>
            </div>
            <div className="preview-badges">
              <div className="preview-badge-item"><span style={{color:'#a78bfa'}}>⚡</span> Generated in 48s</div>
              <div className="preview-badge-item"><span style={{color:'#a78bfa'}}>🤖</span> Claude AI</div>
              <div className="preview-badge-item"><span style={{color:'#10d9a0'}}>✓</span> Ready to publish</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dash-content">

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`stat-card ${s.color}`}>
              <div className="stat-icon-wrap">{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}{s.color === 'amber' ? 'h' : ''}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <div className="dash-chart-card">
          <div className="dash-card-header">
            <div className="section-title">Activity (7 days)</div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={activityData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="courses" stroke="#7c3aed" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#7c3aed', r: 3 }} activeDot={{ r: 5, fill: '#a78bfa' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="dash-section">
          <div className="dash-section-header">
            <div className="section-title">Recent Courses</div>
            {courses.length > 0 && <button className="section-link" onClick={() => onNavigate('courses')}>View all →</button>}
          </div>
          {courses.length === 0 ? (
            <div className="dash-empty">
              <div className="empty-icon">✦</div>
              <div className="empty-title">No courses yet</div>
              <div className="empty-desc">Generate your first AI curriculum!</div>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate('generator')}>✦ Generate Now</button>
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

        {/* Coming Soon */}
        <div className="coming-soon-section">
          <div className="coming-soon-badge">COMING SOON</div>
          <div className="coming-soon-title">What's Next</div>
          <div className="coming-soon-sub">Exciting new features coming to enhance your course creation experience.</div>
          <div className="coming-grid">
            {[
              { icon: '🎬', title: 'Video Lessons', desc: 'AI-generated video content for each lesson' },
              { icon: '🎨', title: 'Animated Explainers', desc: 'Auto-animated visual explainers' },
              { icon: '👥', title: 'Student Enrollment', desc: 'Invite students and track progress' },
              { icon: '📱', title: 'Mobile App', desc: 'CourseForge on iOS & Android' },
            ].map((f, i) => (
              <div key={i} className="coming-card">
                <span className="coming-badge">SOON</span>
                <div className="coming-icon">{f.icon}</div>
                <div className="coming-title">{f.title}</div>
                <div className="coming-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="dash-footer">
        <span>© 2024 CourseForgeAI by EVOX AI TECH</span>
      </div>

    </div>
  );
}
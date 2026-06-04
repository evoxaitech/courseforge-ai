import React, { useState } from 'react';
import './CourseDetail.css';

export default function CourseDetail({ course, onBack, onNotif }) {
  const [expanded, setExpanded] = useState(new Set([0]));
  const toggle = i => setExpanded(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="page fade-in">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(JSON.stringify(course, null, 2)); onNotif('Copied to clipboard!'); }}>⎘ Export</button>
        </div>
      </div>

      <div className="detail-hero">
        <div className="detail-title">{course.title}</div>
        <div className="detail-tagline">{course.tagline}</div>
        <div className="detail-meta">
          {course.totalHours && <span className="tag purple">{course.totalHours}h total</span>}
          {course.totalLessons && <span className="tag green">{course.totalLessons} lessons</span>}
          {course.modules && <span className="tag amber">{course.modules.length} modules</span>}
          {course.targetAudience && <span className="tag blue">{course.targetAudience}</span>}
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-section-title">Curriculum</div>
          <div className="module-list">
            {(course.modules || []).map((mod, i) => (
              <div key={i} className={`module-item ${expanded.has(i) ? 'open' : ''}`}>
                <div className="module-header" onClick={() => toggle(i)}>
                  <div className="module-num">{i + 1}</div>
                  <div className="module-info">
                    <div className="module-title">{mod.title}</div>
                    {mod.duration && <div className="module-meta">{mod.duration}</div>}
                  </div>
                  <div className="module-count">{mod.lessons?.length || 0} lessons</div>
                  <div className="module-chevron">{expanded.has(i) ? '▲' : '▼'}</div>
                </div>
                {expanded.has(i) && (
                  <div className="module-body">
                    {mod.objective && <div className="module-obj">🎯 {mod.objective}</div>}
                    {(mod.lessons || []).map((l, j) => (
                      <div key={j} className="lesson-row">
                        <span className="lesson-id">{l.id || `${i+1}.${j+1}`}</span>
                        <span className="lesson-title">{l.title}</span>
                        {l.duration && <span className="lesson-dur">{l.duration}</span>}
                        <span className={`lesson-type ${l.type}`}>{l.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="detail-sidebar">
          {course.learningOutcomes?.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-title">Learning Outcomes</div>
              {course.learningOutcomes.map((o, i) => (
                <div key={i} className="outcome-item">
                  <span className="outcome-check">✓</span> {o}
                </div>
              ))}
            </div>
          )}
          {course.prerequisites?.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-title">Prerequisites</div>
              {course.prerequisites.map((p, i) => (
                <div key={i} className="prereq-item">• {p}</div>
              ))}
            </div>
          )}
          <div className="detail-card">
            <div className="detail-card-title">Course Info</div>
            <div className="info-row"><span>Created</span><span>{new Date(course.createdAt).toLocaleDateString()}</span></div>
            {course.totalHours && <div className="info-row"><span>Duration</span><span>{course.totalHours} hours</span></div>}
            {course.totalLessons && <div className="info-row"><span>Lessons</span><span>{course.totalLessons}</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import './CourseDetail.css';

const API_URL = '/api/claude';

async function generateLessonContent(courseTitle, moduleTitle, lessonTitle) {
  const prompt = `You are an expert educator. Generate detailed lesson content for:

Course: ${courseTitle}
Module: ${moduleTitle}  
Lesson: ${lessonTitle}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "explanation": "A clear, detailed explanation of this topic in 3-4 paragraphs. Use simple language with real examples.",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "practical": "A specific hands-on exercise the student should do right now to practice this concept. Be very specific and actionable.",
  "youtubeQuery": "best search query to find a great YouTube tutorial video for this exact topic (5-8 words)"
}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export default function CourseDetail({ course, onBack, onNotif }) {
  const [expanded, setExpanded] = useState(new Set([0]));
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  const toggle = i => setExpanded(prev => {
    const n = new Set(prev);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  const openLesson = async (lesson, moduleTitle) => {
    const cacheKey = `${moduleTitle}__${lesson.title}`;
    setSelectedLesson({ ...lesson, moduleTitle });
    setError(null);

    if (cacheRef.current[cacheKey]) {
      setLessonContent(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    setLessonContent(null);
    setLoading(true);
    try {
      const content = await generateLessonContent(course.title, moduleTitle, lesson.title);
      cacheRef.current[cacheKey] = content;
      setLessonContent(content);
    } catch (err) {
      setError('Content generate nahi ho saka. Dobara try karo.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedLesson(null);
    setLessonContent(null);
    setError(null);
  };

  const openYouTube = (query) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAASAhAB`;
    window.open(url, '_blank');
  };

  return (
    <div className="page fade-in">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(course, null, 2));
            onNotif('Copied to clipboard!');
          }}>
            📋 Export
          </button>
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
                      <div key={j} className="lesson-row clickable" onClick={() => openLesson(l, mod.title)}>
                        <span className="lesson-id">{l.id || `${i + 1}.${j + 1}`}</span>
                        <span className="lesson-title">{l.title}</span>
                        {l.duration && <span className="lesson-dur">{l.duration}</span>}
                        <span className={`lesson-type ${l.type}`}>{l.type}</span>
                        <span className="lesson-arrow">→</span>
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

      {selectedLesson && (
        <div className="lesson-modal-overlay" onClick={closeModal}>
          <div className="lesson-modal" onClick={e => e.stopPropagation()}>
            <div className="lesson-modal-header">
              <div>
                <div className="lesson-modal-module">{selectedLesson.moduleTitle}</div>
                <div className="lesson-modal-title">{selectedLesson.title}</div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="lesson-modal-body">
              {loading && (
                <div className="lesson-loading">
                  <div className="loading-spinner"></div>
                  <p>AI content generate ho raha hai...</p>
                </div>
              )}

              {error && (
                <div className="lesson-error">
                  <p>{error}</p>
                  <button className="btn-primary" onClick={() => openLesson(selectedLesson, selectedLesson.moduleTitle)}>Retry</button>
                </div>
              )}

              {lessonContent && !loading && (
                <>
                  <div className="content-section">
                    <div className="content-section-title">📖 Explanation</div>
                    <p className="content-text">{lessonContent.explanation}</p>
                  </div>

                  {lessonContent.keyPoints?.length > 0 && (
                    <div className="content-section">
                      <div className="content-section-title">🔑 Key Points</div>
                      <ul className="key-points">
                        {lessonContent.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lessonContent.practical && (
                    <div className="content-section practical-section">
                      <div className="content-section-title">💻 Practical Exercise</div>
                      <p className="content-text">{lessonContent.practical}</p>
                    </div>
                  )}

                  {lessonContent.youtubeQuery && (
                    <div className="content-section">
                      <div className="content-section-title">🎬 Best Video Tutorial</div>
                      <button className="youtube-btn" onClick={() => openYouTube(lessonContent.youtubeQuery)}>
                        ▶ Watch Best Video: "{lessonContent.youtubeQuery}"
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
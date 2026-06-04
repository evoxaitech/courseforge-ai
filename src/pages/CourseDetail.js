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

async function generateQuiz(courseTitle, moduleTitle, lessonTitle) {
  const prompt = `You are an expert educator. Generate a quiz for:

Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Generate exactly 5 questions. Make them challenging but fair.`;

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
  const [isQuiz, setIsQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const cacheRef = useRef({});

  const toggle = i => setExpanded(prev => {
    const n = new Set(prev);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  const openLesson = async (lesson, moduleTitle) => {
    const cacheKey = `${moduleTitle}__${lesson.title}`;
    const quizMode = lesson.type === 'quiz';
    setSelectedLesson({ ...lesson, moduleTitle });
    setIsQuiz(quizMode);
    setAnswers({});
    setSubmitted(false);
    setError(null);

    if (cacheRef.current[cacheKey]) {
      setLessonContent(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    setLessonContent(null);
    setLoading(true);
    try {
      const content = quizMode
        ? await generateQuiz(course.title, moduleTitle, lesson.title)
        : await generateLessonContent(course.title, moduleTitle, lesson.title);
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
    setAnswers({});
    setSubmitted(false);
    setIsQuiz(false);
  };

  const openYouTube = (query) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAASAhAB`;
    window.open(url, '_blank');
  };

  const handleAnswer = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length < lessonContent.questions.length) {
      alert('Sab questions ke jawab do pehle!');
      return;
    }
    setSubmitted(true);
  };

  const getScore = () => {
    if (!lessonContent?.questions) return 0;
    return lessonContent.questions.filter((q, i) => answers[i] === q.correct).length;
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
                        <span className={`lesson-type ${l.type}`}>
                          {l.type === 'video' ? '📝 Text + Video' : l.type === 'quiz' ? '🧠 Quiz' : l.type}
                        </span>
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
                  <p>{isQuiz ? 'Quiz generate ho raha hai...' : 'AI content generate ho raha hai...'}</p>
                </div>
              )}

              {error && (
                <div className="lesson-error">
                  <p>{error}</p>
                  <button className="btn-primary" onClick={() => openLesson(selectedLesson, selectedLesson.moduleTitle)}>Retry</button>
                </div>
              )}

              {/* QUIZ MODE */}
              {lessonContent && !loading && isQuiz && (
                <div className="quiz-container">
                  {submitted && (
                    <div className="quiz-score">
                      <div className="score-number">{getScore()}/{lessonContent.questions.length}</div>
                      <div className="score-label">
                        {getScore() === lessonContent.questions.length ? '🎉 Perfect Score!' :
                         getScore() >= 3 ? '👍 Acha kiya!' : '📚 Thoda aur padhna hai!'}
                      </div>
                    </div>
                  )}

                  {lessonContent.questions.map((q, qi) => (
                    <div key={qi} className="quiz-question">
                      <div className="question-text">Q{qi + 1}. {q.question}</div>
                      <div className="quiz-options">
                        {q.options.map((opt, oi) => {
                          let cls = 'quiz-option';
                          if (answers[qi] === oi) cls += ' selected';
                          if (submitted && oi === q.correct) cls += ' correct';
                          if (submitted && answers[qi] === oi && oi !== q.correct) cls += ' wrong';
                          return (
                            <div key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>
                              <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      {submitted && (
                        <div className="question-explanation">💡 {q.explanation}</div>
                      )}
                    </div>
                  ))}

                  {!submitted && (
                    <button className="submit-quiz-btn" onClick={submitQuiz}>
                      Submit Quiz ({Object.keys(answers).length}/{lessonContent.questions.length} answered)
                    </button>
                  )}

                  {submitted && (
                    <button className="retry-quiz-btn" onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                      cacheRef.current[`${selectedLesson.moduleTitle}__${selectedLesson.title}`] = null;
                      openLesson(selectedLesson, selectedLesson.moduleTitle);
                    }}>
                      🔄 New Quiz
                    </button>
                  )}
                </div>
              )}

              {/* LESSON MODE */}
              {lessonContent && !loading && !isQuiz && (
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
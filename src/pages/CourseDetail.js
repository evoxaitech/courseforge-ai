import React, { useState } from 'react';
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
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await response.json();
  const clean = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function generateQuiz(courseTitle, moduleTitle, lessonTitle) {
  const prompt = `You are an expert educator. Generate a completely fresh quiz every time for:
Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}
Random seed: ${Math.random()}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "mcqs": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "shortQuestion": {
    "question": "A thought-provoking short answer question worth 5 marks about this topic",
    "sampleAnswer": "A detailed sample answer covering all 5 key points needed for full marks"
  }
}
Generate exactly 10 MCQ questions. Challenging but fair. Completely different each time. English only.`;
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await response.json();
  const clean = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

const QUOTES = [
  { min: 10, max: 10, quotes: ["\"The expert in anything was once a beginner.\" — Helen Hayes", "\"Excellence is not a destination but a continuous journey.\" — Brian Tracy", "\"Perfect score! You are absolutely unstoppable!\""] },
  { min: 7, max: 9, quotes: ["\"Believe you can and you're halfway there.\" — Theodore Roosevelt", "\"Every accomplishment starts with the decision to try.\" — John F. Kennedy", "\"Great work! Keep pushing forward!\""] },
  { min: 5, max: 6, quotes: ["\"It does not matter how slowly you go as long as you do not stop.\" — Confucius", "\"Progress, not perfection, is the goal.\"", "\"Keep going. Everything you need will come to you at the perfect time.\""] },
  { min: 0, max: 4, quotes: ["\"Fall seven times, stand up eight.\" — Japanese Proverb", "\"Every master was once a disaster.\" — T. Harv Eker", "\"The only real mistake is the one from which we learn nothing.\" — Henry Ford"] }
];

function getQuote(score) {
  const bucket = QUOTES.find(q => score >= q.min && score <= q.max);
  const arr = bucket?.quotes || QUOTES[3].quotes;
  return arr[Math.floor(Math.random() * arr.length)];
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
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [moduleRatings, setModuleRatings] = useState({});
  const [shortAnswer, setShortAnswer] = useState('');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  const toggle = i => setExpanded(prev => {
    const n = new Set(prev);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  const openLesson = async (lesson, moduleTitle) => {
    const quizMode = lesson.type === 'quiz';
    setSelectedLesson({ ...lesson, moduleTitle });
    setIsQuiz(quizMode);
    setAnswers({});
    setSubmitted(false);
    setShowScorePopup(false);
    setShortAnswer('');
    setShowSampleAnswer(false);
    setError(null);
    setLessonContent(null);
    setLoading(true);
    try {
      const content = quizMode
        ? await generateQuiz(course.title, moduleTitle, lesson.title)
        : await generateLessonContent(course.title, moduleTitle, lesson.title);
      setLessonContent(content);
    } catch (err) {
      setError('Content could not be generated. Please try again.');
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
    setShowScorePopup(false);
    setIsQuiz(false);
    setShortAnswer('');
    setShowSampleAnswer(false);
  };

  const openYouTube = (query) => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAASAhAB`, '_blank');
  };

  const handleAnswer = (qIndex, optIndex) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length < lessonContent.mcqs.length) {
      alert(`Please answer all questions first! (${Object.keys(answers).length}/${lessonContent.mcqs.length})`);
      return;
    }
    setSubmitted(true);
    setShowScorePopup(true);
  };

  const getMCQScore = () => {
    if (!lessonContent?.mcqs) return 0;
    return lessonContent.mcqs.filter((q, i) => answers[i] === q.correct).length;
  };

  const rateModule = (moduleTitle, stars) => {
    setModuleRatings(prev => ({ ...prev, [moduleTitle]: stars }));
  };

  return (
    <div className="page fade-in">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(course, null, 2));
            onNotif('Copied to clipboard!');
          }}>📋 Export</button>
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
                    <div className="module-rating">
                      <span className="rating-label">Rate this module:</span>
                      <div className="stars">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`star ${(moduleRatings[mod.title] || 0) >= star ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); rateModule(mod.title, star); }}>★</span>
                        ))}
                      </div>
                      {moduleRatings[mod.title] && <span className="rating-text">{moduleRatings[mod.title]}/5</span>}
                    </div>
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
                <div key={i} className="outcome-item"><span className="outcome-check">✓</span> {o}</div>
              ))}
            </div>
          )}
          {course.prerequisites?.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-title">Prerequisites</div>
              {course.prerequisites.map((p, i) => <div key={i} className="prereq-item">• {p}</div>)}
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
                  <p>{isQuiz ? 'Generating quiz...' : 'Generating lesson content...'}</p>
                </div>
              )}
              {error && (
                <div className="lesson-error">
                  <p>{error}</p>
                  <button className="btn-primary" onClick={() => openLesson(selectedLesson, selectedLesson.moduleTitle)}>Retry</button>
                </div>
              )}

              {lessonContent && !loading && isQuiz && (
                <div className="quiz-container">
                  <div className="content-section-title">📝 MCQ Questions (10)</div>
                  {lessonContent.mcqs.map((q, qi) => (
                    <div key={qi} className="quiz-question">
                      <div className="question-text">Q{qi + 1}. {q.question}</div>
                      <div className="quiz-options">
                        {q.options.map((opt, oi) => {
                          const selected = answers[qi] === oi;
                          const isCorrect = oi === q.correct;
                          const isAnswered = answers[qi] !== undefined;
                          let cls = 'quiz-option';
                          if (selected && isCorrect) cls += ' correct';
                          else if (selected && !isCorrect) cls += ' wrong';
                          else if (isAnswered && isCorrect) cls += ' correct';
                          return (
                            <div key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>
                              <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                              <span className="option-text">{opt}</span>
                              {selected && isCorrect && <span className="option-icon correct-icon">✓</span>}
                              {selected && !isCorrect && <span className="option-icon wrong-icon">✗</span>}
                              {!selected && isAnswered && isCorrect && <span className="option-icon correct-icon">✓</span>}
                            </div>
                          );
                        })}
                      </div>
                     {answers[qi] !== undefined && submitted && (
                        <div className="question-explanation">💡 {q.explanation}</div>
                      )}
                    </div>
                  ))}

                  {lessonContent.shortQuestion && (
                    <div className="short-question-section">
                      <div className="content-section-title">✍️ Short Question (5 Marks)</div>
                      <div className="short-question-text">{lessonContent.shortQuestion.question}</div>
                      <textarea
                        className="short-answer-input"
                        placeholder="Write your answer here..."
                        value={shortAnswer}
                        onChange={e => setShortAnswer(e.target.value)}
                        rows={4}
                        disabled={showSampleAnswer}
                      />
                      {!showSampleAnswer && (
                        <button className="show-answer-btn" onClick={() => setShowSampleAnswer(true)}>View Sample Answer</button>
                      )}
                      {showSampleAnswer && (
                        <div className="sample-answer">
                          <div className="sample-answer-title">✅ Sample Answer:</div>
                          <p>{lessonContent.shortQuestion.sampleAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {!submitted ? (
                    <button className="submit-quiz-btn" onClick={submitQuiz}>
                      Submit Quiz ({Object.keys(answers).length}/10 answered)
                    </button>
                  ) : (
                    <button className="retry-quiz-btn" onClick={() => openLesson(selectedLesson, selectedLesson.moduleTitle)}>
                      🔄 New Quiz
                    </button>
                  )}
                </div>
              )}

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
                        {lessonContent.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
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

      {showScorePopup && (
        <div className="score-popup-overlay" onClick={() => setShowScorePopup(false)}>
          <div className="score-popup" onClick={e => e.stopPropagation()}>
            <div className="score-popup-number">{getMCQScore()}<span className="score-popup-total">/10</span></div>
            <div className="score-popup-label">
              {getMCQScore() === 10 ? '🎉 Perfect Score!' :
               getMCQScore() >= 7 ? '👍 Great Job!' :
               getMCQScore() >= 5 ? '😊 Good Effort!' :
               '📚 Keep Practicing!'}
            </div>
            <div className="score-popup-quote">{getQuote(getMCQScore())}</div>
            <button className="score-popup-close" onClick={() => setShowScorePopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
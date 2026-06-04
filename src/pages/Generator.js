import React, { useState } from 'react';
import { callClaude, buildPrompt } from '../utils/api';
import './Generator.css';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DURATIONS = ['1-2 Weeks', '1 Month', '3 Months', 'Self-Paced'];
const INCLUDES = ['Video Lessons', 'Quizzes', 'Assignments', 'Projects', 'Live Sessions', 'Readings'];

const STEPS = [
  'Analyzing your topic...',
  'Structuring modules...',
  'Creating lessons...',
  'Adding objectives...',
  'Finalizing curriculum...',
];

export default function Generator({ onGenerated, onNotif }) {
  const [form, setForm] = useState({
    topic: '', audience: '', notes: '',
    level: 'Beginner', duration: '1 Month',
    includes: ['Video Lessons', 'Quizzes', 'Assignments'],
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleInclude = (item) => set('includes',
    form.includes.includes(item) ? form.includes.filter(i => i !== item) : [...form.includes, item]
  );

  const generate = async () => {
    if (!form.topic.trim()) { onNotif('Enter a course topic!', 'error'); return; }
    setError(''); setLoading(true); setPreview(null); setStep(0);

    const t = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 900);

    try {
      const raw = await callClaude(buildPrompt({
        topic: form.topic, audience: form.audience,
        level: form.level, duration: form.duration,
        includes: form.includes.join(', '), notes: form.notes,
      }));
      clearInterval(t);
      try {
        setPreview(JSON.parse(raw.replace(/```json|```/g, '').trim()));
      } catch {
        setPreview({ title: `${form.topic} Course`, tagline: 'AI-generated curriculum', totalHours: 10, totalLessons: 20, modules: [], rawContent: raw });
      }
    } catch (e) {
      clearInterval(t);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">AI Curriculum Generator</div>
        <div className="page-subtitle">Describe your course — Claude AI builds the full curriculum.</div>
      </div>

      <div className="gen-layout">
        <div className="gen-form">
          <div className="form-group">
            <label className="form-label">Course Topic *</label>
            <input className="form-input" placeholder="e.g. Python for Beginners, Digital Marketing..." value={form.topic} onChange={e => set('topic', e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} />
          </div>
          <div className="form-group">
            <label className="form-label">Target Audience</label>
            <input className="form-input" placeholder="e.g. Complete beginners, Marketing professionals..." value={form.audience} onChange={e => set('audience', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Skill Level</label>
            <div className="chips">{LEVELS.map(l => <div key={l} className={`chip ${form.level === l ? 'active' : ''}`} onClick={() => set('level', l)}>{l}</div>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <div className="chips">{DURATIONS.map(d => <div key={d} className={`chip ${form.duration === d ? 'active' : ''}`} onClick={() => set('duration', d)}>{d}</div>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Include</label>
            <div className="chips">{INCLUDES.map(i => <div key={i} className={`chip ${form.includes.includes(i) ? 'active' : ''}`} onClick={() => toggleInclude(i)}>{i}</div>)}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea className="form-input" placeholder="Any specific requirements..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <button className="gen-btn" onClick={generate} disabled={loading || !form.topic.trim()}>
            {loading ? <><span className="spinner" style={{width:16,height:16,borderWidth:2}} /> Generating...</> : '✦ Generate Curriculum'}
          </button>
        </div>

        <div className="gen-preview">
          {!loading && !preview && !error && (
            <div className="empty-state" style={{minHeight:460}}>
              <div className="empty-icon">✦</div>
              <div className="empty-title">Your curriculum appears here</div>
              <div className="empty-desc">Fill the form and click Generate</div>
            </div>
          )}
          {loading && (
            <div className="gen-loading">
              <div className="spinner" style={{width:36,height:36}} />
              <div className="gen-steps">
                {STEPS.map((s, i) => (
                  <div key={i} className={`gen-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    <span className="gen-step-dot" />{s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="gen-error">
              <strong>⚠ Error:</strong> {error}
              {error.includes('key') && <div style={{marginTop:8,fontSize:12,color:'var(--text3)'}}>Enter your Anthropic API key in the banner above.</div>}
            </div>
          )}
          {preview && !loading && <CurriculumPreview curriculum={preview} onSave={() => onGenerated(preview)} />}
        </div>
      </div>
    </div>
  );
}

function CurriculumPreview({ curriculum, onSave }) {
  const [expanded, setExpanded] = useState(new Set([0]));
  const toggle = i => setExpanded(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="curriculum-preview fade-in">
      <div className="preview-top">
        <div>
          <h3 className="preview-title">{curriculum.title}</h3>
          <p className="preview-tagline">{curriculum.tagline}</p>
          <div className="preview-meta">
            {curriculum.totalHours && <span className="tag purple">{curriculum.totalHours}h</span>}
            {curriculum.totalLessons && <span className="tag green">{curriculum.totalLessons} lessons</span>}
            {curriculum.modules && <span className="tag amber">{curriculum.modules.length} modules</span>}
          </div>
        </div>
        <button className="btn-primary" onClick={onSave}>Save →</button>
      </div>

      <div className="module-list">
        {(curriculum.modules || []).map((mod, i) => (
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

      {curriculum.learningOutcomes?.length > 0 && (
        <div className="outcomes">
          <div className="outcomes-title">Learning Outcomes</div>
          {curriculum.learningOutcomes.map((o, i) => (
            <div key={i} className="outcome-item"><span className="outcome-check">✓</span> {o}</div>
          ))}
        </div>
      )}
    </div>
  );
}
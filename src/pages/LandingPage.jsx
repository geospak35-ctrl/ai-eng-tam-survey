import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_CODES } from '../data/surveyData';

const STAKEHOLDER_INFO = [
  {
    type: 'faculty',
    title: 'Faculty',
    description: 'Engineering faculty perspectives on integrating AI tools into teaching, research, and curriculum.',
  },
  {
    type: 'student',
    title: 'Student',
    description: 'Engineering student perceptions, practices, and readiness to use AI tools in coursework and projects.',
  },
  {
    type: 'practitioner',
    title: 'Practitioner / Hiring Manager',
    description: 'Engineering practitioner perspectives on AI readiness and expectations for new graduates.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState({ faculty: '', student: '', practitioner: '' });
  const [errors, setErrors] = useState({});
  const [repeatWarnings, setRepeatWarnings] = useState({});

  // Check localStorage for prior submissions on mount
  useEffect(() => {
    const warnings = {};
    for (const s of STAKEHOLDER_INFO) {
      try {
        if (localStorage.getItem(`ai_eng_tam_submitted_${s.type}`) === 'true') {
          warnings[s.type] = true;
        }
      } catch {
        // localStorage may not be available
      }
    }
    setRepeatWarnings(warnings);
  }, []);

  const handleCodeChange = (type, value) => {
    setCodes((prev) => ({ ...prev, [type]: value }));
    if (errors[type]) {
      setErrors((prev) => ({ ...prev, [type]: null }));
    }
  };

  const handleSubmit = (type) => {
    const enteredCode = codes[type].trim().toUpperCase();
    if (enteredCode === ACCESS_CODES[type]) {
      const isRepeat = repeatWarnings[type] || false;
      navigate(`/survey/${type}`, { state: { accessCode: enteredCode, repeatFlag: isRepeat } });
    } else {
      setErrors((prev) => ({ ...prev, [type]: 'Invalid access code' }));
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>AI-Engineering Technology Acceptance Model</h1>
        <p className="subtitle">AI-Eng-TAM Survey Instrument</p>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--gray-600)', maxWidth: 600, margin: '0 auto' }}>
        Select your stakeholder group and enter your access code to begin the survey.
        Estimated completion time: 12-15 minutes.
      </p>

      <div className="landing-cards">
        {STAKEHOLDER_INFO.map((s) => (
          <div className="landing-card" key={s.type}>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            {repeatWarnings[s.type] && (
              <div className="repeat-warning">
                It appears you have already completed this survey on this device.
                You may proceed, but your response will be flagged as a repeat submission.
              </div>
            )}
            <div className="access-form">
              <input
                type="text"
                placeholder="Access Code"
                value={codes[s.type]}
                onChange={(e) => handleCodeChange(s.type, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(s.type)}
              />
              {errors[s.type] && <span className="access-error">{errors[s.type]}</span>}
              <button className="btn btn-primary" onClick={() => handleSubmit(s.type)}>
                Begin Survey
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
        <a href="/admin">Admin Dashboard</a>
      </p>
    </div>
  );
}

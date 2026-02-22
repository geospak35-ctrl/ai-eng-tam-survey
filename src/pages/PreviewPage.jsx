import { useParams, useNavigate } from 'react-router-dom';
import { getLikertSections, getSectionDData, DEMOGRAPHICS, LIKERT_LABELS } from '../data/surveyData';

const TITLES = {
  faculty: 'Faculty Survey',
  student: 'Student Survey',
  practitioner: 'Practitioner / Hiring Manager Survey',
};

export default function PreviewPage() {
  const { stakeholderType } = useParams();
  const navigate = useNavigate();

  if (!['faculty', 'student', 'practitioner'].includes(stakeholderType)) {
    return (
      <div className="app-container">
        <div className="preview-banner">Invalid survey type</div>
        <p style={{ textAlign: 'center' }}>
          Valid preview URLs:<br />
          <a href="/preview/student">/preview/student</a><br />
          <a href="/preview/faculty">/preview/faculty</a><br />
          <a href="/preview/practitioner">/preview/practitioner</a>
        </p>
      </div>
    );
  }

  const likertSections = getLikertSections(stakeholderType);
  const sectionDData = getSectionDData(stakeholderType);
  const demo = DEMOGRAPHICS[stakeholderType];

  return (
    <div className="app-container preview-container">
      <div className="preview-banner">
        Read-Only Preview
      </div>

      <div className="app-header">
        <h1>AI-Engineering Technology Acceptance Model</h1>
        <p className="subtitle">AI-Eng-TAM {TITLES[stakeholderType]}</p>
      </div>

      <p className="preview-note">
        This is a read-only preview of the survey instrument for review purposes.
        No responses can be submitted from this page.
      </p>

      {/* Likert scale legend */}
      <div className="preview-legend">
        <strong>Response Scale:</strong>{' '}
        {LIKERT_LABELS.map((l, i) => (
          <span key={l.value}>
            {l.value} = {l.label}{i < LIKERT_LABELS.length - 1 ? ';  ' : ''}
          </span>
        ))}
      </div>

      {/* Sections A, B, C — Likert items */}
      {['A', 'B', 'C'].map((sectionKey) => {
        const section = likertSections[sectionKey];
        return (
          <div key={sectionKey} className="survey-section preview-section">
            <h2>{section.title}</h2>
            <p className="section-instruction">{section.instruction}</p>

            {section.constructs.map((construct) => (
              <div key={construct.id} className="construct-group">
                <h3>{construct.name}</h3>
                {construct.items.map((item) => (
                  <div key={item.code} className="likert-item preview-likert-item">
                    <div className="item-text">
                      <span className="item-code">{item.code}.</span>
                      {item.text}
                    </div>
                    <div className="likert-scale">
                      {LIKERT_LABELS.map((l) => (
                        <label key={l.value} className="likert-option">
                          <input
                            type="radio"
                            name={`preview-${item.code}`}
                            disabled
                          />
                          <span className="likert-value">{l.value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}

      {/* Section D — AI Tool Usage */}
      <div className="survey-section preview-section">
        <h2>Section D: AI Tool Usage by Category</h2>
        <p className="section-instruction">{sectionDData.instruction}</p>

        {sectionDData.categories.map((cat) => (
          <div key={cat.id} className="tool-category preview-tool-category">
            <h3>{cat.name}</h3>
            <p className="cat-definition">{cat.definition}</p>
            <p className="gate-question">{sectionDData.question}</p>
            <div className="gate-buttons">
              <label>
                <input type="radio" disabled /> Yes
              </label>
              <label>
                <input type="radio" disabled /> No
              </label>
            </div>

            {/* Show tools expanded so reviewers can see all options */}
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.5rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
              If "Yes," respondent selects from:
            </p>
            <div className="tool-checkboxes">
              {cat.tools.map((tool) => (
                <label key={tool}>
                  <input type="checkbox" disabled />
                  {tool}
                </label>
              ))}
            </div>
            <div className="other-tool-input">
              <label>Other (please specify):</label>
              <input type="text" disabled placeholder="[free text]" />
            </div>
          </div>
        ))}
      </div>

      {/* Demographics */}
      <div className="survey-section preview-section">
        <h2>{demo.title}</h2>
        <p className="section-instruction">
          Fields marked with * are required. Other fields are optional but help analyze patterns across groups.
        </p>

        <div className="demographics-form">
          {demo.fields.map((field) => (
            <div key={field.id} className="demo-field">
              <label>
                {field.label}
                {field.required && <span className="required-asterisk"> *</span>}
              </label>
              {field.type === 'text' && (
                <input type="text" disabled placeholder="[free text]" />
              )}
              {field.type === 'select' && (
                <select disabled>
                  <option>-- Select --</option>
                  {field.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {field.type === 'select-other' && (
                <select disabled>
                  <option>-- Select --</option>
                  {field.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                  <option>Other</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="preview-footer">
        End of {TITLES[stakeholderType]} instrument.
      </div>
    </div>
  );
}

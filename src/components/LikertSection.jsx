import { LIKERT_LABELS } from '../data/surveyData';

export default function LikertSection({ sectionData, responses, onResponse }) {
  return (
    <div className="survey-section">
      <h2>{sectionData.title}</h2>
      <p className="section-instruction">{sectionData.instruction}</p>

      {/* Likert scale legend */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
        background: 'var(--primary-bg)', borderRadius: 'var(--radius)', marginBottom: '1.5rem',
        fontSize: '0.75rem', color: 'var(--gray-600)',
      }}>
        {LIKERT_LABELS.map((l) => (
          <span key={l.value}>{l.value} = {l.label}</span>
        ))}
      </div>

      {sectionData.constructs.map((construct) => (
        <div key={construct.id} className="construct-group">
          <h3>{construct.name}</h3>
          {construct.items.map((item) => (
            <div key={item.code} className="likert-item">
              <div className="item-text">
                <span className="item-code">{item.code}.</span>
                {item.text}
              </div>
              <div className="likert-scale">
                {LIKERT_LABELS.map((l) => (
                  <label key={l.value} className="likert-option">
                    <input
                      type="radio"
                      name={item.code}
                      value={l.value}
                      checked={responses[item.code] === l.value}
                      onChange={() => onResponse(item.code, l.value)}
                    />
                    <span className="likert-value">{l.value}</span>
                    <span className="likert-label">{l.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

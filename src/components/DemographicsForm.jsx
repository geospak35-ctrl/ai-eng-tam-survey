import { DEMOGRAPHICS } from '../data/surveyData';

export default function DemographicsForm({ stakeholderType, values, onChange }) {
  const demo = DEMOGRAPHICS[stakeholderType];

  const handleChange = (fieldId, value) => {
    onChange({ ...values, [fieldId]: value });
  };

  return (
    <div className="survey-section">
      <h2>{demo.title}</h2>
      <p className="section-instruction">These fields are optional. Your responses help us analyze patterns across groups.</p>

      <div className="demographics-form">
        {demo.fields.map((field) => (
          <div key={field.id} className="demo-field">
            <label htmlFor={field.id}>{field.label}</label>
            {field.type === 'text' && (
              <input
                id={field.id}
                type="text"
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
            {field.type === 'select' && (
              <select
                id={field.id}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">-- Select --</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {field.type === 'select-other' && (
              <>
                <select
                  id={field.id}
                  value={values[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {values[field.id] === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={values[field.otherField] || ''}
                    onChange={(e) => handleChange(field.otherField, e.target.value)}
                    style={{ marginTop: '0.35rem' }}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

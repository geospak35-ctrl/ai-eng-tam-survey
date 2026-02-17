import { DEMOGRAPHICS } from '../data/surveyData';

export default function DemographicsForm({ stakeholderType, values, onChange, validationErrors }) {
  const demo = DEMOGRAPHICS[stakeholderType];
  const errors = validationErrors || {};

  const handleChange = (fieldId, value) => {
    onChange({ ...values, [fieldId]: value });
  };

  const hasRequiredFields = demo.fields.some((f) => f.required);

  return (
    <div className="survey-section">
      <h2>{demo.title}</h2>
      <p className="section-instruction">
        {hasRequiredFields
          ? 'Fields marked with * are required. Other fields are optional but help us analyze patterns across groups.'
          : 'These fields are optional. Your responses help us analyze patterns across groups.'}
      </p>

      <div className="demographics-form">
        {demo.fields.map((field) => (
          <div key={field.id} className={`demo-field ${errors[field.id] ? 'demo-field-error' : ''}`}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required-asterisk"> *</span>}
            </label>
            {field.type === 'text' && (
              <input
                id={field.id}
                type="text"
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={errors[field.id] ? 'input-error' : ''}
              />
            )}
            {field.type === 'select' && (
              <select
                id={field.id}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={errors[field.id] ? 'input-error' : ''}
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
                  className={errors[field.id] ? 'input-error' : ''}
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
            {errors[field.id] && (
              <span className="field-error-message">{errors[field.id]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

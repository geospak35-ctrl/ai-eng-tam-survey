const STEP_NAMES = ['Section A', 'Section B', 'Section C', 'Section D', 'Demographics'];

export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="progress-container">
      <div className="progress-steps">
        {STEP_NAMES.map((name, i) => (
          <span
            key={name}
            className={i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}
          >
            {name}
          </span>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

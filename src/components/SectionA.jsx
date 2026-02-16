export default function SectionA({ sectionAData, responses, onUpdate }) {
  const handleGate = (categoryId, value) => {
    const current = responses[categoryId] || { uses: null, tools: [], other: '' };
    onUpdate(categoryId, { ...current, uses: value, tools: value ? current.tools : [], other: value ? current.other : '' });
  };

  const handleToolToggle = (categoryId, tool) => {
    const current = responses[categoryId] || { uses: true, tools: [], other: '' };
    const tools = current.tools.includes(tool)
      ? current.tools.filter((t) => t !== tool)
      : [...current.tools, tool];
    onUpdate(categoryId, { ...current, tools });
  };

  const handleOther = (categoryId, value) => {
    const current = responses[categoryId] || { uses: true, tools: [], other: '' };
    onUpdate(categoryId, { ...current, other: value });
  };

  return (
    <div className="survey-section">
      <h2>Section A: AI Tool Usage by Category</h2>
      <p className="section-instruction">
        For each AI category below, indicate whether you use or have experience with tools
        in that category. If yes, select which tools apply.
      </p>

      {sectionAData.categories.map((cat) => {
        const resp = responses[cat.id] || { uses: null, tools: [], other: '' };
        return (
          <div key={cat.id} className="tool-category">
            <h3>{cat.name}</h3>
            <p className="cat-definition">{cat.definition}</p>
            <p className="gate-question">{sectionAData.question}</p>
            <div className="gate-buttons">
              <label>
                <input
                  type="radio"
                  name={`gate-${cat.id}`}
                  checked={resp.uses === true}
                  onChange={() => handleGate(cat.id, true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={`gate-${cat.id}`}
                  checked={resp.uses === false}
                  onChange={() => handleGate(cat.id, false)}
                />
                No
              </label>
            </div>

            {resp.uses && (
              <>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                  Select all that apply:
                </p>
                <div className="tool-checkboxes">
                  {cat.tools.map((tool) => (
                    <label key={tool}>
                      <input
                        type="checkbox"
                        checked={resp.tools.includes(tool)}
                        onChange={() => handleToolToggle(cat.id, tool)}
                      />
                      {tool}
                    </label>
                  ))}
                </div>
                <div className="other-tool-input">
                  <label>Other (please specify):</label>
                  <input
                    type="text"
                    value={resp.other}
                    onChange={(e) => handleOther(cat.id, e.target.value)}
                    placeholder="Enter tool name"
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

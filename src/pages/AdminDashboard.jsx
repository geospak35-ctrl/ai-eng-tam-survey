import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fetchAllData } from '../lib/supabase';
import { getLikertSections, CONSTRUCT_NAMES } from '../data/surveyData';
import {
  descriptiveStats, oneWayAnova, frequencyDistribution,
  aggregateByConstruct, heatmapColor,
} from '../lib/statistics';

const ADMIN_PASSWORD = 'admin2025';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'faculty', 'student', 'practitioner'

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAllData(ADMIN_PASSWORD);
      setData(result);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data
  const filtered = useMemo(() => {
    if (!data) return null;
    if (filter === 'all') return data;
    const respIds = new Set(
      data.respondents.filter((r) => r.stakeholder_type === filter).map((r) => r.id)
    );
    return {
      respondents: data.respondents.filter((r) => respIds.has(r.id)),
      sectionA: data.sectionA.filter((a) => respIds.has(a.respondent_id)),
      likert: data.likert.filter((l) => respIds.has(l.respondent_id)),
    };
  }, [data, filter]);

  // Construct-level aggregation (uses full dataset for cross-group)
  const constructAgg = useMemo(() => {
    if (!data || data.respondents.length === 0) return null;
    return aggregateByConstruct(data.likert, data.respondents, getLikertSections);
  }, [data]);

  // Item-level stats for filtered data
  const itemStats = useMemo(() => {
    if (!filtered) return {};
    const byItem = {};
    for (const row of filtered.likert) {
      if (!byItem[row.item_code]) byItem[row.item_code] = [];
      byItem[row.item_code].push(row.value);
    }
    const result = {};
    for (const [code, values] of Object.entries(byItem)) {
      result[code] = { ...descriptiveStats(values), distribution: frequencyDistribution(values) };
    }
    return result;
  }, [filtered]);

  // Cross-group comparison chart data
  const crossGroupChartData = useMemo(() => {
    if (!constructAgg) return [];
    return Object.entries(CONSTRUCT_NAMES).map(([id, name]) => {
      const agg = constructAgg[id];
      if (!agg) return { name, faculty: 0, student: 0, practitioner: 0 };
      const fMean = agg.faculty.length > 0 ? descriptiveStats(agg.faculty).mean : null;
      const sMean = agg.student.length > 0 ? descriptiveStats(agg.student).mean : null;
      const pMean = agg.practitioner.length > 0 ? descriptiveStats(agg.practitioner).mean : null;
      return {
        name: name.length > 25 ? name.substring(0, 22) + '...' : name,
        fullName: name,
        faculty: fMean ? Number(fMean.toFixed(2)) : 0,
        student: sMean ? Number(sMean.toFixed(2)) : 0,
        practitioner: pMean ? Number(pMean.toFixed(2)) : 0,
      };
    });
  }, [constructAgg]);

  // ANOVA results per construct
  const anovaResults = useMemo(() => {
    if (!constructAgg) return {};
    const results = {};
    for (const [id] of Object.entries(CONSTRUCT_NAMES)) {
      const agg = constructAgg[id];
      if (!agg) continue;
      const groups = {};
      if (agg.faculty.length > 0) groups.faculty = agg.faculty;
      if (agg.student.length > 0) groups.student = agg.student;
      if (agg.practitioner.length > 0) groups.practitioner = agg.practitioner;
      results[id] = oneWayAnova(groups);
    }
    return results;
  }, [constructAgg]);

  // CSV Export
  const exportCSV = () => {
    if (!data) return;
    const rows = [['respondent_id', 'stakeholder_type', 'section', 'item_code', 'value']];
    for (const row of data.likert) {
      const resp = data.respondents.find((r) => r.id === row.respondent_id);
      rows.push([
        row.respondent_id,
        resp?.stakeholder_type || '',
        row.section,
        row.item_code,
        row.value,
      ]);
    }
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-eng-tam-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFullCSV = () => {
    if (!data) return;

    // Build a wide-format CSV with one row per respondent
    const allItemCodes = [...new Set(data.likert.map((l) => l.item_code))].sort();
    const header = ['respondent_id', 'stakeholder_type', 'created_at', ...allItemCodes];
    const rows = [header];

    for (const resp of data.respondents) {
      const respLikert = data.likert.filter((l) => l.respondent_id === resp.id);
      const valueMap = {};
      for (const l of respLikert) {
        valueMap[l.item_code] = l.value;
      }
      rows.push([
        resp.id,
        resp.stakeholder_type,
        resp.created_at || '',
        ...allItemCodes.map((code) => valueMap[code] ?? ''),
      ]);
    }

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-eng-tam-wide-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ===== RENDER =====

  if (!authenticated) {
    return (
      <div className="app-container">
        <div className="admin-login">
          <h2>Admin Dashboard</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Enter the admin password to access survey results.
          </p>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {authError && <p className="access-error">{authError}</p>}
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/">Back to Survey</Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="validation-error">{error}</div>
        <button className="btn btn-primary" onClick={loadData}>Retry</button>
      </div>
    );
  }

  if (!data || data.respondents.length === 0) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>AI-Eng-TAM Admin Dashboard</h1>
        </div>
        <div className="no-data">
          <p>No survey responses yet.</p>
          <p style={{ marginTop: '0.5rem' }}>
            <Link to="/">Go to Survey</Link>
          </p>
        </div>
      </div>
    );
  }

  const counts = {
    total: data.respondents.length,
    faculty: data.respondents.filter((r) => r.stakeholder_type === 'faculty').length,
    student: data.respondents.filter((r) => r.stakeholder_type === 'student').length,
    practitioner: data.respondents.filter((r) => r.stakeholder_type === 'practitioner').length,
  };

  // Get all items for display based on filter
  const displaySections = filter !== 'all' ? getLikertSections(filter) : getLikertSections('faculty');

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>AI-Eng-TAM Admin Dashboard</h1>
        <div className="admin-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Stakeholders</option>
            <option value="faculty">Faculty Only</option>
            <option value="student">Students Only</option>
            <option value="practitioner">Practitioners Only</option>
          </select>
          <button className="btn btn-secondary" onClick={exportCSV}>Export Long CSV</button>
          <button className="btn btn-secondary" onClick={exportFullCSV}>Export Wide CSV</button>
          <button className="btn btn-secondary" onClick={loadData}>Refresh</button>
        </div>
      </div>

      {/* Response Counts */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{counts.total}</div>
          <div className="stat-label">Total Responses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.faculty}</div>
          <div className="stat-label">Faculty</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.student}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.practitioner}</div>
          <div className="stat-label">Practitioners</div>
        </div>
      </div>

      {/* Cross-Group Comparison Chart */}
      <div className="dashboard-panel">
        <h3>Cross-Group Construct Means Comparison</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={crossGroupChartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} />
              <Tooltip
                formatter={(value, name) => [value.toFixed(2), name.charAt(0).toUpperCase() + name.slice(1)]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              />
              <Legend />
              <Bar dataKey="faculty" fill="#3b82f6" name="Faculty" />
              <Bar dataKey="student" fill="#10b981" name="Student" />
              <Bar dataKey="practitioner" fill="#f59e0b" name="Practitioner" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alignment Heatmap */}
      <div className="dashboard-panel">
        <h3>Construct Alignment Heatmap (Mean Scores by Group)</h3>
        <div className="heatmap-container">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th>Construct</th>
                <th>Faculty</th>
                <th>Student</th>
                <th>Practitioner</th>
                <th>ANOVA F</th>
                <th>p-value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CONSTRUCT_NAMES).map(([id, name]) => {
                const agg = constructAgg?.[id];
                const fMean = agg?.faculty.length > 0 ? descriptiveStats(agg.faculty).mean : null;
                const sMean = agg?.student.length > 0 ? descriptiveStats(agg.student).mean : null;
                const pMean = agg?.practitioner.length > 0 ? descriptiveStats(agg.practitioner).mean : null;
                const anova = anovaResults[id];
                return (
                  <tr key={id}>
                    <td className="construct-label">{name}</td>
                    <td style={{ backgroundColor: heatmapColor(fMean), color: '#1f2937' }}>
                      {fMean !== null ? fMean.toFixed(2) : '--'}
                    </td>
                    <td style={{ backgroundColor: heatmapColor(sMean), color: '#1f2937' }}>
                      {sMean !== null ? sMean.toFixed(2) : '--'}
                    </td>
                    <td style={{ backgroundColor: heatmapColor(pMean), color: '#1f2937' }}>
                      {pMean !== null ? pMean.toFixed(2) : '--'}
                    </td>
                    <td>{anova?.F != null ? anova.F.toFixed(3) : '--'}</td>
                    <td style={{ fontWeight: anova?.p != null && anova.p < 0.05 ? 700 : 400 }}>
                      {anova?.p != null ? anova.p.toFixed(4) : '--'}
                      {anova?.p != null && anova.p < 0.05 && ' *'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
            * indicates p &lt; 0.05. F-test and p-values from one-way ANOVA across stakeholder groups.
            Colors: red (low agreement) to green (high agreement).
          </p>
        </div>
      </div>

      {/* Item-Level Descriptive Statistics */}
      <div className="dashboard-panel">
        <h3>Item-Level Descriptive Statistics {filter !== 'all' ? `(${filter})` : '(filtered view)'}</h3>
        {['A', 'B', 'C'].map((secKey) => (
          <div key={secKey} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {displaySections[secKey].title}
            </h4>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>n</th>
                  <th>Mean</th>
                  <th>SD</th>
                  <th>Median</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Distribution (1-7)</th>
                </tr>
              </thead>
              <tbody>
                {displaySections[secKey].constructs.map((construct) =>
                  construct.items.map((item) => {
                    const stats = itemStats[item.code];
                    if (!stats) return null;
                    return (
                      <tr key={item.code}>
                        <td>
                          <strong>{item.code}</strong>
                          <br />
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {item.text.length > 60 ? item.text.substring(0, 57) + '...' : item.text}
                          </span>
                        </td>
                        <td className="numeric">{stats.n}</td>
                        <td className="numeric">{stats.mean.toFixed(2)}</td>
                        <td className="numeric">{stats.sd.toFixed(2)}</td>
                        <td className="numeric">{stats.median.toFixed(1)}</td>
                        <td className="numeric">{stats.min}</td>
                        <td className="numeric">{stats.max}</td>
                        <td className="numeric" style={{ fontSize: '0.75rem' }}>
                          {Object.values(stats.distribution).join(' | ')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
        <Link to="/">Back to Survey</Link>
      </p>
    </div>
  );
}

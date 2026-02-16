import jStat from 'jstat';

// Compute descriptive statistics for an array of numbers
export function descriptiveStats(values) {
  if (!values || values.length === 0) {
    return { n: 0, mean: 0, sd: 0, min: 0, max: 0, median: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  const mean = jStat.mean(values);
  const sd = n > 1 ? jStat.stdev(values, true) : 0; // sample SD
  const min = sorted[0];
  const max = sorted[n - 1];
  const median = jStat.median(values);
  return { n, mean, sd, min, max, median };
}

// One-way ANOVA for comparing means across groups
// groups: { groupName: [values] }
// Returns { F, p, dfBetween, dfWithin }
export function oneWayAnova(groups) {
  const groupNames = Object.keys(groups);
  const groupArrays = groupNames.map((k) => groups[k]).filter((g) => g.length > 0);

  if (groupArrays.length < 2) {
    return { F: null, p: null, dfBetween: 0, dfWithin: 0 };
  }

  const k = groupArrays.length;
  const N = groupArrays.reduce((sum, g) => sum + g.length, 0);

  if (N <= k) {
    return { F: null, p: null, dfBetween: k - 1, dfWithin: 0 };
  }

  const grandMean = groupArrays.flat().reduce((s, v) => s + v, 0) / N;

  // Sum of squares between groups
  let ssBetween = 0;
  for (const g of groupArrays) {
    const gMean = g.reduce((s, v) => s + v, 0) / g.length;
    ssBetween += g.length * Math.pow(gMean - grandMean, 2);
  }

  // Sum of squares within groups
  let ssWithin = 0;
  for (const g of groupArrays) {
    const gMean = g.reduce((s, v) => s + v, 0) / g.length;
    for (const v of g) {
      ssWithin += Math.pow(v - gMean, 2);
    }
  }

  const dfBetween = k - 1;
  const dfWithin = N - k;

  if (dfWithin <= 0) {
    return { F: null, p: null, dfBetween, dfWithin };
  }

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const F = msWithin > 0 ? msBetween / msWithin : 0;

  // p-value from F-distribution
  const p = 1 - jStat.centralF.cdf(F, dfBetween, dfWithin);

  return { F, p, dfBetween, dfWithin };
}

// Compute frequency distribution for Likert values (1-7)
export function frequencyDistribution(values) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  for (const v of values) {
    if (dist[v] !== undefined) dist[v]++;
  }
  return dist;
}

// Get construct-level aggregation
// likertData: array of { respondent_id, item_code, value, section }
// respondents: array of { id, stakeholder_type }
// Returns: { constructId: { faculty: [means], student: [means], practitioner: [means] } }
export function aggregateByConstruct(likertData, respondents, likertSections) {
  // Build respondent -> stakeholder_type map
  const typeMap = {};
  for (const r of respondents) {
    typeMap[r.id] = r.stakeholder_type;
  }

  // Group responses by respondent
  const byRespondent = {};
  for (const row of likertData) {
    if (!byRespondent[row.respondent_id]) byRespondent[row.respondent_id] = {};
    byRespondent[row.respondent_id][row.item_code] = row.value;
  }

  // For each construct, compute per-respondent mean, then group by stakeholder
  const constructIds = new Set();
  const constructItems = {};

  // Collect construct->items mapping from all stakeholder types
  for (const stType of ['faculty', 'student', 'practitioner']) {
    const sections = likertSections(stType);
    for (const secKey of ['A', 'B', 'C']) {
      for (const construct of sections[secKey].constructs) {
        constructIds.add(construct.id);
        if (!constructItems[construct.id]) {
          constructItems[construct.id] = {};
        }
        constructItems[construct.id][stType] = construct.items.map((i) => i.code);
      }
    }
  }

  const result = {};
  for (const cId of constructIds) {
    result[cId] = { faculty: [], student: [], practitioner: [] };
  }

  for (const [respId, responses] of Object.entries(byRespondent)) {
    const stType = typeMap[respId];
    if (!stType) continue;

    for (const cId of constructIds) {
      const itemCodes = constructItems[cId]?.[stType];
      if (!itemCodes) continue;

      const vals = itemCodes.map((code) => responses[code]).filter((v) => v != null);
      if (vals.length > 0) {
        const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
        result[cId][stType].push(mean);
      }
    }
  }

  return result;
}

// Heatmap color based on mean (1-7 scale)
export function heatmapColor(mean) {
  if (mean === null || mean === undefined) return '#f3f4f6';
  // Red (1) -> Yellow (4) -> Green (7)
  const t = (mean - 1) / 6; // 0 to 1
  if (t <= 0.5) {
    // red to yellow
    const r = 220;
    const g = Math.round(80 + t * 2 * 160);
    const b = 60;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // yellow to green
    const r = Math.round(220 - (t - 0.5) * 2 * 160);
    const g = Math.round(200 + (t - 0.5) * 2 * 40);
    const b = 60;
    return `rgb(${r}, ${g}, ${b})`;
  }
}

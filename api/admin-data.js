// Vercel Serverless Function — keeps service_role key server-side
// This runs on Vercel's Node.js runtime, NOT in the browser.

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth: require the same admin password in the Authorization header
  const authHeader = req.headers['x-admin-password'];
  if (authHeader !== 'admin2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Server-side env vars (NOT prefixed with VITE_)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Diagnostic info (no secrets leaked — just shows which vars exist)
    const diag = {
      SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
      VITE_SUPABASE_URL: Boolean(process.env.VITE_SUPABASE_URL),
      SUPABASE_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_KEY),
      VITE_SUPABASE_SERVICE_KEY: Boolean(process.env.VITE_SUPABASE_SERVICE_KEY),
      serviceKeyLength: serviceKey ? serviceKey.length : 0,
    };
    return res.status(500).json({
      error: 'Server misconfigured: missing environment variables. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel Settings > Environment Variables.',
      diagnostics: diag,
    });
  }

  // Diagnostics (safe — only lengths and booleans, no secret values)
  const diag = {
    urlSource: process.env.SUPABASE_URL ? 'SUPABASE_URL' : (process.env.VITE_SUPABASE_URL ? 'VITE_SUPABASE_URL' : 'none'),
    keySource: process.env.SUPABASE_SERVICE_KEY ? 'SUPABASE_SERVICE_KEY' : (process.env.VITE_SUPABASE_SERVICE_KEY ? 'VITE_SUPABASE_SERVICE_KEY' : 'none'),
    urlLength: supabaseUrl.length,
    keyLength: serviceKey.length,
    keyStart: serviceKey.substring(0, 10) + '...',
    keyEnd: '...' + serviceKey.substring(serviceKey.length - 10),
  };

  try {
    // Fetch all rows from a table, paginating in batches to avoid the
    // PostgREST default 1000-row limit.
    const fetchTable = async (table) => {
      const PAGE_SIZE = 1000;
      let allRows = [];
      let offset = 0;
      let done = false;

      while (!done) {
        const url = `${supabaseUrl}/rest/v1/${table}?select=*&order=id&limit=${PAGE_SIZE}&offset=${offset}`;
        const response = await fetch(url, {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            Accept: 'application/json',
            Prefer: 'count=exact',
          },
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.message || `HTTP ${response.status} fetching ${table}`);
        }
        const rows = await response.json();
        allRows = allRows.concat(rows);
        if (rows.length < PAGE_SIZE) {
          done = true;
        } else {
          offset += PAGE_SIZE;
        }
      }

      return allRows;
    };

    const [respondents, sectionA, likert] = await Promise.all([
      fetchTable('respondents'),
      fetchTable('section_a_responses'),
      fetchTable('likert_responses'),
    ]);

    return res.status(200).json({ respondents, sectionA, likert });
  } catch (err) {
    return res.status(500).json({ error: err.message, diagnostics: diag });
  }
}

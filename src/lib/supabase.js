import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Client for survey respondents (anon key, can only insert)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client for admin dashboard (service key, can read all data bypassing RLS)
// Uses anon key for the apikey header but overrides auth with service_role token
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      },
    })
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);
export const isAdminConfigured = () => Boolean(supabaseUrl && supabaseServiceKey);

// ============================================================
// Local storage fallback for development/demo without Supabase
// ============================================================
const LOCAL_KEY = 'ai_eng_tam_responses';

function getLocalResponses() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalResponses(responses) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(responses));
}

// ============================================================
// Data Access Functions
// ============================================================

export async function submitSurvey({ respondent, sectionA, likertResponses }) {
  if (supabase && isSupabaseConfigured()) {
    // Generate UUID client-side so we don't need SELECT permission after insert
    const respondentId = crypto.randomUUID();

    // Insert respondent with the pre-generated ID
    const { error: respError } = await supabase
      .from('respondents')
      .insert({ id: respondentId, ...respondent });

    if (respError) throw respError;

    // Insert Section A responses
    if (sectionA.length > 0) {
      const sectionARows = sectionA.map((a) => ({
        respondent_id: respondentId,
        ...a,
      }));
      const { error: aError } = await supabase
        .from('section_a_responses')
        .insert(sectionARows);
      if (aError) throw aError;
    }

    // Insert Likert responses
    if (likertResponses.length > 0) {
      const likertRows = likertResponses.map((l) => ({
        respondent_id: respondentId,
        ...l,
      }));
      const { error: lError } = await supabase
        .from('likert_responses')
        .insert(likertRows);
      if (lError) throw lError;
    }

    return respondentId;
  }

  // Local storage fallback
  const respondentId = crypto.randomUUID();
  const entry = {
    id: respondentId,
    respondent: { ...respondent, id: respondentId, created_at: new Date().toISOString() },
    sectionA: sectionA.map((a) => ({ ...a, respondent_id: respondentId })),
    likertResponses: likertResponses.map((l) => ({ ...l, respondent_id: respondentId })),
  };
  const all = getLocalResponses();
  all.push(entry);
  saveLocalResponses(all);
  return respondentId;
}

export async function fetchAllData() {
  if (supabaseAdmin && isAdminConfigured()) {
    const [respResult, secAResult, likertResult] = await Promise.all([
      supabaseAdmin.from('respondents').select('*'),
      supabaseAdmin.from('section_a_responses').select('*'),
      supabaseAdmin.from('likert_responses').select('*'),
    ]);

    if (respResult.error) throw respResult.error;
    if (secAResult.error) throw secAResult.error;
    if (likertResult.error) throw likertResult.error;

    return {
      respondents: respResult.data,
      sectionA: secAResult.data,
      likert: likertResult.data,
    };
  }

  // Local fallback
  const all = getLocalResponses();
  return {
    respondents: all.map((e) => e.respondent),
    sectionA: all.flatMap((e) => e.sectionA),
    likert: all.flatMap((e) => e.likertResponses),
  };
}

// ============================================================
// APEX MACHINERY
// SUPABASE SERVER CONFIGURATION
// ============================================================

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';


// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


// ============================================================
// VALIDATION
// ============================================================

if (!supabaseUrl) {
  throw new Error(
    'SUPABASE_URL is missing from backend/.env'
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is missing from backend/.env'
  );
}


// ============================================================
// SUPABASE SERVER CLIENT
// ============================================================
//
// IMPORTANT:
// This client uses the SERVICE ROLE KEY.
//
// NEVER put this key in the React/Vite frontend.
// NEVER create VITE_SUPABASE_SERVICE_ROLE_KEY.
//
// ============================================================

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);


// ============================================================
// EXPORT CONFIG
// ============================================================

export default supabase;
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';


// ============================================================
// APEX MACHINERY
// SUPABASE CONFIGURATION
// ============================================================
//
// IMPORTANT:
//
// supabaseAdmin
//   → privileged backend database/admin operations
//
// supabaseAuth
//   → normal email/password authentication
//
// Keep the SERVICE ROLE KEY on the backend only.
// Never expose it in React/Vite.
// ============================================================


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
// SHARED OPTIONS
// ============================================================

const clientOptions = {

  auth: {

    autoRefreshToken: false,

    persistSession: false,

    detectSessionInUrl: false,

  },

};


// ============================================================
// ADMIN / DATABASE CLIENT
// ============================================================
//
// Use for:
//
// - profiles table
// - admin.createUser()
// - admin.deleteUser()
// - privileged database operations
//
// This client must not be reused for normal user login sessions.
// ============================================================

export const supabaseAdmin =
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    clientOptions
  );


// ============================================================
// AUTH CLIENT
// ============================================================
//
// Use for:
//
// - signInWithPassword()
//
// Keeping this separate prevents authenticated user sessions from
// interfering with privileged database queries.
// ============================================================

export const supabaseAuth =
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    clientOptions
  );


// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================
//
// Existing files importing:
//
// import { supabase } from ...
//
// will still use the privileged admin/database client.
// ============================================================

export const supabase =
  supabaseAdmin;


export default supabaseAdmin;
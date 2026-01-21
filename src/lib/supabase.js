// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpsbxydetlltdhxnhzlv.supabase.co';
const supabaseAnonKey = 'sb_publishable_0Zos5bhVLvhBZ4iRSvimeg_qY7eavGb';

// Create Supabase client without auth persistence (simpler for now)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user ID (works without auth session)
export const getUserId = () => {
  // For demo purposes, use a static user ID
  // In production, you would get this from auth session
  return 'demo-user-id';
};
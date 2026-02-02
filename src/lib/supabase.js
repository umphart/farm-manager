// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpsbxydetlltdhxnhzlv.supabase.co';
const supabaseAnonKey = 'sb_publishable_0Zos5bhVLvhBZ4iRSvimeg_qY7eavGb';

// Create Supabase client with auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Auth helper functions
export const signUpAdmin = async (email, password, username) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'admin'
        }
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signInAdmin = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (session) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      return { user, error: null };
    }
    
    return { user: null, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const isAdminAuthenticated = async () => {
  const { user, error } = await getCurrentUser();
  return !error && user !== null;
};
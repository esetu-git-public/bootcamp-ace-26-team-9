import { supabase } from "./supabaseClient";

// Get current active Supabase session
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Sign out current user
export const signOut = async () => {
  return await supabase.auth.signOut();
};

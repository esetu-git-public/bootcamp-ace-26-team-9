import { supabase } from "../services/supabaseClient";

// Sign in with Supabase email/password authentication
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Sign out from Supabase
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get the current active session
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

// Listen for auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

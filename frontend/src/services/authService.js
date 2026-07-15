import { supabase } from "./supabaseClient";

// Get current active session
export const getSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      localStorage.setItem("token", session.access_token);
      localStorage.setItem("user", JSON.stringify({
        id: session.user.id,
        name: session.user.user_metadata?.display_name || session.user.email,
        email: session.user.email,
        role: "HR Manager",
      }));
      return { session, error: null };
    }
  } catch (e) {
    console.error("Supabase getSession error:", e);
  }
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return { session: { access_token: token, user: JSON.parse(user) }, error: null };
  }
  return { session: null, error: null };
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      localStorage.setItem("token", session.access_token);
      localStorage.setItem("user", JSON.stringify({
        id: session.user.id,
        name: session.user.user_metadata?.display_name || session.user.email,
        email: session.user.email,
        role: "HR Manager",
      }));
      callback(event, session);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      callback(event, null);
    }
  });
  return { data: { subscription } };
};

// Sign out current user
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Supabase signOut error:", e);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { error: null };
};

export const saveAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getAuthUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

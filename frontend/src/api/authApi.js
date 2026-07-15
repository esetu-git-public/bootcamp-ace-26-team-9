import { supabase } from "../services/supabaseClient";

// Sign in with Supabase
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Save token and user info
    localStorage.setItem("token", data.session.access_token);
    localStorage.setItem("user", JSON.stringify({
      id: data.user.id,
      name: data.user.user_metadata?.display_name || data.user.email,
      email: data.user.email,
      role: "HR Manager", // default role
    }));
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error.message || "Invalid email or password" },
    };
  }
};

// Sign out and clear local session
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Supabase signOut error:", error);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { error: null };
};

// Get active session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
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
  } catch (error) {
    console.error("Supabase getSession error:", error);
  }

  // Fallback to local storage
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return { session: { access_token: token, user: JSON.parse(user) }, error: null };
  }
  return { session: null, error: null };
};

// onAuthStateChange listener
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

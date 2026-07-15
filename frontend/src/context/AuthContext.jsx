import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          name: session.user.user_metadata?.display_name || session.user.email,
          email: session.user.email,
          role: "HR Manager",
        }));
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Error getting session:", err);
      setLoading(false);
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          name: session.user.user_metadata?.display_name || session.user.email,
          email: session.user.email,
          role: "HR Manager",
        }));
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSession(null);
    return { error };
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, forgotPassword }}>
      {loading ? (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-slate-300">Loading system session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

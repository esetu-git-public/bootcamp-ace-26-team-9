import api from "./axiosInstance";

// Sign in with local JWT authentication mapped to signIn
export const signIn = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error.response?.data?.detail || "Invalid email or password" },
    };
  }
};

// Sign out and clear local session
export const signOut = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { error: null };
};

// Get local active session
export const getSession = async () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return { session: { access_token: token, user: JSON.parse(user) }, error: null };
  }
  return { session: null, error: null };
};

// Mock onAuthStateChange listener
export const onAuthStateChange = (callback) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const session = token && user ? { access_token: token, user: JSON.parse(user) } : null;
  callback("SIGNED_IN", session);
  return { data: { subscription: { unsubscribe: () => {} } } };
};

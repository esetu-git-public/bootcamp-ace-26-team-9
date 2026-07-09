// Get current active session
export const getSession = async () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return { session: { access_token: token, user: JSON.parse(user) }, error: null };
  }
  return { session: null, error: null };
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const session = token && user ? { access_token: token, user: JSON.parse(user) } : null;
  callback("SIGNED_IN", session);
  return { data: { subscription: { unsubscribe: () => {} } } };
};

// Sign out current user
export const signOut = async () => {
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

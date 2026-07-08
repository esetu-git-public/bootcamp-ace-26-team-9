import axios from "axios";
import { supabase } from "../services/supabaseClient";

// Shared axios instance pointing at the FastAPI backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach Supabase JWT to every request automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Error retrieving Supabase session:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

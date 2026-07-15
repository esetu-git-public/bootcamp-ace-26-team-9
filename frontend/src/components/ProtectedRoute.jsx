import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const token = localStorage.getItem("token") || localStorage.getItem("local_auth_session");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-300">Verifying session...</p>
      </div>
    );
  }

  if (!session && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

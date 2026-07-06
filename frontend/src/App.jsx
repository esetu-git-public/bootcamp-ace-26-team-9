import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PredictionForm from './pages/PredictionForm';
import PredictionResult from './pages/PredictionResult';
import Analytics from './pages/Analytics';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased selection:bg-hr-500 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<PredictionForm />} />
            <Route path="/result" element={<PredictionResult />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

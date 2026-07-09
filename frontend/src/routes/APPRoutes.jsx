import { Routes, Route } from "react-router-dom";

// Authentication Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

// Main Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Prediction from "../pages/Prediction/Prediction";
import Employees from "../pages/Employees/Employees";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Main Application */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/prediction" element={<Prediction />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-3xl font-bold">
            404 | Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
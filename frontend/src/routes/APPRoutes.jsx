import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Prediction from "../pages/Prediction/Prediction";
import Employees from "../pages/Employees/Employees";
import Analytics from "../pages/Analytics/Analytics";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Prediction */}
        <Route path="/prediction" element={<Prediction />} />

        {/* Employees */}
        <Route path="/employees" element={<Employees />} />

        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import ThreatDetection from "../pages/Threats/ThreatDetection";
import Prediction from "../pages/Predictions/Prediction";
import CloudMonitoring from "../pages/Cloud/CloudMonitoring";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="threats" element={<ThreatDetection />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="cloud" element={<CloudMonitoring />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
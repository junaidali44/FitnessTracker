import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutForm from './pages/WorkoutForm';
import Nutrition from './pages/Nutrition';
import NutritionForm from './pages/NutritionForm';
import Progress from './pages/Progress';
import ProgressForm from './pages/ProgressForm';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminFeedback from './pages/Admin/AdminFeedback';

export default function App() {
  return (
    <Routes>
      {/* Landing — public, shown first to everyone */}
      <Route path="/" element={<Landing />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/new" element={<WorkoutForm />} />
          <Route path="/workouts/edit/:id" element={<WorkoutForm />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/nutrition/new" element={<NutritionForm />} />
          <Route path="/nutrition/edit/:id" element={<NutritionForm />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/progress/new" element={<ProgressForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
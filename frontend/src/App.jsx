import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public
import Landing from './pages/public/Landing';

// User pages
import Dashboard from './pages/user/Dashboard.jsx';
import Workouts from './pages/user/Workouts.jsx';
import WorkoutForm from './pages/user/WorkoutForm.jsx';
import Nutrition from './pages/user/Nutrition.jsx';
import NutritionForm from './pages/user/NutritionForm.jsx';
import Progress from './pages/user/Progress.jsx';
import ProgressForm from './pages/user/ProgressForm.jsx';
import Notifications from './pages/user/Notifications.jsx';
import Settings from './pages/user/Settings.jsx';
import Feedback from './pages/user/Feedback.jsx';
import Profile from './pages/user/Profile.jsx';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminFeedback from './pages/admin/AdminFeedback.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected — user */}
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

      {/* Protected — admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
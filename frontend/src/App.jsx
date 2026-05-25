import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicShell from './components/layouts/PublicShell';
import DashboardShell from './components/layouts/DashboardShell';
import AdminShell from './components/layouts/AdminShell';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import InventoryPage from './pages/InventoryPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children, roles, redirectTo = '/user' }) {
  const { user, token, ready } = useAuth();

  if (!ready) {
    return <div className="min-h-screen grid place-items-center" style={{ color: 'var(--primary)' }}>Loading secure workspace...</div>;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (roles?.length && (!user || !roles.includes(user.role))) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['user']} redirectTo="/admin">
            <DashboardShell />
          </ProtectedRoute>
        }
      >
        <Route path="/user" element={<UserDashboardPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['admin']} redirectTo="/user">
            <AdminShell />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/appointments" element={<AppointmentsPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

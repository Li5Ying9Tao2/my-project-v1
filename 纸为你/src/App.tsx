import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import FeedbackListPage from './pages/admin/FeedbackListPage';
import FeedbackDetailPage from './pages/admin/FeedbackDetailPage';
import SensorMonitorPage from './pages/admin/SensorMonitorPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import VisitorLayout from './components/layout/VisitorLayout';
import MapPage from './pages/visitor/MapPage';
import BuildingDetailPage from './pages/visitor/BuildingDetailPage';
import MyFeedbackPage from './pages/visitor/MyFeedbackPage';
import FeedbackSubmitPage from './pages/visitor/FeedbackSubmitPage';
import VisitorNotificationsPage from './pages/visitor/NotificationsPage';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { role, isLoggedIn } = useAppStore();
  if (!isLoggedIn || role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="feedback" element={<FeedbackListPage />} />
        <Route path="feedback/:id" element={<FeedbackDetailPage />} />
        <Route path="sensor-monitor" element={<SensorMonitorPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route
        path="/visitor"
        element={
          <ProtectedRoute allowedRole="visitor">
            <VisitorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MapPage />} />
        <Route path="building/:id" element={<BuildingDetailPage />} />
        <Route path="my-feedback" element={<MyFeedbackPage />} />
        <Route path="feedback/:toiletId" element={<FeedbackSubmitPage />} />
        <Route path="notifications" element={<VisitorNotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
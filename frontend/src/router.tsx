import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import UserLoginPage from './pages/UserLoginPage';
import RegisterPage from './pages/RegisterPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import JobListPage from './pages/admin/JobListPage';
import JobFormPage from './pages/admin/JobFormPage';
import JobApplicationsPage from './pages/admin/JobApplicationsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/my-applications" element={<MyApplicationsPage />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute requiredRole="ADMIN" loginPath="/admin/login" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="jobs" element={<JobListPage />} />
            <Route path="jobs/new" element={<JobFormPage />} />
            <Route path="jobs/:id/edit" element={<JobFormPage />} />
            <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

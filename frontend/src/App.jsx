import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import AdminLogin from './pages/auth/AdminLogin';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import JobListing from './pages/student/JobListing';
import JobDetailPage from './pages/student/JobDetailPage';
import MyApplications from './pages/student/MyApplications';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageJobs from './pages/admin/ManageJobs';
import JobFormPage from './pages/admin/JobFormPage';
import ApplicantsPage from './pages/admin/ApplicantsPage';

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<StudentLogin />} />
    <Route path="/register" element={<StudentRegister />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Student portal */}
    <Route element={<ProtectedRoute allowedRole="student" />}>
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Route>
    </Route>

    {/* Admin portal */}
    <Route element={<ProtectedRoute allowedRole="admin" />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/jobs/new" element={<JobFormPage />} />
        <Route path="/admin/jobs/:id/edit" element={<JobFormPage />} />
        <Route path="/admin/jobs/:jobId/applicants" element={<ApplicantsPage />} />
      </Route>
    </Route>

    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;

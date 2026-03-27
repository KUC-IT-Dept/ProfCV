import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfileBuilderPage from './pages/teacher/ProfileBuilderPage';
import CVExportPage from './pages/teacher/CVExportPage';
import PublicProfilePage from './pages/teacher/PublicProfilePage';
import DirectoryPage from './pages/shared/DirectoryPage';
import ManagerialExportPage from './pages/shared/ManagerialExportPage';
import HierarchyGraphPage from './pages/shared/HierarchyGraphPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public — no auth required */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/p/:userId" element={<PublicProfilePage />} />

      {/* Protected — all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Teacher-only */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <MainLayout>
              <ProfileBuilderPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cv-export"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <MainLayout>
              <CVExportPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* HOD / VC / SUPERADMIN */}
      <Route
        path="/directory"
        element={
          <ProtectedRoute allowedRoles={['HOD', 'VC', 'SUPERADMIN']}>
            <MainLayout>
              <DirectoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/managerial-export"
        element={
          <ProtectedRoute allowedRoles={['HOD', 'VC', 'SUPERADMIN']}>
            <MainLayout>
              <ManagerialExportPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hierarchy"
        element={
          <ProtectedRoute allowedRoles={['HOD', 'VC', 'SUPERADMIN']}>
            <MainLayout>
              <HierarchyGraphPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

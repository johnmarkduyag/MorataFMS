import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NotFoundPage } from './components/layout/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, GuestRoute, ProtectedRoute, RoleRedirect } from './features/auth';
import { AuthPage } from './features/auth/components/AuthPage';
import { Documents, ExportList, ImportList, MainLayout, Profile, TrackingDashboard, TrackingDetails } from './features/tracking';
import { AdminDashboard } from './features/tracking/components/AdminDashboard';
import { UserManagement, ClientManagement, TransactionOversight, ReportsAnalytics, AuditLogs } from './features/admin';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<AuthPage />} />
          </Route>

          {/* Employee-only routes (encoder, broker, supervisor, manager) */}
          <Route element={<ProtectedRoute allowedRoles={['encoder', 'broker', 'supervisor', 'manager']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<TrackingDashboard />} />
              <Route path="/imports" element={<ImportList />} />
              <Route path="/exports" element={<ExportList />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/tracking/:referenceId" element={<TrackingDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/clients" element={<ClientManagement />} />
              <Route path="/admin/transactions" element={<TransactionOversight />} />
              <Route path="/admin/reports" element={<ReportsAnalytics />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Smart redirect based on role */}
          <Route path="/" element={<RoleRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
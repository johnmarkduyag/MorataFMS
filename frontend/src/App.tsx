import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NotFoundPage } from './components/NotFoundPage';
import { AuthProvider, GuestRoute, ProtectedRoute } from './features/auth';
import { AuthPage } from './features/auth/components/AuthPage';
import { ThemeProvider } from './context/ThemeContext';
import { Documents, ExportList, ImportList, MainLayout, Profile, TrackingDetails } from './features/tracking';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Guest-only routes (redirect to dashboard if already logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </Route>

          {/* Protected routes (redirect to login if not authenticated) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<ImportList />} />
              <Route path="/export" element={<ExportList />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tracking/:referenceId" element={<TrackingDetails />} />
            </Route>
          </Route>

          {/* Default redirects & 404 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
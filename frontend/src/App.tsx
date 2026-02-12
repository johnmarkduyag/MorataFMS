import { Navigate, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import { Toaster } from 'sonner';
import { NotFoundPage } from './components/NotFoundPage';
import { AuthProvider, GuestRoute, ProtectedRoute } from './features/auth';
import { AuthPage } from './features/auth/components/AuthPage';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Public Routes */}
        {/* Note: We use 404 masking (GitHub style) instead of explicit 403 pages */}

        {/* Default redirects & 404 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
=======
import { AuthProvider } from './features/auth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './features/auth/components/AuthPage';
import { Documents, ExportList, ImportList, MainLayout, Profile, TrackingDetails } from './features/tracking';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Tracking Routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<ImportList />} />
            <Route path="/export" element={<ExportList />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tracking/:referenceId" element={<TrackingDetails />} />
          </Route>

          {/* Redirect root ("/") to login for now */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
>>>>>>> testing
  );
}

export default App;
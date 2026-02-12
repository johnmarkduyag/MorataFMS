import { Navigate, Route, Routes } from 'react-router-dom';
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
  );
}

export default App;
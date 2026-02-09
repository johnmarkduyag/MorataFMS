import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/components/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect root ("/") to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* TODO: Add dashboard and other protected routes */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
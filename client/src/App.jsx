import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Signup from './pages/Signup';
import Setup2FA from './pages/Setup2FA';
import Login from './pages/Login';
import VerifyLoginOTP from './pages/VerifyLoginOTP';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/setup-2fa" element={<Setup2FA />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-login-otp" element={<VerifyLoginOTP />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

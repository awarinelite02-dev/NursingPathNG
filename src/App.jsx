import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ExamInterface from './components/Student/ExamInterface';

const BG = '#0d1f2d';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', backgroundColor:BG, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:48, height:48, border:'4px solid #1e3a50', borderTop:'4px solid #2dd4bf', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && userData?.role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const { isAuthenticated, userData } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/exam/:sessionId" element={<ProtectedRoute requiredRole="student"><ExamInterface /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={
        isAuthenticated
          ? <Navigate to={userData?.role === 'admin' ? '/admin' : '/dashboard'} replace />
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

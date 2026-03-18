import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import ArchivePage from './pages/ArchivePage';
import UserManagement from './pages/UserManagement';
import { authService } from './services/api';

function ProtectedRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {!isAuthPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:catName"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archive"
            element={
              <ProtectedRoute>
                <ArchivePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

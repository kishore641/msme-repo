import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerDashboard from './pages/WorkerDashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import AdminDashboard from './pages/AdminDashboard';
import React from 'react';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
}

function AppShell() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboard = ['/worker', '/enterprise', '/admin-panel'].some(p => location.pathname.startsWith(p));

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/worker/*" element={
        <ProtectedRoute allowedRole="WORKER"><WorkerDashboard /></ProtectedRoute>
      } />
      <Route path="/enterprise/*" element={
        <ProtectedRoute allowedRole="ENTERPRISE"><EnterpriseDashboard /></ProtectedRoute>
      } />
      <Route path="/admin-panel/*" element={
        <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  );

  // Auth pages & Dashboards: render without shared header
  if (isAuthPage || isDashboard) {
    return <div className="min-h-screen">{routes}</div>;
  }

  // Pure Landing (Home) Page: render without container constraints
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {routes}
    </div>
  );
}

function App() {
  return (
    <Router basename="/">
      <AppShell />
    </Router>
  );
}

export default App;

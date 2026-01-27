import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PublicLayout, AdminLayout } from './components/Layout';

// Pages
import Home from './pages/public/Home';
import PPDB from './pages/public/PPDB';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageBerita from './pages/admin/ManageBerita';

// Placeholders for components not fully detailed in this constrained response but necessary for routing structure
const Placeholder = ({ title }: { title: string }) => (
  <div className="container mx-auto p-12 text-center">
    <h1 className="text-2xl font-bold text-gray-400 dark:text-gray-500">{title}</h1>
    <p className="text-gray-600 dark:text-gray-400">Halaman sedang dalam pengembangan.</p>
  </div>
);

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  return session ? <AdminLayout><Outlet /></AdminLayout> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/ppdb" element={<PublicLayout><PPDB /></PublicLayout>} />
            <Route path="/berita" element={<PublicLayout><Placeholder title="Arsip Berita" /></PublicLayout>} />
            <Route path="/jurusan" element={<PublicLayout><Placeholder title="Daftar Jurusan" /></PublicLayout>} />
            <Route path="/kontak" element={<PublicLayout><Placeholder title="Hubungi Kami" /></PublicLayout>} />
            
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="berita" element={<ManageBerita />} />
              <Route path="ppdb" element={<Placeholder title="Kelola Data Pendaftar" />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
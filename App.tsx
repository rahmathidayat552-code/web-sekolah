import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import { PublicLayout, AdminLayout } from './components/Layout';

// Pages - Public
import Home from './pages/public/Home';
import PPDB from './pages/public/PPDB';
import PublicBerita from './pages/public/PublicBerita';
import PublicJurusan from './pages/public/PublicJurusan';
import PublicKontak from './pages/public/PublicKontak';

// Pages - Auth & Setup
import Login from './pages/Login';
import Setup from './pages/Setup';

// Pages - Admin
import Dashboard from './pages/admin/Dashboard';
import ManageBerita from './pages/admin/ManageBerita';
import ManageIdentitas from './pages/admin/ManageIdentitas';
import ManagePengumuman from './pages/admin/ManagePengumuman';
import ManageJurusan from './pages/admin/ManageJurusan';
import ManageGuru from './pages/admin/ManageGuru';
import ManageGaleri from './pages/admin/ManageGaleri';
import ManagePesan from './pages/admin/ManagePesan';
import ManagePPDB from './pages/admin/ManagePPDB';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMedsos from './pages/admin/ManageMedsos';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  return session ? <AdminLayout><Outlet /></AdminLayout> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/ppdb" element={<PublicLayout><PPDB /></PublicLayout>} />
              <Route path="/berita" element={<PublicLayout><PublicBerita /></PublicLayout>} />
              <Route path="/jurusan" element={<PublicLayout><PublicJurusan /></PublicLayout>} />
              <Route path="/kontak" element={<PublicLayout><PublicKontak /></PublicLayout>} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/setup" element={<Setup />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="identitas" element={<ManageIdentitas />} />
                <Route path="medsos" element={<ManageMedsos />} />
                <Route path="berita" element={<ManageBerita />} />
                <Route path="pengumuman" element={<ManagePengumuman />} />
                <Route path="jurusan" element={<ManageJurusan />} />
                <Route path="guru" element={<ManageGuru />} />
                <Route path="ppdb" element={<ManagePPDB />} />
                <Route path="galeri" element={<ManageGaleri />} />
                <Route path="pesan" element={<ManagePesan />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

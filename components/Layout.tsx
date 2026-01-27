import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, LayoutDashboard, FileText, Users, LogOut, School, Phone, Home, Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "text-secondary font-bold" 
    : "text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <School className="h-8 w-8 text-secondary" />
              <span className="font-bold text-xl text-primary dark:text-white tracking-tight">SMK TEKNO</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>Beranda</Link>
              <Link to="/berita" className={isActive('/berita')}>Berita</Link>
              <Link to="/jurusan" className={isActive('/jurusan')}>Jurusan</Link>
              <Link to="/ppdb" className={isActive('/ppdb')}>PPDB</Link>
              <Link to="/kontak" className={isActive('/kontak')}>Kontak</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
               <ThemeToggle />
               <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-blue-600 rounded-md transition-colors shadow-lg shadow-blue-500/20">
                 Login Admin
               </Link>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button 
                className="p-2 text-gray-700 dark:text-gray-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
            <Link to="/berita" className="block py-2 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Berita</Link>
            <Link to="/jurusan" className="block py-2 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>Jurusan</Link>
            <Link to="/ppdb" className="block py-2 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>PPDB</Link>
            <Link to="/login" className="block py-2 font-bold text-secondary" onClick={() => setIsMobileMenuOpen(false)}>Login Admin</Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-primary dark:bg-slate-950 text-white pt-12 pb-6 border-t dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <School className="h-6 w-6 text-accent" />
                 <span className="font-bold text-lg">SMK TEKNO</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mewujudkan generasi emas yang berkompeten, berkarakter, dan siap kerja di era industri 4.0.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-accent">Navigasi</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/berita" className="hover:text-white transition-colors">Berita Sekolah</Link></li>
                <li><Link to="/ppdb" className="hover:text-white transition-colors">Info PPDB</Link></li>
                <li><Link to="/jurusan" className="hover:text-white transition-colors">Program Keahlian</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-accent">Kontak</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Phone size={14}/> (021) 1234-5678</li>
                <li className="flex items-center gap-2"><Home size={14}/> Jl. Pendidikan No. 1, Kota Tekno</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SMK TEKNO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/berita', label: 'Kelola Berita', icon: FileText },
    { path: '/admin/ppdb', label: 'Data PPDB', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkbg flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-primary dark:bg-slate-900 text-white hidden md:flex flex-col fixed h-full border-r dark:border-slate-800">
        <div className="p-6 border-b border-gray-700 dark:border-slate-800">
          <div className="font-bold text-xl tracking-wide flex items-center gap-2">
            <School className="text-secondary" /> PANEL ADMIN
          </div>
          <div className="text-xs text-gray-400 mt-2">Login as: {user?.email}</div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-secondary text-white shadow-lg shadow-blue-900/20' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 dark:border-slate-800 flex justify-between items-center">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 p-4 md:hidden flex justify-between items-center sticky top-0 z-40">
           <span className="font-bold text-primary dark:text-white">Admin Panel</span>
           <div className="flex items-center gap-3">
             <ThemeToggle />
             <button onClick={signOut} className="text-red-500"><LogOut size={20} /></button>
           </div>
        </header>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
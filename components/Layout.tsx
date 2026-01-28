import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getIdentitasSekolah } from '../services/api';
import { IdentitasSekolah } from '../types';
import { 
  Menu, X, LayoutDashboard, FileText, Users, LogOut, School, Phone, Home, Sun, Moon,
  BookOpen, UserCheck, Megaphone, Image, Mail, Settings, UserCog, Share2
} from 'lucide-react';

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
  const [identitas, setIdentitas] = useState<IdentitasSekolah | null>(null);

  useEffect(() => {
    getIdentitasSekolah().then(setIdentitas).catch(console.error);
  }, []);

  const isActive = (path: string) => location.pathname === path 
    ? "text-secondary font-bold" 
    : "text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary";

  const schoolName = identitas?.nama_sekolah || "WEB SEKOLAH";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              {identitas?.logo_sekolah ? (
                <img src={identitas.logo_sekolah} alt="Logo" className="h-8 w-8 object-contain" />
              ) : (
                <School className="h-8 w-8 text-secondary" />
              )}
              <span className="font-bold text-xl text-primary dark:text-white tracking-tight uppercase">
                {schoolName}
              </span>
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
                 {identitas?.logo_sekolah ? (
                    <img src={identitas.logo_sekolah} alt="Logo" className="h-6 w-6 object-contain" />
                 ) : (
                    <School className="h-6 w-6 text-accent" />
                 )}
                 <span className="font-bold text-lg uppercase">{schoolName}</span>
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
                <li className="flex items-center gap-2">
                    <Phone size={14}/> 
                    {identitas?.no_tlp || '(021) 1234-5678'}
                </li>
                <li className="flex items-center gap-2">
                    <Mail size={14}/> 
                    {identitas?.email || 'info@sekolah.sch.id'}
                </li>
                <li className="flex items-center gap-2">
                    <Home size={14}/> 
                    {identitas?.alamat || 'Alamat Sekolah Belum Diatur'}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {schoolName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [identitas, setIdentitas] = useState<IdentitasSekolah | null>(null);

  useEffect(() => {
    getIdentitasSekolah().then(setIdentitas).catch(console.error);
  }, []);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/identitas', label: 'Identitas Sekolah', icon: Settings },
    { path: '/admin/medsos', label: 'Data Medsos', icon: Share2 },
    { path: '/admin/berita', label: 'Berita & Artikel', icon: FileText },
    { path: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
    { path: '/admin/jurusan', label: 'Jurusan', icon: BookOpen },
    { path: '/admin/guru', label: 'Guru & Staff', icon: UserCheck },
    { path: '/admin/ppdb', label: 'Data PPDB', icon: Users },
    { path: '/admin/galeri', label: 'Galeri Foto', icon: Image },
    { path: '/admin/pesan', label: 'Pesan Masuk', icon: Mail },
    { path: '/admin/users', label: 'Pengaturan User', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkbg flex transition-colors duration-300">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-primary dark:bg-slate-900 text-white flex flex-col h-full border-r dark:border-slate-800 transition-transform duration-300 shadow-xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-700 dark:border-slate-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-xl tracking-wide flex items-center gap-2">
               {identitas?.logo_sekolah ? (
                <img src={identitas.logo_sekolah} alt="Logo" className="h-6 w-6 object-contain" />
              ) : (
                <School className="text-secondary" /> 
              )}
              <span>PANEL ADMIN</span>
            </div>
            <div className="text-xs text-gray-400 mt-2 truncate max-w-[180px]">
              {identitas?.nama_sekolah || 'WEB SEKOLAH'}
            </div>
            <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
              {user?.email}
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-secondary text-white shadow-lg shadow-blue-900/20 font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 dark:border-slate-800 flex justify-between items-center bg-primary dark:bg-slate-900">
          <ThemeToggle />
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 p-4 md:hidden flex justify-between items-center sticky top-0 z-40">
           <button 
             onClick={() => setIsSidebarOpen(true)} 
             className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg"
           >
             <Menu size={24} />
           </button>
           <span className="font-bold text-primary dark:text-white">Admin Panel</span>
           <div className="w-8"></div> {/* Spacer for alignment */}
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

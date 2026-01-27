import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, UserPlus } from 'lucide-react';
import { useToast } from '../components/Toast';

const Setup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengirim metadata (nama, role) langsung ke Auth.
      // Trigger database akan otomatis membuat row di tabel 'profiles'.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: nama,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        showToast('Admin berhasil dibuat! Mengalihkan ke login...', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
         // Fallback cek login jika user object null (edge case)
         const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
         if (signInData.user) {
             showToast('Admin sudah ada. Silakan login.', 'success');
             setTimeout(() => navigate('/login'), 2000);
         } else {
             throw new Error("Gagal registrasi. Silakan cek email konfirmasi jika diperlukan.");
         }
      }
    } catch (err: any) {
      console.error(err);
      let errorText = err.message || 'Terjadi kesalahan saat setup.';
      
      if (err.message && err.message.includes('violates row-level security policy')) {
          errorText = "DATABASE ERROR: RLS Policy. Pastikan Anda sudah menjalankan file 'supabase_setup.sql' di Dashboard Supabase.";
      }
      
      showToast(errorText, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkbg flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-red-500 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Setup Admin</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Buat akun Admin pertama untuk sistem.</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-700 dark:text-yellow-200">
              <p className="mb-1 font-bold">Penting:</p>
              <p>Halaman ini hanya digunakan untuk pembuatan akun Admin pertama kali. Pastikan database Supabase sudah di-setup dengan benar.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition"
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Administrator Sekolah"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@sekolah.sch.id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 font-medium mt-4"
          >
            {loading ? 'Memproses...' : <><UserPlus size={18} /> Buat Akun Admin</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
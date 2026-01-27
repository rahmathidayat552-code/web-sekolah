import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const Setup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Sign Up User ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert Profile dengan Role Admin
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            nama: nama,
            role: 'admin'
          });

        if (profileError) {
            // Jika profile gagal (mungkin karena trigger otomatis sudah membuat profile), coba update
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    nama: nama,
                    role: 'admin'
                });
            if (updateError) throw updateError;
        }

        setMessage({ type: 'success', text: 'Admin berhasil dibuat! Silakan login.' });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat setup.' });
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
            <p className="text-xs text-yellow-700 dark:text-yellow-200">
              Halaman ini hanya untuk inisialisasi awal. Hapus akses ke halaman ini atau matikan route-nya di <code>App.tsx</code> setelah admin dibuat untuk keamanan.
            </p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Administrator"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
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
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {loading ? 'Mendaftarkan...' : 'Buat Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
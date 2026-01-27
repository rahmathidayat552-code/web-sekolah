import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { useToast } from '../components/Toast';

const Login: React.FC = () => {
  // Pre-filled credentials for development ease
  const [email, setEmail] = useState('admin@sekolah.sch.id');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;

      if (data.user) {
        showToast('Login berhasil! Selamat datang.', 'success');
        navigate('/admin');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Email atau password salah.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkbg flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="bg-blue-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-secondary h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h1>
          <p className="text-gray-500 dark:text-gray-400">Masuk untuk mengelola website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-2.5 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? 'Memproses...' : <><LogIn size={18} /> Masuk</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
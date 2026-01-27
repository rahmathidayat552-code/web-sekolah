import React, { useEffect, useState } from 'react';
import { getAllProfiles, updateProfile, deleteProfile } from '../../services/api';
import { Profile } from '../../types';
import { UserCog, Trash, Search, Edit, AlertTriangle, X, Shield, User, Save } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../contexts/AuthContext';

const ManageUsers: React.FC = () => {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [list, setList] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [editingItem, setEditingItem] = useState<Profile | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Edit Form State
  const [form, setForm] = useState({
    nama: '',
    role: 'operator' as 'admin' | 'operator'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllProfiles();
      setList(data);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data pengguna.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: Profile) => {
    setEditingItem(item);
    setForm({
      nama: item.nama,
      role: item.role
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await updateProfile(editingItem.id, {
        nama: form.nama,
        role: form.role
      });
      showToast('Profil pengguna berhasil diperbarui.', 'success');
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal memperbarui pengguna.', 'error');
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProfile(deleteId);
      showToast('Pengguna berhasil dihapus dari sistem.', 'success');
      // Update list locally
      setList(prev => prev.filter(item => item.id !== deleteId));
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus pengguna.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredList = list.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       {/* HEADER */}
       <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <UserCog size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan Pengguna</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola akses dan role admin/operator.</p>
          </div>
        </div>
        <div className="hidden md:block bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200 text-xs px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-xs">
            <p>Untuk menambah user baru, silakan gunakan halaman Registrasi di awal atau minta user mendaftar via menu Setup.</p>
        </div>
      </div>

       {/* SEARCH */}
       <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="relative w-full md:w-96">
             <input 
                type="text" 
                placeholder="Cari Nama Pengguna..." 
                className="pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-secondary outline-none w-full transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
        <button onClick={loadData} className="text-secondary hover:underline text-sm font-medium">Refresh Data</button>
      </div>

      {/* LIST TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                    <tr>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Nama Pengguna</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Role</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Bergabung</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                    {filteredList.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 dark:text-gray-100">
                                            {item.nama}
                                            {item.id === currentUser?.id && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Anda</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">ID: {item.id.substring(0, 8)}...</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize
                                    ${item.role === 'admin' 
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}
                                `}>
                                    {item.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                    {item.role}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" 
                                        title="Edit Role/Nama"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    {item.id !== currentUser?.id && (
                                        <button 
                                            onClick={() => openDeleteModal(item.id)} 
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" 
                                            title="Hapus User"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredList.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                Tidak ada data pengguna.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* EDIT MODAL */}
       {editingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEditingItem(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border dark:border-slate-700 transform transition-all scale-100"
              onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Pengguna</h3>
                    <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                        <input 
                            required
                            className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.nama} 
                            onChange={e => setForm({...form, nama: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role (Hak Akses)</label>
                        <select 
                            className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition"
                            value={form.role}
                            onChange={e => setForm({...form, role: e.target.value as 'admin' | 'operator'})}
                        >
                            <option value="operator">Operator (Terbatas)</option>
                            <option value="admin">Admin (Akses Penuh)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            *Admin memiliki akses penuh ke sistem. Operator mungkin memiliki batasan (sesuai kebijakan).
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setEditingItem(null)}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 font-medium flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border dark:border-slate-700 transform transition-all scale-100"
              onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Pengguna?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Pengguna ini akan kehilangan akses ke profil aplikasi (namun akun login mungkin perlu dihapus manual di database Supabase Auth).
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition"
                            onClick={() => setDeleteId(null)}
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition"
                            onClick={handleConfirmDelete}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
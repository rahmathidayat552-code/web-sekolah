import React, { useEffect, useState } from 'react';
import { getAllPengumuman, createPengumuman, updatePengumuman, deletePengumuman } from '../../services/api';
import { Pengumuman } from '../../types';
import { Plus, Trash, Edit, X, AlertTriangle, Megaphone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManagePengumuman: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // State untuk kontrol Edit & Hapus
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // State Form
  const [form, setForm] = useState({
    judul: '',
    isi: '',
    tanggal_mulai: new Date().toISOString().split('T')[0],
    tanggal_selesai: '',
    status: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllPengumuman();
      setList(data);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data pengumuman.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({
      judul: '',
      isi: '',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: '',
      status: true
    });
  };

  const handleEdit = (item: Pengumuman) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      isi: item.isi,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai || '',
      status: item.status
    });
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePengumuman(deleteId);
      showToast('Pengumuman berhasil dihapus.', 'success');
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus pengumuman.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Pengumuman> = {
        judul: form.judul,
        isi: form.isi,
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai || null,
        status: form.status
      };

      if (editingId) {
        await updatePengumuman(editingId, payload);
        showToast('Pengumuman berhasil diperbarui!', 'success');
      } else {
        await createPengumuman(payload);
        showToast('Pengumuman berhasil dibuat!', 'success');
      }
      
      handleReset();
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan pengumuman.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <Megaphone size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengumuman</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Informasi penting untuk warga sekolah.</p>
          </div>
        </div>
        
        {!isCreating && (
          <button 
            onClick={() => {
                handleReset();
                setIsCreating(true);
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
          >
            <Plus size={18} /> Tambah Pengumuman
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700 animation-slide-down">
          <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-4">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
            </h2>
            <button onClick={handleReset} className="text-gray-500 hover:text-red-500 transition-colors">
                <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Judul Pengumuman</label>
              <input 
                required
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.judul} 
                onChange={(e) => setForm({...form, judul: e.target.value})}
                placeholder="Contoh: Libur Nasional..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                    <input 
                        type="date"
                        required
                        className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                        value={form.tanggal_mulai} 
                        onChange={(e) => setForm({...form, tanggal_mulai: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal Selesai (Opsional)</label>
                    <input 
                        type="date"
                        className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                        value={form.tanggal_selesai} 
                        onChange={(e) => setForm({...form, tanggal_selesai: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Kosongkan jika berlaku selamanya.</p>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Isi Pengumuman</label>
              <textarea 
                required
                rows={4}
                className="w-full border dark:border-slate-600 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.isi} 
                onChange={(e) => setForm({...form, isi: e.target.value})}
                placeholder="Tulis detail pengumuman..."
              />
            </div>

            <div className="flex items-center gap-4 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <button
                    type="button"
                    onClick={() => setForm({ ...form, status: !form.status })}
                    className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-slate-900
                        ${form.status ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-600'}
                    `}
                >
                    <span
                        className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${form.status ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                </button>
                <span className={`text-sm font-medium ${form.status ? 'text-green-600' : 'text-gray-500'}`}>
                    {form.status ? 'Aktif (Ditampilkan)' : 'Tidak Aktif (Disembunyikan)'}
                </span>
            </div>

            <div className="flex gap-3 pt-4 border-t dark:border-slate-700">
                <button 
                    type="button" 
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-secondary text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-medium"
                >
                    {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Terbitkan Pengumuman')}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                    <tr>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Judul Pengumuman</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Periode</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Status</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                    {list.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                            <td className="p-4">
                                <div className="font-bold text-gray-800 dark:text-gray-100">{item.judul}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.isi}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-secondary" />
                                    <span>{new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}</span>
                                    {item.tanggal_selesai && (
                                        <>
                                            <span className="text-gray-400">-</span>
                                            <span>{new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}</span>
                                        </>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    item.status 
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                }`}>
                                    {item.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {item.status ? 'Aktif' : 'Non-Aktif'}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" 
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => openDeleteModal(item.id)} 
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" 
                                        title="Hapus"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {list.length === 0 && (
                         <tr>
                            <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-full">
                                        <Megaphone className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p>Belum ada pengumuman dibuat.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>

       {/* Delete Confirmation Modal */}
       {deleteId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setDeleteId(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border dark:border-slate-700 transform transition-all scale-100"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Pengumuman?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
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
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManagePengumuman;
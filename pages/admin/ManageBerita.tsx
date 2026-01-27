import React, { useEffect, useState } from 'react';
import { getAllBerita, createBerita, updateBerita, deleteBerita, uploadFile } from '../../services/api';
import { Berita } from '../../types';
import { Plus, Trash, Edit, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast';

const ManageBerita: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk kontrol Modal & Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    judul: '',
    konten: '',
    status: 'draft',
    thumbnail: ''
  });

  useEffect(() => {
    loadBerita();
  }, []);

  const loadBerita = async () => {
    try {
      const data = await getAllBerita();
      setBeritaList(data);
    } catch (error) {
      showToast('Gagal memuat berita.', 'error');
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({ judul: '', konten: '', status: 'draft', thumbnail: '' });
  };

  // Membuka modal konfirmasi hapus
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  // Eksekusi hapus setelah dikonfirmasi via modal
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBerita(deleteId);
      showToast('Berita berhasil dihapus!', 'success');
      loadBerita();
    } catch (error) {
      showToast('Gagal menghapus berita.', 'error');
    } finally {
      setDeleteId(null); // Tutup modal
    }
  };

  const handleEdit = (berita: Berita) => {
    setEditingId(berita.id);
    setForm({
      judul: berita.judul,
      konten: berita.konten,
      status: berita.status,
      thumbnail: berita.thumbnail || ''
    });
    setIsCreating(true); // Buka form
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
        showToast('Mohon upload file gambar.', 'error');
        return;
    }

    setUploading(true);
    try {
      // Menggunakan bucket 'web-sekolah' folder 'berita'
      const url = await uploadFile(file, 'berita');
      setForm({ ...form, thumbnail: url });
      showToast('Gambar berhasil diupload!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Gagal upload gambar.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const slugBase = form.judul.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      // Tambahkan timestamp agar unik
      const slug = `${slugBase}-${Date.now()}`;
      
      if (editingId) {
        // UPDATE MODE
        await updateBerita(editingId, {
            judul: form.judul,
            konten: form.konten,
            status: form.status as 'draft' | 'publish',
            thumbnail: form.thumbnail,
        });
        showToast('Berita berhasil diperbarui!', 'success');
      } else {
        // CREATE MODE
        await createBerita({
          judul: form.judul,
          konten: form.konten,
          slug: slug,
          status: form.status as 'draft' | 'publish',
          thumbnail: form.thumbnail,
          penulis: user.id
        });
        showToast('Berita berhasil dibuat!', 'success');
      }
      
      handleReset();
      loadBerita();
    } catch (error) {
      console.error(error);
      showToast(editingId ? 'Gagal memperbarui berita' : 'Gagal membuat berita', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Berita</h1>
        {!isCreating && (
            <button 
            onClick={() => setIsCreating(true)}
            className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-500/20"
            >
            <Plus size={18} /> Buat Berita
            </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700 relative animation-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {editingId ? 'Edit Berita' : 'Buat Berita Baru'}
            </h2>
            <button onClick={handleReset} className="text-gray-500 hover:text-red-500">
                <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Judul Berita</label>
              <input 
                required
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.judul} 
                onChange={e => setForm({...form, judul: e.target.value})}
                placeholder="Masukkan judul berita..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Thumbnail</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload} 
                        className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 transition" 
                    />
                    {uploading && <span className="text-xs text-blue-500 animate-pulse mt-1 block">Sedang mengupload...</span>}
                </div>
                {form.thumbnail && (
                    <div className="relative group w-24 h-24 flex-shrink-0">
                        <img src={form.thumbnail} alt="Preview" className="w-full h-full rounded-lg border dark:border-slate-600 object-cover" />
                        <button 
                            type="button"
                            onClick={() => setForm({...form, thumbnail: ''})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Konten</label>
              <textarea 
                required
                rows={8}
                className="w-full border dark:border-slate-600 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.konten} 
                onChange={e => setForm({...form, konten: e.target.value})}
                placeholder="Tulis isi berita di sini..."
              />
            </div>

            <div className="flex items-center gap-6 py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${form.status === 'draft' ? 'border-secondary' : 'border-gray-400'}`}>
                        {form.status === 'draft' && <div className="w-3 h-3 bg-secondary rounded-full" />}
                    </div>
                    <input 
                    type="radio" 
                    name="status" 
                    value="draft"
                    checked={form.status === 'draft'}
                    onChange={e => setForm({...form, status: e.target.value})} 
                    className="hidden"
                    /> 
                    <span className="group-hover:text-gray-900 dark:group-hover:text-white text-gray-600 dark:text-gray-400">Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${form.status === 'publish' ? 'border-green-500' : 'border-gray-400'}`}>
                        {form.status === 'publish' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                    </div>
                    <input 
                    type="radio" 
                    name="status" 
                    value="publish"
                    checked={form.status === 'publish'}
                    onChange={e => setForm({...form, status: e.target.value})} 
                    className="hidden"
                    /> 
                    <span className="group-hover:text-gray-900 dark:group-hover:text-white text-gray-600 dark:text-gray-400">Publish</span>
                </label>
            </div>

            <div className="pt-4 flex gap-3">
                <button 
                    type="button" 
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                    Batal
                </button>
                <button 
                    type="submit" 
                    disabled={loading || uploading}
                    className="flex-1 bg-secondary text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Terbitkan Berita')}
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                <tr>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Judul</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
                {beritaList.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4">
                    <div className="flex items-center gap-3">
                        {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover border dark:border-slate-600" />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                <span className="text-xs text-gray-400">No IMG</span>
                            </div>
                        )}
                        <div>
                            <div className="font-medium text-gray-800 dark:text-gray-100 line-clamp-1 max-w-[200px] md:max-w-xs">{item.judul}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">{item.konten.substring(0, 50)}...</div>
                        </div>
                    </div>
                    </td>
                    <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        item.status === 'publish' 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                    }`}>
                        {item.status === 'publish' ? 'Published' : 'Draft'}
                    </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                {beritaList.length === 0 && (
                    <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-full">
                                    <Edit className="w-8 h-8 text-gray-400" />
                                </div>
                                <p>Belum ada berita. Silakan buat berita baru.</p>
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
              onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Berita?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Apakah Anda yakin ingin menghapus berita ini? Data yang dihapus tidak dapat dikembalikan.
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

export default ManageBerita;
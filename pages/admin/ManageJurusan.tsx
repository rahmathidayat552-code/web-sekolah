import React, { useEffect, useState } from 'react';
import { getJurusan, createJurusan, updateJurusan, deleteJurusan, uploadFile } from '../../services/api';
import { Jurusan } from '../../types';
import { Plus, Trash, Edit, X, AlertTriangle, BookOpen, Image as ImageIcon, Briefcase } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManageJurusan: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal Control
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    nama_jurusan: '',
    singkatan: '',
    deskripsi: '',
    icon: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getJurusan();
      setList(data);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data jurusan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({
      nama_jurusan: '',
      singkatan: '',
      deskripsi: '',
      icon: ''
    });
  };

  const handleEdit = (item: Jurusan) => {
    setEditingId(item.id);
    setForm({
      nama_jurusan: item.nama_jurusan,
      singkatan: item.singkatan,
      deskripsi: item.deskripsi || '',
      icon: item.icon || ''
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
      await deleteJurusan(deleteId);
      showToast('Jurusan berhasil dihapus.', 'success');
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus jurusan.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
        showToast('Mohon upload file gambar.', 'error');
        return;
    }

    setUploading(true);
    try {
        const url = await uploadFile(file, 'jurusan');
        setForm({ ...form, icon: url });
        showToast('Icon berhasil diupload!', 'success');
    } catch (error) {
        console.error(error);
        showToast('Gagal upload gambar.', 'error');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Jurusan> = {
        nama_jurusan: form.nama_jurusan,
        singkatan: form.singkatan,
        deskripsi: form.deskripsi,
        icon: form.icon
      };

      if (editingId) {
        await updateJurusan(editingId, payload);
        showToast('Jurusan berhasil diperbarui!', 'success');
      } else {
        await createJurusan(payload);
        showToast('Jurusan berhasil ditambahkan!', 'success');
      }
      
      handleReset();
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Jurusan</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Program keahlian yang tersedia di sekolah.</p>
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
            <Plus size={18} /> Tambah Jurusan
          </button>
        )}
      </div>

      {/* FORM SECTION (With Animation) */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCreating ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-4">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    {editingId ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
                </h2>
                <button onClick={handleReset} className="text-gray-500 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Jurusan</label>
                        <input 
                            required
                            className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.nama_jurusan} 
                            onChange={e => setForm({...form, nama_jurusan: e.target.value})}
                            placeholder="Contoh: Teknik Komputer Jaringan"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Singkatan</label>
                        <input 
                            required
                            className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.singkatan} 
                            onChange={e => setForm({...form, singkatan: e.target.value})}
                            placeholder="Contoh: TKJ"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Deskripsi</label>
                        <textarea 
                            rows={4}
                            className="w-full border dark:border-slate-600 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.deskripsi} 
                            onChange={e => setForm({...form, deskripsi: e.target.value})}
                            placeholder="Jelaskan tentang kompetensi keahlian ini..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Icon / Logo Jurusan</label>
                        <div className="flex flex-col gap-3">
                             <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group">
                                    {form.icon ? (
                                        <>
                                        <img src={form.icon} alt="Icon" className="w-full h-full object-cover p-1" />
                                        <button 
                                            type="button"
                                            onClick={() => setForm({...form, icon: ''})}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                        </>
                                    ) : (
                                        <ImageIcon className="text-gray-400" />
                                    )}
                                    {uploading && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-xs">...</div>}
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition inline-block">
                                        Pilih Gambar
                                        <input type="file" className="hidden" accept="image/*" onChange={handleIconUpload} />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        disabled={loading || uploading}
                        className="flex-1 bg-secondary text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Jurusan')}
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map(item => (
             <div 
                key={item.id} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
             >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center p-2 border border-blue-100 dark:border-slate-600">
                            {item.icon ? (
                                <img src={item.icon} alt={item.singkatan} className="w-full h-full object-contain" />
                            ) : (
                                <Briefcase className="text-secondary w-8 h-8" />
                            )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{item.nama_jurusan}</h3>
                    <div className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded mb-3">
                        {item.singkatan}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 h-16">
                        {item.deskripsi || "Belum ada deskripsi untuk jurusan ini."}
                    </p>
                </div>
             </div>
        ))}

        {list.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                <div className="flex flex-col items-center gap-3">
                    <Briefcase className="w-10 h-10 text-gray-300" />
                    <p>Belum ada data jurusan.</p>
                </div>
            </div>
        )}
      </div>

       {/* Delete Confirmation Modal (Scale Animation) */}
       {deleteId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDeleteId(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border dark:border-slate-700 transform transition-all scale-100 animate-in fade-in zoom-in duration-200"
              onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Jurusan?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Semua data terkait jurusan ini mungkin akan terpengaruh.
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

export default ManageJurusan;
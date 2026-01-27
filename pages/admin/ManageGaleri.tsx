import React, { useEffect, useState } from 'react';
import { getGaleri, createGaleri, updateGaleri, deleteGaleri, uploadFile } from '../../services/api';
import { Galeri } from '../../types';
import { Plus, Trash, Edit, X, AlertTriangle, Image, Upload } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManageGaleri: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal Control
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    image_url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGaleri();
      setList(data);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat galeri foto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({
      judul: '',
      deskripsi: '',
      image_url: ''
    });
  };

  const handleEdit = (item: Galeri) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      image_url: item.image_url
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
      await deleteGaleri(deleteId);
      showToast('Foto berhasil dihapus.', 'success');
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus foto.', 'error');
    } finally {
      setDeleteId(null);
    }
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
        const url = await uploadFile(file, 'galeri');
        setForm({ ...form, image_url: url });
        showToast('Gambar berhasil diupload!', 'success');
    } catch (error) {
        console.error(error);
        showToast('Gagal upload gambar.', 'error');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.image_url) {
        showToast('Wajib mengupload gambar.', 'error');
        return;
    }

    setLoading(true);

    try {
      const payload: Partial<Galeri> = {
        judul: form.judul,
        deskripsi: form.deskripsi,
        image_url: form.image_url
      };

      if (editingId) {
        await updateGaleri(editingId, payload);
        showToast('Galeri berhasil diperbarui!', 'success');
      } else {
        await createGaleri(payload);
        showToast('Foto berhasil ditambahkan ke galeri!', 'success');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <Image size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Galeri Foto</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Dokumentasi kegiatan dan fasilitas sekolah.</p>
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
            <Plus size={18} /> Tambah Foto
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
                    {editingId ? 'Edit Galeri' : 'Upload Foto Baru'}
                </h2>
                <button onClick={handleReset} className="text-gray-500 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* IMAGE PREVIEW & UPLOAD */}
                    <div className="flex flex-col gap-4">
                         <div className="relative w-full aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group">
                            {form.image_url ? (
                                <>
                                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setForm({...form, image_url: ''})}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300"
                                >
                                    <div className="flex flex-col items-center">
                                        <X size={32} />
                                        <span className="text-sm mt-2 font-medium">Hapus Gambar</span>
                                    </div>
                                </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Image size={48} className="mb-2" />
                                    <span className="text-sm">Preview Gambar</span>
                                </div>
                            )}
                            {uploading && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-xs font-bold text-secondary">MENGUPLOAD...</div>}
                        </div>
                        
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition shadow-sm">
                            <Upload size={18} />
                            {form.image_url ? 'Ganti Foto' : 'Pilih Foto'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* INPUT FIELDS */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Judul Foto</label>
                            <input 
                                required
                                className="w-full border dark:border-slate-600 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                                value={form.judul} 
                                onChange={e => setForm({...form, judul: e.target.value})}
                                placeholder="Contoh: Kegiatan Upacara Bendera"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Deskripsi (Opsional)</label>
                            <textarea 
                                rows={4}
                                className="w-full border dark:border-slate-600 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                                value={form.deskripsi} 
                                onChange={e => setForm({...form, deskripsi: e.target.value})}
                                placeholder="Tulis keterangan foto..."
                            />
                        </div>

                         <div className="flex gap-3 pt-4">
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
                                {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Upload Foto')}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(item => (
             <div 
                key={item.id} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
             >
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img 
                        src={item.image_url} 
                        alt={item.judul} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-4">
                        <div className="flex gap-2 w-full justify-end">
                             <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 bg-white/20 hover:bg-white text-white hover:text-secondary rounded-lg backdrop-blur-sm transition"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => openDeleteModal(item.id)}
                                className="p-2 bg-white/20 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition"
                                title="Hapus"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">{item.judul}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                        {item.deskripsi || "Tidak ada deskripsi."}
                    </p>
                    <div className="text-xs text-gray-400 border-t dark:border-slate-700 pt-3">
                        Diupload pada: {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                    </div>
                </div>
             </div>
        ))}

        {list.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-full">
                        <Image className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium">Belum ada foto di galeri.</p>
                    <p className="text-sm max-w-md mx-auto">Upload dokumentasi kegiatan sekolah untuk menampilkannya di halaman publik.</p>
                </div>
            </div>
        )}
      </div>

       {/* Delete Confirmation Modal */}
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Foto?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Foto akan dihapus permanen dari galeri.
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

export default ManageGaleri;
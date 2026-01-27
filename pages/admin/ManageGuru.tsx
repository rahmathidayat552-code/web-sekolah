import React, { useEffect, useState } from 'react';
import { getAllGuru, createGuru, updateGuru, deleteGuru, getJurusan, uploadFile } from '../../services/api';
import { Guru, Jurusan } from '../../types';
import { Plus, Trash, Edit, X, AlertTriangle, UserCheck, Camera, Search, User } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManageGuru: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<Guru[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Control
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    nama: '',
    nip: '',
    mapel: '',
    jurusan_id: '',
    foto: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [guruData, jurusanData] = await Promise.all([getAllGuru(), getJurusan()]);
      setList(guruData);
      setJurusanList(jurusanData);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data guru.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({
      nama: '',
      nip: '',
      mapel: '',
      jurusan_id: '',
      foto: ''
    });
  };

  const handleEdit = (item: Guru) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      nip: item.nip || '',
      mapel: item.mapel || '',
      jurusan_id: item.jurusan_id || '',
      foto: item.foto || ''
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
      await deleteGuru(deleteId);
      showToast('Data guru berhasil dihapus.', 'success');
      loadData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus data guru.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
        showToast('Mohon upload file gambar.', 'error');
        return;
    }

    setUploading(true);
    try {
        const url = await uploadFile(file, 'guru');
        setForm({ ...form, foto: url });
        showToast('Foto berhasil diupload!', 'success');
    } catch (error) {
        console.error(error);
        showToast('Gagal upload foto.', 'error');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Guru> = {
        nama: form.nama,
        nip: form.nip || null,
        mapel: form.mapel || null,
        jurusan_id: form.jurusan_id || null,
        foto: form.foto || null
      };

      if (editingId) {
        await updateGuru(editingId, payload);
        showToast('Data guru berhasil diperbarui!', 'success');
      } else {
        await createGuru(payload);
        showToast('Data guru berhasil ditambahkan!', 'success');
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

  const filteredList = list.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.nip && item.nip.includes(searchTerm)) ||
    (item.mapel && item.mapel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <UserCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Guru & Staff</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manajemen tenaga pendidik dan kependidikan.</p>
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
            <Plus size={18} /> Tambah Guru
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
                    {editingId ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                </h2>
                <button onClick={handleReset} className="text-gray-500 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* FOTO UPLOAD SIDE */}
                    <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group">
                            {form.foto ? (
                                <>
                                <img src={form.foto} alt="Foto" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setForm({...form, foto: ''})}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={24} />
                                </button>
                                </>
                            ) : (
                                <User className="w-12 h-12 text-gray-400" />
                            )}
                            {uploading && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-xs">...</div>}
                        </div>
                        <label className="cursor-pointer bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition inline-flex items-center gap-2">
                            <Camera size={16} />
                            Upload Foto
                            <input type="file" className="hidden" accept="image/*" onChange={handleFotoUpload} />
                        </label>
                    </div>

                    {/* INPUT FIELDS SIDE */}
                    <div className="flex-1 space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                                <input 
                                    required
                                    className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                                    value={form.nama} 
                                    onChange={e => setForm({...form, nama: e.target.value})}
                                    placeholder="Contoh: Budi Santoso, S.Pd"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">NIP / NIY (Opsional)</label>
                                <input 
                                    className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                                    value={form.nip} 
                                    onChange={e => setForm({...form, nip: e.target.value})}
                                    placeholder="Nomor Induk Pegawai"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mata Pelajaran / Jabatan</label>
                                <input 
                                    className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                                    value={form.mapel} 
                                    onChange={e => setForm({...form, mapel: e.target.value})}
                                    placeholder="Contoh: Matematika / Kepala TU"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Jurusan (Jika Guru Produktif)</label>
                                <select 
                                    className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition"
                                    value={form.jurusan_id}
                                    onChange={e => setForm({...form, jurusan_id: e.target.value})}
                                >
                                    <option value="">-- Umum / Non-Produktif --</option>
                                    {jurusanList.map(j => (
                                        <option key={j.id} value={j.id}>{j.nama_jurusan}</option>
                                    ))}
                                </select>
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
                        {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Guru')}
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end mb-4">
        <div className="relative">
             <input 
                type="text" 
                placeholder="Cari Nama / NIP..." 
                className="pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-secondary outline-none w-64 transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                    <tr>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Nama Guru</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">NIP/NIY</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Mapel / Jabatan</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                    {filteredList.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    {item.foto ? (
                                        <img src={item.foto} alt={item.nama} className="w-10 h-10 rounded-full object-cover border dark:border-slate-600" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                            {item.nama.charAt(0)}
                                        </div>
                                    )}
                                    <div className="font-bold text-gray-800 dark:text-gray-100">{item.nama}</div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                {item.nip || '-'}
                            </td>
                            <td className="p-4 text-sm">
                                <div className="text-gray-800 dark:text-gray-200">{item.mapel || '-'}</div>
                                {item.jurusan && (
                                    <div className="text-xs text-secondary mt-0.5">{item.jurusan.nama_jurusan}</div>
                                )}
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
                    {filteredList.length === 0 && (
                         <tr>
                            <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <UserCheck className="w-10 h-10 text-gray-300" />
                                    <p>{searchTerm ? 'Data tidak ditemukan.' : 'Belum ada data guru.'}</p>
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Data Guru?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Data guru akan dihapus permanen dari sistem.
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

export default ManageGuru;
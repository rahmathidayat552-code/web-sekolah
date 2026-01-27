import React, { useEffect, useState } from 'react';
import { getPendaftar, updateStatusPendaftar, deletePendaftar, getJurusan } from '../../services/api';
import { PPDBPendaftar, Jurusan } from '../../types';
import { Users, Trash, Search, Eye, AlertTriangle, X, CheckCircle, XCircle, Clock, Filter, Phone } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManagePPDB: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<PPDBPendaftar[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal State
  const [selectedItem, setSelectedItem] = useState<PPDBPendaftar | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendaftarData, jurusanData] = await Promise.all([
        getPendaftar(),
        getJurusan()
      ]);
      setList(pendaftarData);
      setJurusanList(jurusanData);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data PPDB.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      await updateStatusPendaftar(id, status);
      showToast(`Status berhasil diubah menjadi ${status}.`, 'success');
      
      // Update local state
      setList(prev => prev.map(item => item.id === id ? { ...item, status: status as any } : item));
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status: status as any });
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal mengubah status.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const openDeleteModal = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePendaftar(deleteId);
      showToast('Data pendaftar berhasil dihapus.', 'success');
      setList(prev => prev.filter(item => item.id !== deleteId));
      if (selectedItem?.id === deleteId) setSelectedItem(null);
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus data.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  // Filter Logic
  const filteredList = list.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.asal_sekolah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJurusan = filterJurusan ? item.jurusan_pilihan === filterJurusan : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchJurusan && matchStatus;
  });

  // Helper for Status Badge
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'diterima':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle size={12}/> Diterima</span>;
      case 'ditolak':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle size={12}/> Ditolak</span>;
      case 'verifikasi':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock size={12}/> Verifikasi</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Users size={12}/> Baru</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Pendaftar PPDB</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Kelola data calon siswa baru. Total: <span className="font-bold text-secondary">{list.length}</span> Pendaftar.
            </p>
          </div>
        </div>
        <button onClick={loadData} className="text-sm text-secondary font-medium hover:underline">
            Refresh Data
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
             <input 
                type="text" 
                placeholder="Cari Nama / Asal Sekolah..." 
                className="pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-secondary outline-none w-full transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
                <Filter className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <select 
                    className="pl-10 pr-8 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-secondary outline-none w-full appearance-none"
                    value={filterJurusan}
                    onChange={e => setFilterJurusan(e.target.value)}
                >
                    <option value="">Semua Jurusan</option>
                    {jurusanList.map(j => (
                        <option key={j.id} value={j.id}>{j.nama_jurusan}</option>
                    ))}
                </select>
            </div>
            <div className="relative w-full md:w-48">
                <Filter className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <select 
                    className="pl-10 pr-8 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-secondary outline-none w-full appearance-none"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">Semua Status</option>
                    <option value="baru">Baru</option>
                    <option value="verifikasi">Verifikasi</option>
                    <option value="diterima">Diterima</option>
                    <option value="ditolak">Ditolak</option>
                </select>
            </div>
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                    <tr>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Nama Lengkap</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Asal Sekolah</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Jurusan</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Status</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                    {filteredList.map(item => (
                        <tr 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)}
                            className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                        >
                            <td className="p-4 font-medium text-gray-800 dark:text-gray-100">
                                {item.nama}
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                {item.asal_sekolah}
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                {item.jurusan?.nama_jurusan || '-'}
                            </td>
                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="p-4 text-center">
                                <StatusBadge status={item.status} />
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" 
                                        title="Detail"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => openDeleteModal(item.id, e)} 
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
                            <td colSpan={6} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <Users className="w-10 h-10 text-gray-300" />
                                    <p>{searchTerm ? 'Data tidak ditemukan.' : 'Belum ada pendaftar.'}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* DETAIL MODAL */}
       {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-0 border dark:border-slate-700 transform transition-all scale-100 flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detail Pendaftar</h3>
                        <p className="text-xs text-gray-500">ID: {selectedItem.id}</p>
                    </div>
                    <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nama Lengkap</label>
                                <p className="font-medium text-lg text-gray-800 dark:text-gray-200">{selectedItem.nama}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Asal Sekolah</label>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{selectedItem.asal_sekolah}</p>
                            </div>
                             <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Jurusan Pilihan</label>
                                <p className="font-medium text-gray-800 dark:text-gray-200 text-secondary">{selectedItem.jurusan?.nama_jurusan || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nomor WhatsApp</label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedItem.no_hp}</p>
                                    <a 
                                        href={`https://wa.me/${selectedItem.no_hp.replace(/^0/, '62')}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 flex items-center gap-1"
                                    >
                                        <Phone size={10} /> Chat WA
                                    </a>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Alamat</label>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{selectedItem.alamat || '-'}</p>
                            </div>
                             <div>
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tanggal Daftar</label>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(selectedItem.created_at).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border dark:border-slate-700">
                        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Update Status Pendaftaran</label>
                        <div className="flex flex-wrap gap-3">
                            {['baru', 'verifikasi', 'diterima', 'ditolak'].map((statusOption) => (
                                <button
                                    key={statusOption}
                                    onClick={() => handleUpdateStatus(selectedItem.id, statusOption)}
                                    disabled={processingId === selectedItem.id}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border
                                        ${selectedItem.status === statusOption 
                                            ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-secondary border-secondary bg-secondary text-white' 
                                            : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}
                                    `}
                                >
                                    {statusOption}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-between items-center rounded-b-xl">
                     <button
                        onClick={() => openDeleteModal(selectedItem.id, { stopPropagation: () => {} } as React.MouseEvent)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2"
                    >
                        <Trash size={16} /> Hapus Data
                    </button>
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="px-6 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
      )}

       {/* Delete Confirmation Modal */}
       {deleteId && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Data?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Data pendaftar akan hilang permanen.
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

export default ManagePPDB;
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { getPesan, deletePesan, updateStatusPesan } from '../../services/api';
import { Pesan } from '../../types';
import { Mail, Trash, Search, Eye, AlertTriangle, X, Reply, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManagePesan: React.FC = () => {
  const { showToast } = useToast();
  const [list, setList] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedPesan, setSelectedPesan] = useState<Pesan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();

    // --- SETUP REALTIME SUBSCRIPTION ---
    const channel = supabase
      .channel('realtime-pesan')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pesan' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPesan = payload.new as Pesan;
            setList((prev) => [newPesan, ...prev]);
            showToast('Pesan baru diterima!', 'info');
          } else if (payload.eventType === 'UPDATE') {
            const updatedPesan = payload.new as Pesan;
            setList((prev) => 
              prev.map((item) => item.id === updatedPesan.id ? updatedPesan : item)
            );
            // Jika pesan yang sedang dibuka diupdate statusnya
            if (selectedPesan?.id === updatedPesan.id) {
                setSelectedPesan(updatedPesan);
            }
          } else if (payload.eventType === 'DELETE') {
            setList((prev) => prev.filter((item) => item.id !== payload.old.id));
            // Jika pesan yang sedang dibuka dihapus orang lain
            if (selectedPesan?.id === payload.old.id) {
                setSelectedPesan(null);
                showToast('Pesan yang sedang dilihat telah dihapus.', 'info');
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPesan]); // Dependensi selectedPesan agar bisa akses state terkini di dalam listener jika diperlukan

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPesan();
      setList(data);
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat pesan masuk.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (pesan: Pesan) => {
    setSelectedPesan(pesan);
    // Jika status masih unread, update jadi read
    if (pesan.status === 'unread') {
      try {
        await updateStatusPesan(pesan.id, 'read');
        // Tidak perlu update local state manual karena Realtime listener akan menangani UPDATE event
      } catch (error) {
        console.error("Gagal update status", error);
      }
    }
  };

  const markAsReplied = async (pesan: Pesan) => {
    try {
      await updateStatusPesan(pesan.id, 'replied');
      // Tidak perlu update local state manual karena Realtime listener akan menangani UPDATE event
      
      showToast('Ditandai sebagai sudah dibalas.', 'success');
      
      // Buka Email Client
      window.open(`mailto:${pesan.email}?subject=Re: ${pesan.subjek}&body=Halo ${pesan.nama},\n\nTerima kasih telah menghubungi kami.\n\n`, '_blank');
    } catch (error) {
      console.error(error);
      showToast('Gagal update status.', 'error');
    }
  };

  const openDeleteModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePesan(deleteId);
      showToast('Pesan berhasil dihapus.', 'success');
      // Jika yang dihapus sedang dibuka di modal, tutup modalnya
      if (selectedPesan?.id === deleteId) {
        setSelectedPesan(null);
      }
      // Tidak perlu loadData() manual, Realtime listener handle DELETE event
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus pesan.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredList = list.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subjek.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = list.filter(item => item.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
             <Mail size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pesan Masuk</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Kelola pertanyaan dan masukan dari pengunjung. 
                {unreadCount > 0 && <span className="ml-2 font-bold text-secondary">({unreadCount} Belum Dibaca)</span>}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="relative w-full md:w-96">
             <input 
                type="text" 
                placeholder="Cari Pengirim atau Subjek..." 
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
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Pengirim</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Subjek</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Waktu</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Status</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                    {filteredList.map(item => (
                        <tr 
                            key={item.id} 
                            onClick={() => openDetail(item)}
                            className={`
                                cursor-pointer transition hover:bg-gray-50 dark:hover:bg-slate-700/50
                                ${item.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                            `}
                        >
                            <td className="p-4">
                                <div className="font-bold text-gray-800 dark:text-gray-100">{item.nama}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                {item.subjek}
                            </td>
                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4 text-center">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                                    ${item.status === 'unread' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                    ${item.status === 'read' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}
                                    ${item.status === 'replied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                `}>
                                    {item.status === 'unread' ? 'Baru' : (item.status === 'replied' ? 'Dibalas' : 'Dibaca')}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openDetail(item); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" 
                                        title="Lihat Detail"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => openDeleteModal(item.id, e)} 
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" 
                                        title="Hapus Pesan"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredList.length === 0 && (
                         <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <Mail className="w-10 h-10 text-gray-300" />
                                    <p>{searchTerm ? 'Pesan tidak ditemukan.' : 'Tidak ada pesan masuk.'}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* DETAIL MODAL */}
       {selectedPesan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedPesan(null)}
        >
            <div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-0 border dark:border-slate-700 transform transition-all scale-100 flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-slate-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detail Pesan</h3>
                    <button onClick={() => setSelectedPesan(null)} className="text-gray-500 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pengirim</label>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{selectedPesan.nama}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Kontak</label>
                            <div className="flex flex-col">
                                <span className="text-sm text-secondary">{selectedPesan.email}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{selectedPesan.no_hp || '-'}</span>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Subjek</label>
                             <p className="font-medium text-gray-800 dark:text-gray-200">{selectedPesan.subjek}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border dark:border-slate-700 min-h-[150px]">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedPesan.isi}
                        </p>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-400 text-right">
                        Diterima: {new Date(selectedPesan.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-between items-center rounded-b-xl">
                     <button
                        onClick={() => openDeleteModal(selectedPesan.id, { stopPropagation: () => {} } as React.MouseEvent)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2"
                    >
                        <Trash size={16} /> Hapus Pesan
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedPesan(null)}
                            className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => markAsReplied(selectedPesan)}
                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                           {selectedPesan.status === 'replied' ? <><CheckCircle size={18}/> Dibalas</> : <><Reply size={18} /> Balas via Email</>}
                        </button>
                    </div>
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hapus Pesan?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Tindakan ini tidak dapat dibatalkan. Pesan akan dihapus permanen.
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

export default ManagePesan;
import React, { useEffect, useState } from 'react';
import { getPublicBerita } from '../../services/api';
import { Berita } from '../../types';
import { Calendar, User, Search, Newspaper } from 'lucide-react';
import { useToast } from '../../components/Toast';

const PublicBerita: React.FC = () => {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublicBerita();
        setBerita(data);
      } catch (error) {
        console.error(error);
        showToast('Gagal memuat berita.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const filteredBerita = berita.filter(item => 
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Berita & Artikel</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ikuti perkembangan terbaru, prestasi siswa, dan kegiatan seru lainnya di sekolah kami.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
           <input 
              type="text" 
              placeholder="Cari berita..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-secondary outline-none shadow-sm transition"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
           />
           <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>

        {/* Content Grid */}
        {loading ? (
           <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm h-96 animate-pulse">
                   <div className="h-48 bg-gray-200 dark:bg-slate-700"></div>
                   <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                   </div>
                </div>
              ))}
           </div>
        ) : filteredBerita.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBerita.map((item) => (
              <article key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl dark:shadow-slate-900 transition-all duration-300 border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-full group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.thumbnail || `https://ui-avatars.com/api/?name=${item.judul}&background=random`} 
                    alt={item.judul} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                     <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                     </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                    {item.judul}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {item.konten}
                  </p>
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <User size={14} className="mr-1" /> Admin Sekolah
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Coba kata kunci lain atau kembali lagi nanti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBerita;
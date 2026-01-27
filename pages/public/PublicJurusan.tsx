import React, { useEffect, useState } from 'react';
import { getJurusan } from '../../services/api';
import { Jurusan } from '../../types';
import { BookOpen, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { Link } from 'react-router-dom';

const PublicJurusan: React.FC = () => {
  const [jurusan, setJurusan] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJurusan();
        setJurusan(data);
      } catch (error) {
        console.error(error);
        showToast('Gagal memuat data jurusan.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Program Keahlian</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Siapkan Masa Depanmu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kami menyediakan berbagai kompetensi keahlian yang relevan dengan kebutuhan industri saat ini. 
            Didukung fasilitas lengkap dan tenaga pengajar profesional.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
                 <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-2xl shadow-sm animate-pulse"></div>
             ))}
          </div>
        ) : jurusan.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jurusan.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-2xl dark:shadow-slate-900 transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen size={100} className="text-secondary" />
                </div>

                <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-secondary mb-6 shadow-inner">
                  {item.icon ? (
                    <img src={item.icon} alt={item.singkatan} className="w-10 h-10 object-contain" />
                  ) : (
                    <Briefcase size={32} />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-secondary transition-colors">
                  {item.nama_jurusan}
                </h3>
                <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full mb-4 w-max">
                  Kode: {item.singkatan}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 leading-relaxed">
                  {item.deskripsi || "Jurusan unggulan dengan kurikulum berbasis industri dan praktik kerja lapangan yang luas."}
                </p>

                <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                   <Link to="/ppdb" className="flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
                      Daftar Jurusan Ini <ArrowRight size={18} />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-12">
                <p className="text-gray-500">Belum ada data jurusan.</p>
            </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-secondary rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-4">Belum Yakin Memilih?</h2>
                 <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                     Konsultasikan minat dan bakatmu dengan tim BK kami atau datang langsung ke sekolah untuk melihat fasilitas yang tersedia.
                 </p>
                 <Link to="/kontak" className="inline-block bg-white text-secondary font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition transform hover:scale-105 shadow-lg">
                     Hubungi Kami
                 </Link>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJurusan;
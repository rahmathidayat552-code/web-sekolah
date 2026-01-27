import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicBerita, getActivePengumuman, getJurusan, getIdentitasSekolah, getAllGuru } from '../../services/api';
import { Berita, Jurusan, Pengumuman, IdentitasSekolah } from '../../types';
import { ArrowRight, Calendar, BookOpen, School, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [jurusan, setJurusan] = useState<Jurusan[]>([]);
  const [identitas, setIdentitas] = useState<IdentitasSekolah | null>(null);
  
  // Real stats state
  const [stats, setStats] = useState({
    guru: 0,
    jurusan: 0,
  });

  useEffect(() => {
    // Parallel fetching for performance
    const fetchAllData = async () => {
        try {
            const [beritaData, pengumumanData, jurusanData, identitasData, guruData] = await Promise.all([
                getPublicBerita(),
                getActivePengumuman(),
                getJurusan(),
                getIdentitasSekolah(),
                getAllGuru()
            ]);

            setBerita(beritaData.slice(0, 3));
            setPengumuman(pengumumanData);
            setJurusan(jurusanData);
            setIdentitas(identitasData);
            
            setStats(prev => ({
                ...prev,
                guru: guruData.length,
                jurusan: jurusanData.length,
            }));

        } catch (error) {
            console.error("Error fetching home data", error);
        }
    };

    fetchAllData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary dark:bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 fixed-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80 dark:to-slate-900"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          
          {identitas?.logo_sekolah && (
             <img src={identitas.logo_sekolah} alt="Logo" className="w-24 h-24 mx-auto mb-6 drop-shadow-lg" />
          )}

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Selamat Datang di <br className="hidden md:block" /> 
            <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-blue-400">
                {identitas?.nama_sekolah || "SMK TEKNO"}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
             Mewujudkan generasi emas yang berkompeten, berkarakter, dan siap kerja di era industri 4.0.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ppdb" className="px-8 py-4 bg-secondary hover:bg-blue-600 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
              Daftar Sekarang <ArrowRight size={20} />
            </Link>
            <Link to="/jurusan" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white hover:text-primary rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2">
              Lihat Jurusan
            </Link>
          </div>
        </div>
      </section>

      {/* Info Stats */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, label: "Guru & Staff", val: stats.guru },
            { icon: School, label: "Program Keahlian", val: stats.jurusan },
            { icon: Trophy, label: "Akreditasi", val: "A" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl dark:shadow-slate-900 text-center transform hover:-translate-y-2 transition-all border border-gray-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                 <item.icon className="h-7 w-7 text-secondary" />
              </div>
              <div className="font-bold text-4xl text-gray-800 dark:text-white mb-2">{item.val}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Jurusan Highlights */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Pendidikan Vokasi</span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Kompetensi Keahlian</h2>
          <p className="text-gray-600 dark:text-gray-400">Pilihan jurusan terbaik untuk masa depan karirmu</p>
        </div>
        
        {jurusan.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {jurusan.map((j) => (
              <div key={j.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900/20 hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700 overflow-hidden group">
                <div className="h-2 bg-secondary w-0 group-hover:w-full transition-all duration-500"></div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                      <div className="h-14 w-14 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-secondary font-bold text-xl">
                        {j.icon ? <img src={j.icon} alt="icon" className="w-8 h-8 object-contain"/> : j.singkatan.substring(0, 2)}
                      </div>
                      <span className="text-xs font-bold bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-2 py-1 rounded">
                          {j.singkatan}
                      </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-secondary transition-colors">{j.nama_jurusan}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-3 leading-relaxed">
                    {j.deskripsi || "Program keahlian unggulan dengan fasilitas lengkap dan kurikulum berbasis industri."}
                  </p>
                  <Link to="/jurusan" className="text-secondary font-bold text-sm flex items-center gap-1 hover:gap-3 transition-all">
                    Selengkapnya <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic">Sedang memuat data jurusan...</div>
        )}
      </section>

      {/* Berita & Pengumuman */}
      <section className="bg-gray-100 dark:bg-slate-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Berita Column */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Berita Terbaru</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Update kegiatan dan prestasi sekolah</p>
                </div>
                <Link to="/berita" className="text-secondary font-bold text-sm hover:underline">Lihat Semua Berita</Link>
              </div>
              
              <div className="space-y-6">
                {berita.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm dark:shadow-slate-900 hover:shadow-md transition-shadow border border-transparent hover:border-blue-100 dark:hover:border-slate-700">
                    <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <img 
                            src={item.thumbnail || `https://ui-avatars.com/api/?name=${item.judul}&background=random`} 
                            alt={item.judul} 
                            className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar size={12}/>
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white hover:text-secondary cursor-pointer line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.konten}</p>
                    </div>
                  </div>
                ))}
                {berita.length === 0 && (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl">
                        <p className="text-gray-500">Belum ada berita dipublish.</p>
                    </div>
                )}
              </div>
            </div>

            {/* Pengumuman Column */}
            <div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                   Pengumuman
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               </h2>
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                 {pengumuman.map((p) => (
                   <div key={p.id} className="relative pl-6 border-l-2 border-gray-200 dark:border-slate-600 pb-2 last:pb-0">
                     <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-white dark:ring-slate-800"></div>
                     <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                        {new Date(p.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                     </span>
                     <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1 hover:text-secondary transition-colors cursor-pointer">{p.judul}</h4>
                     <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg mt-2">
                        {p.isi}
                     </p>
                   </div>
                 ))}
                 {pengumuman.length === 0 && (
                     <div className="text-center py-8">
                         <p className="text-gray-500 italic text-sm">Tidak ada pengumuman aktif saat ini.</p>
                     </div>
                 )}
               </div>
               
               <div className="mt-8 bg-gradient-to-br from-secondary to-blue-600 rounded-xl p-6 text-white text-center shadow-lg">
                   <h3 className="font-bold text-lg mb-2">Ingin Mendaftar?</h3>
                   <p className="text-blue-100 text-sm mb-4">Segera daftarkan diri Anda sebelum kuota terpenuhi.</p>
                   <Link to="/ppdb" className="inline-block bg-white text-secondary font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
                       Info PPDB
                   </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
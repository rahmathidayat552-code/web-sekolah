import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicBerita, getActivePengumuman, getJurusan } from '../../services/api';
import { Berita, Jurusan, Pengumuman } from '../../types';
import { ArrowRight, Calendar, Users, Trophy, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [jurusan, setJurusan] = useState<Jurusan[]>([]);

  useEffect(() => {
    getPublicBerita().then(data => setBerita(data.slice(0, 3)));
    getActivePengumuman().then(data => setPengumuman(data));
    getJurusan().then(setJurusan);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary dark:bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=4')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/50 dark:to-slate-900"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Selamat Datang di <br className="hidden md:block" /> <span className="text-secondary">SMK TEKNO</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Membentuk generasi unggul yang siap bersaing di dunia industri dengan keahlian teknologi terkini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ppdb" className="px-8 py-3 bg-secondary hover:bg-blue-600 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-500/30">
              Daftar Sekarang
            </Link>
            <Link to="/jurusan" className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-primary rounded-full font-bold text-lg transition-colors">
              Lihat Jurusan
            </Link>
          </div>
        </div>
      </section>

      {/* Info Stats */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Siswa Aktif", val: "1200+" },
            { icon: BookOpen, label: "Guru Kompeten", val: "85+" },
            { icon: Trophy, label: "Prestasi", val: "150+" },
            { icon: Calendar, label: "Tahun Berdiri", val: "2005" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-900/50 text-center transform hover:-translate-y-1 transition-all border dark:border-slate-700">
              <item.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
              <div className="font-bold text-2xl text-primary dark:text-white">{item.val}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Jurusan Highlights */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-3">Kompetensi Keahlian</h2>
          <p className="text-gray-600 dark:text-gray-400">Pilihan jurusan terbaik untuk masa depan karirmu</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {jurusan.map((j) => (
            <div key={j.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900/20 hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700 overflow-hidden group">
              <div className="h-3 bg-secondary w-0 group-hover:w-full transition-all duration-500"></div>
              <div className="p-8">
                <div className="h-12 w-12 bg-blue-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-secondary font-bold text-xl mb-6">
                  {j.singkatan}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{j.nama_jurusan}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-3">
                  {j.deskripsi || "Program keahlian unggulan dengan fasilitas lengkap dan kurikulum berbasis industri."}
                </p>
                <Link to="/jurusan" className="text-secondary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Selengkapnya <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Berita & Pengumuman */}
      <section className="bg-gray-100 dark:bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Berita Column */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary dark:text-white">Berita Terbaru</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Update kegiatan dan prestasi sekolah</p>
                </div>
                <Link to="/berita" className="text-secondary font-medium text-sm">Lihat Semua</Link>
              </div>
              
              <div className="space-y-6">
                {berita.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm dark:shadow-slate-900 hover:shadow-md transition-shadow border dark:border-slate-700">
                    <img 
                      src={item.thumbnail || "https://picsum.photos/300/200"} 
                      alt={item.judul} 
                      className="w-full md:w-48 h-32 object-cover rounded-md"
                    />
                    <div className="flex-1 py-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
                      <h3 className="font-bold text-xl mb-2 text-primary dark:text-white hover:text-secondary cursor-pointer line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.konten.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))}
                {berita.length === 0 && <p className="text-gray-500 italic">Belum ada berita dipublish.</p>}
              </div>
            </div>

            {/* Pengumuman Column */}
            <div>
               <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Pengumuman</h2>
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-6">
                 {pengumuman.map((p) => (
                   <div key={p.id} className="border-l-4 border-accent pl-4">
                     <h4 className="font-bold text-gray-800 dark:text-gray-100">{p.judul}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                       {new Date(p.tanggal_mulai).toLocaleDateString()}
                     </p>
                     <p className="text-sm text-gray-600 dark:text-gray-300">{p.isi}</p>
                   </div>
                 ))}
                 {pengumuman.length === 0 && <p className="text-gray-500 italic text-sm">Tidak ada pengumuman aktif.</p>}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { getIdentitasSekolah, saveIdentitasSekolah, uploadFile } from '../../services/api';
import { IdentitasSekolah } from '../../types';
import { Save, Upload, MapPin, User, Building, X } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManageIdentitas: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const [form, setForm] = useState<IdentitasSekolah>({
    nama_sekolah: '',
    npsn: '',
    alamat: '',
    email: '',
    no_tlp: '',
    koordinat_ls: '',
    koordinat_lb: '',
    nama_kepsek: '',
    nip_kepsek: '',
    foto_kepsek: '',
    logo_sekolah: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getIdentitasSekolah();
      if (data) {
        setForm(data);
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data identitas sekolah.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'foto') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
        showToast('Mohon upload file gambar.', 'error');
        return;
    }

    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFoto(true);

    try {
      const url = await uploadFile(file, 'identitas');
      if (type === 'logo') {
        setForm(prev => ({ ...prev, logo_sekolah: url }));
      } else {
        setForm(prev => ({ ...prev, foto_kepsek: url }));
      }
      showToast('Gambar berhasil diupload!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Gagal upload gambar.', 'error');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveIdentitasSekolah(form);
      showToast('Identitas Sekolah berhasil disimpan!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
          <Building size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Identitas Sekolah</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola informasi utama profil sekolah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Data Umum Sekolah */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-secondary" /> Data Umum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-auto flex flex-col items-center gap-2">
                <div className="w-32 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group">
                  {form.logo_sekolah ? (
                    <>
                      <img src={form.logo_sekolah} alt="Logo" className="w-full h-full object-contain p-2" />
                      <button 
                        type="button"
                        onClick={() => setForm({...form, logo_sekolah: ''})}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <X />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Logo</span>
                  )}
                  {uploadingLogo && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-xs">Loading...</div>}
                </div>
                <label className="cursor-pointer bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition">
                  Upload Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                </label>
              </div>

              <div className="flex-1 w-full space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Sekolah</label>
                    <input 
                      required
                      name="nama_sekolah"
                      className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                      value={form.nama_sekolah} 
                      onChange={handleChange}
                      placeholder="SMK TEKNO"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">NPSN</label>
                    <input 
                      name="npsn"
                      className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                      value={form.npsn} 
                      onChange={handleChange}
                      placeholder="12345678"
                    />
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Sekolah</label>
              <input 
                type="email"
                name="email"
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.email} 
                onChange={handleChange}
                placeholder="info@sekolah.sch.id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">No. Telepon</label>
              <input 
                name="no_tlp"
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.no_tlp} 
                onChange={handleChange}
                placeholder="(021) 123456"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
              <textarea 
                name="alamat"
                rows={3}
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.alamat} 
                onChange={handleChange}
                placeholder="Jl. Pendidikan No. 1..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Lokasi / Koordinat */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" /> Koordinat Lokasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Lintang Selatan (Latitude)</label>
              <input 
                name="koordinat_ls"
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.koordinat_ls} 
                onChange={handleChange}
                placeholder="-6.123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bujur Timur (Longitude)</label>
              <input 
                name="koordinat_lb"
                className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                value={form.koordinat_lb} 
                onChange={handleChange}
                placeholder="106.123456"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Data Kepala Sekolah */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" /> Kepala Sekolah
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="w-full md:w-auto flex flex-col items-center gap-2">
                <div className="w-32 h-40 bg-gray-100 dark:bg-slate-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative group">
                  {form.foto_kepsek ? (
                    <>
                      <img src={form.foto_kepsek} alt="Kepsek" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm({...form, foto_kepsek: ''})}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <X />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">Foto</span>
                  )}
                  {uploadingFoto && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-xs">Loading...</div>}
                </div>
                <label className="cursor-pointer bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition">
                  Upload Foto
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'foto')} />
                </label>
              </div>

              <div className="flex-1 w-full space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Kepala Sekolah</label>
                    <input 
                      name="nama_kepsek"
                      className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                      value={form.nama_kepsek} 
                      onChange={handleChange}
                      placeholder="Drs. H. Fulan, M.Pd"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">NIP</label>
                    <input 
                      name="nip_kepsek"
                      className="w-full border dark:border-slate-600 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                      value={form.nip_kepsek} 
                      onChange={handleChange}
                      placeholder="1980xxxx..."
                    />
                 </div>
              </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading || uploadingLogo || uploadingFoto}
            className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-bold"
          >
            {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
          </button>
        </div>

      </form>
    </div>
  );
};

// Helper icon component
const SchoolIcon = ({className}:{className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>
);

export default ManageIdentitas;
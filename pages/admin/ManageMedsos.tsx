import React, { useEffect, useState } from 'react';
import { getMedsos, saveMedsos } from '../../services/api';
import { MedsosSekolah } from '../../types';
import { Save, Share2, Instagram, Facebook, Youtube, MessageCircle, Music, Link as LinkIcon } from 'lucide-react';
import { useToast } from '../../components/Toast';

const ManageMedsos: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<MedsosSekolah>({
    instagram: '',
    whatsapp: '',
    facebook: '',
    youtube: '',
    tiktok: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMedsos();
      if (data) {
        setForm({
            instagram: data.instagram || '',
            whatsapp: data.whatsapp || '',
            facebook: data.facebook || '',
            youtube: data.youtube || '',
            tiktok: data.tiktok || ''
        });
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data medsos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveMedsos({
        instagram: form.instagram || null,
        whatsapp: form.whatsapp || null,
        facebook: form.facebook || null,
        youtube: form.youtube || null,
        tiktok: form.tiktok || null
      });
      showToast('Data Medsos berhasil disimpan!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
          <Share2 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Media Sosial</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola link akun sosial media resmi sekolah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="grid gap-6">
                
                {/* Instagram */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Instagram size={18} className="text-pink-600" /> Instagram
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">https://</span>
                        </div>
                        <input 
                            name="instagram"
                            className="w-full border dark:border-slate-600 pl-16 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.instagram || ''} 
                            onChange={handleChange}
                            placeholder="instagram.com/smktekno"
                        />
                    </div>
                </div>

                {/* WhatsApp Channel */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MessageCircle size={18} className="text-green-500" /> WhatsApp Channel / Contact
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">https://</span>
                        </div>
                        <input 
                            name="whatsapp"
                            className="w-full border dark:border-slate-600 pl-16 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.whatsapp || ''} 
                            onChange={handleChange}
                            placeholder="wa.me/62812345678"
                        />
                    </div>
                </div>

                {/* Facebook */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Facebook size={18} className="text-blue-600" /> Facebook
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">https://</span>
                        </div>
                        <input 
                            name="facebook"
                            className="w-full border dark:border-slate-600 pl-16 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.facebook || ''} 
                            onChange={handleChange}
                            placeholder="facebook.com/smktekno"
                        />
                    </div>
                </div>

                {/* YouTube */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Youtube size={18} className="text-red-600" /> YouTube
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">https://</span>
                        </div>
                        <input 
                            name="youtube"
                            className="w-full border dark:border-slate-600 pl-16 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.youtube || ''} 
                            onChange={handleChange}
                            placeholder="youtube.com/@smktekno"
                        />
                    </div>
                </div>

                {/* TikTok */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Music size={18} className="text-black dark:text-white" /> TikTok
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">https://</span>
                        </div>
                        <input 
                            name="tiktok"
                            className="w-full border dark:border-slate-600 pl-16 p-3 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition" 
                            value={form.tiktok || ''} 
                            onChange={handleChange}
                            placeholder="tiktok.com/@smktekno"
                        />
                    </div>
                </div>

            </div>

             <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900">
                <LinkIcon size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold mb-1">Catatan:</p>
                    <p>Semua kolom bersifat opsional. Kosongkan jika sekolah tidak memiliki akun pada platform tersebut. Pastikan menyertakan link lengkap (walaupun kolom input otomatis menangani prefix, user mungkin copy-paste full link).</p>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 font-bold"
                >
                    {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ManageMedsos;

import React, { useEffect, useState } from 'react';
import { getIdentitasSekolah, createPesan } from '../../services/api';
import { IdentitasSekolah } from '../../types';
import { MapPin, Phone, Mail, Send, Loader2, Clock, Globe } from 'lucide-react';
import { useToast } from '../../components/Toast';

const PublicKontak: React.FC = () => {
  const { showToast } = useToast();
  const [identitas, setIdentitas] = useState<IdentitasSekolah | null>(null);
  const [loading, setLoading] = useState(false); // For submitting
  
  const [form, setForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    subjek: '',
    isi: ''
  });

  useEffect(() => {
    getIdentitasSekolah().then(setIdentitas).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPesan({
        ...form,
        status: 'unread'
      });
      showToast('Pesan Anda berhasil dikirim!', 'success');
      setForm({ nama: '', email: '', no_hp: '', subjek: '', isi: '' });
    } catch (error) {
      console.error(error);
      showToast('Gagal mengirim pesan. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate Google Maps Embed URL based on coordinates
  const mapUrl = identitas?.koordinat_ls && identitas?.koordinat_lb 
    ? `https://maps.google.com/maps?q=${identitas.koordinat_ls},${identitas.koordinat_lb}&hl=id&z=15&output=embed`
    : `https://maps.google.com/maps?q=-6.200000,106.816666&hl=id&z=15&output=embed`; // Default Jakarta if no coords

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Hubungi Kami</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Punya pertanyaan seputar PPDB atau informasi sekolah? Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Informasi Kontak</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg text-secondary">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Alamat Sekolah</p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {identitas?.alamat || 'Jl. Pendidikan No. 1, Kota Tekno'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg text-secondary">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Telepon / WhatsApp</p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {identitas?.no_tlp || '(021) 1234-5678'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg text-secondary">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Email</p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {identitas?.email || 'info@smktekno.sch.id'}
                            </p>
                        </div>
                    </div>

                     <div className="flex items-start gap-4">
                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg text-secondary">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Website</p>
                            <p className="text-gray-700 dark:text-gray-300">
                                www.{identitas?.email?.split('@')[1] || 'smktekno.sch.id'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t dark:border-slate-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Clock size={16} /> Jam Operasional
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex justify-between">
                            <span>Senin - Jumat</span>
                            <span className="font-medium">07:00 - 16:00 WIB</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Sabtu</span>
                            <span className="font-medium">07:00 - 12:00 WIB</span>
                        </li>
                        <li className="flex justify-between text-red-500">
                            <span>Minggu</span>
                            <span className="font-medium">Tutup</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>

          {/* Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Kirim Pesan</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                            <input 
                                required
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-secondary outline-none transition"
                                placeholder="Nama Anda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input 
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-secondary outline-none transition"
                                placeholder="email@contoh.com"
                            />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor HP/WA</label>
                            <input 
                                required
                                name="no_hp"
                                value={form.no_hp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-secondary outline-none transition"
                                placeholder="08..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjek Pesan</label>
                            <input 
                                required
                                name="subjek"
                                value={form.subjek}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-secondary outline-none transition"
                                placeholder="Contoh: Pertanyaan PPDB"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Isi Pesan</label>
                        <textarea 
                            required
                            name="isi"
                            rows={4}
                            value={form.isi}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-secondary outline-none transition"
                            placeholder="Tulis pesan Anda di sini..."
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-secondary text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 font-bold flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                </form>
            </div>

            {/* Map Embed */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 h-80 overflow-hidden">
                <iframe 
                    title="Lokasi Sekolah"
                    src={mapUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, borderRadius: '12px' }} 
                    allowFullScreen 
                    loading="lazy"
                ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicKontak;
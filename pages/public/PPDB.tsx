import React, { useEffect, useState } from 'react';
import { getJurusan, createPendaftar } from '../../services/api';
import { Jurusan } from '../../types';
import { CheckCircle, AlertCircle } from 'lucide-react';

const PPDB: React.FC = () => {
  const [jurusan, setJurusan] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nama: '',
    asal_sekolah: '',
    jurusan_pilihan: '',
    no_hp: '',
    alamat: ''
  });

  useEffect(() => {
    getJurusan().then(setJurusan);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await createPendaftar(formData);
      setSuccess(true);
      setFormData({ nama: '', asal_sekolah: '', jurusan_pilihan: '', no_hp: '', alamat: '' });
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-10 shadow-sm border border-green-100 dark:border-green-800">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-green-100 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 dark:text-green-200 mb-8">
            Data Anda telah kami terima. Silakan tunggu informasi selanjutnya melalui nomor WhatsApp yang Anda daftarkan.
          </p>
          <button 
            onClick={() => setSuccess(false)} 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Daftar Siswa Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900 overflow-hidden border dark:border-slate-700">
        <div className="bg-secondary p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Formulir PPDB Online</h1>
          <p className="text-blue-100">Penerimaan Peserta Didik Baru Tahun Ajaran 2024/2025</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-lg flex items-center gap-2 border dark:border-red-800">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Sesuai Ijazah SMP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asal Sekolah</label>
              <input
                type="text"
                name="asal_sekolah"
                required
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.asal_sekolah}
                onChange={handleChange}
                placeholder="Nama SMP/MTs"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nomor WhatsApp</label>
              <input
                type="tel"
                name="no_hp"
                required
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="08..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilihan Jurusan</label>
              <select
                name="jurusan_pilihan"
                required
                className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                value={formData.jurusan_pilihan}
                onChange={handleChange}
              >
                <option value="">-- Pilih Jurusan --</option>
                {jurusan.map((j) => (
                  <option key={j.id} value={j.id}>{j.nama_jurusan}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat Lengkap</label>
            <textarea
              name="alamat"
              rows={3}
              className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Pastikan data yang Anda masukkan benar. Panitia akan menghubungi untuk verifikasi berkas.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PPDB;
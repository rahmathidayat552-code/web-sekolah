import React, { useEffect, useState } from 'react';
import { getAllBerita, createBerita, deleteBerita, uploadFile } from '../../services/api';
import { Berita } from '../../types';
import { Plus, Trash, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ManageBerita: React.FC = () => {
  const { user } = useAuth();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    judul: '',
    konten: '',
    status: 'draft',
    thumbnail: ''
  });

  useEffect(() => {
    loadBerita();
  }, []);

  const loadBerita = async () => {
    const data = await getAllBerita();
    setBeritaList(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      await deleteBerita(id);
      loadBerita();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadFile(e.target.files[0], 'web-sekolah', 'berita');
      setForm({ ...form, thumbnail: url });
    } catch (error) {
      alert('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const slug = form.judul.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      await createBerita({
        judul: form.judul,
        konten: form.konten,
        slug: slug + '-' + Date.now(),
        status: form.status as 'draft' | 'publish',
        thumbnail: form.thumbnail,
        penulis: user.id // Assuming Supabase Auth ID links to Profile ID
      });
      
      setIsCreating(false);
      setForm({ judul: '', konten: '', status: 'draft', thumbnail: '' });
      loadBerita();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan berita');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Berita</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          {isCreating ? 'Batal' : <><Plus size={18} /> Buat Berita</>}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm mb-8 border border-gray-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Judul Berita</label>
              <input 
                required
                className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none" 
                value={form.judul} 
                onChange={e => setForm({...form, judul: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Thumbnail</label>
              <input type="file" onChange={handleImageUpload} className="mb-2 text-gray-500 dark:text-gray-400" />
              {uploading && <span className="text-xs text-gray-500 dark:text-gray-400">Uploading...</span>}
              {form.thumbnail && <img src={form.thumbnail} alt="Preview" className="h-20 w-auto rounded border" />}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Konten</label>
              <textarea 
                required
                rows={5}
                className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none" 
                value={form.konten} 
                onChange={e => setForm({...form, konten: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="draft"
                  checked={form.status === 'draft'}
                  onChange={e => setForm({...form, status: e.target.value})} 
                /> Draft
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="publish"
                  checked={form.status === 'publish'}
                  onChange={e => setForm({...form, status: e.target.value})} 
                /> Publish
              </label>
            </div>

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Simpan</button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
            <tr>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Judul</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Status</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {beritaList.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="p-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{item.judul}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'publish' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBerita;
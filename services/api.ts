import { supabase } from '../supabaseClient';
import { Berita, Jurusan, PPDBPendaftar, Pengumuman, IdentitasSekolah, Guru, Galeri, Pesan, Profile } from '../types';

// --- Berita Service ---
export const getPublicBerita = async () => {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Berita[];
};

export const getAllBerita = async () => {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Berita[];
};

export const createBerita = async (berita: Partial<Berita>) => {
  const { data, error } = await supabase.from('berita').insert(berita).select().single();
  if (error) throw error;
  return data;
};

export const updateBerita = async (id: string, berita: Partial<Berita>) => {
  const { data, error } = await supabase.from('berita').update(berita).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteBerita = async (id: string) => {
  const { error } = await supabase.from('berita').delete().eq('id', id);
  if (error) throw error;
};

// --- Jurusan Service ---
export const getJurusan = async () => {
  const { data, error } = await supabase.from('jurusan').select('*').order('nama_jurusan', { ascending: true });
  if (error) throw error;
  return data as Jurusan[];
};

export const createJurusan = async (jurusan: Partial<Jurusan>) => {
  const { data, error } = await supabase.from('jurusan').insert(jurusan).select().single();
  if (error) throw error;
  return data;
};

export const updateJurusan = async (id: string, jurusan: Partial<Jurusan>) => {
  const { data, error } = await supabase.from('jurusan').update(jurusan).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteJurusan = async (id: string) => {
  const { error } = await supabase.from('jurusan').delete().eq('id', id);
  if (error) throw error;
};

// --- Guru Service ---
export const getAllGuru = async () => {
  const { data, error } = await supabase
    .from('guru')
    .select('*, jurusan:jurusan_id(nama_jurusan)')
    .order('nama', { ascending: true });
  if (error) throw error;
  return data as Guru[];
};

export const createGuru = async (guru: Partial<Guru>) => {
  const { data, error } = await supabase.from('guru').insert(guru).select().single();
  if (error) throw error;
  return data;
};

export const updateGuru = async (id: string, guru: Partial<Guru>) => {
  const { data, error } = await supabase.from('guru').update(guru).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteGuru = async (id: string) => {
  const { error } = await supabase.from('guru').delete().eq('id', id);
  if (error) throw error;
};

// --- Galeri Service ---
export const getGaleri = async () => {
  const { data, error } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Galeri[];
};

export const createGaleri = async (galeri: Partial<Galeri>) => {
  const { data, error } = await supabase.from('galeri').insert(galeri).select().single();
  if (error) throw error;
  return data;
};

export const updateGaleri = async (id: string, galeri: Partial<Galeri>) => {
  const { data, error } = await supabase.from('galeri').update(galeri).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteGaleri = async (id: string) => {
  const { error } = await supabase.from('galeri').delete().eq('id', id);
  if (error) throw error;
};

// --- Pesan Service ---
export const getPesan = async () => {
  const { data, error } = await supabase.from('pesan').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Pesan[];
};

export const createPesan = async (pesan: Partial<Pesan>) => {
  const { data, error } = await supabase.from('pesan').insert(pesan).select().single();
  if (error) throw error;
  return data;
};

export const updateStatusPesan = async (id: string, status: 'read' | 'unread' | 'replied') => {
  const { data, error } = await supabase.from('pesan').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deletePesan = async (id: string) => {
  const { error } = await supabase.from('pesan').delete().eq('id', id);
  if (error) throw error;
};

// --- PPDB Service ---
export const createPendaftar = async (pendaftar: Partial<PPDBPendaftar>) => {
  const { data, error } = await supabase.from('ppdb_pendaftar').insert(pendaftar).select().single();
  if (error) throw error;
  return data;
};

export const getPendaftar = async () => {
  const { data, error } = await supabase
    .from('ppdb_pendaftar')
    .select('*, jurusan:jurusan_pilihan(nama_jurusan)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as PPDBPendaftar[];
};

export const updateStatusPendaftar = async (id: string, status: string) => {
  const { error } = await supabase
    .from('ppdb_pendaftar')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
};

export const deletePendaftar = async (id: string) => {
  const { error } = await supabase.from('ppdb_pendaftar').delete().eq('id', id);
  if (error) throw error;
};

// --- Pengumuman Service ---
export const getActivePengumuman = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('pengumuman')
    .select('*')
    .eq('status', true)
    .lte('tanggal_mulai', today)
    .or(`tanggal_selesai.is.null,tanggal_selesai.gte.${today}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Pengumuman[];
};

export const getAllPengumuman = async () => {
  const { data, error } = await supabase
    .from('pengumuman')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Pengumuman[];
};

export const createPengumuman = async (pengumuman: Partial<Pengumuman>) => {
  const { data, error } = await supabase.from('pengumuman').insert(pengumuman).select().single();
  if (error) throw error;
  return data;
};

export const updatePengumuman = async (id: string, pengumuman: Partial<Pengumuman>) => {
  const { data, error } = await supabase.from('pengumuman').update(pengumuman).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deletePengumuman = async (id: string) => {
  const { error } = await supabase.from('pengumuman').delete().eq('id', id);
  if (error) throw error;
};

// --- Identitas Sekolah Service ---
export const getIdentitasSekolah = async () => {
  // Ambil baris pertama saja
  const { data, error } = await supabase
    .from('identitas_sekolah')
    .select('*')
    .limit(1)
    .single();
  
  // Jika error karena row tidak ditemukan (belum ada data), return null tanpa throw
  if (error && error.code === 'PGRST116') return null; 
  if (error) throw error;
  return data as IdentitasSekolah;
};

export const saveIdentitasSekolah = async (data: Partial<IdentitasSekolah>) => {
    // Jika ada ID, update. Jika tidak, insert.
    // Karena kita desainnya single row, kita bisa cek dulu atau gunakan upsert.
    // Cara paling aman untuk single row settings:
    const existing = await getIdentitasSekolah();
    
    if (existing && existing.id) {
        const { data: result, error } = await supabase
            .from('identitas_sekolah')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single();
        if (error) throw error;
        return result;
    } else {
        const { data: result, error } = await supabase
            .from('identitas_sekolah')
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return result;
    }
};

// --- User Profile Service ---
export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Profile[];
};

export const updateProfile = async (id: string, profile: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProfile = async (id: string) => {
  // Note: This only deletes from the 'profiles' table. 
  // Ideally, you should also delete from auth.users using Supabase Admin API (backend).
  // For client-side, we can only remove the profile data.
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) throw error;
};


// --- Storage Service ---
// Bucket Name: web-sekolah
type AllowedFolder = 'berita' | 'galeri' | 'guru' | 'jurusan' | 'ppdb' | 'identitas';

export const uploadFile = async (file: File, folder: AllowedFolder) => {
  const BUCKET_NAME = 'web-sekolah';
  
  // 1. Sanitize file name to avoid issues with Supabase Storage URLs
  const fileExt = file.name.split('.').pop();
  const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${Date.now()}_${rawName}.${fileExt}`;
  
  // 2. Construct path: folder/filename
  const filePath = `${folder}/${fileName}`;
  
  // 3. Upload
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // 4. Get Public URL
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
};
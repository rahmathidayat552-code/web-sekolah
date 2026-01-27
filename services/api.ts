import { supabase } from '../supabaseClient';
import { Berita, Jurusan, PPDBPendaftar, Pengumuman } from '../types';

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
  const { data, error } = await supabase.from('jurusan').select('*');
  if (error) throw error;
  return data as Jurusan[];
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
  return data; // returns joined data
};

export const updateStatusPendaftar = async (id: string, status: string) => {
  const { error } = await supabase
    .from('ppdb_pendaftar')
    .update({ status })
    .eq('id', id);
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

// --- Storage Service ---
export const uploadFile = async (file: File, bucket: string, folder: string = '') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};
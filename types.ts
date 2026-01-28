
export interface Berita {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  thumbnail: string | null;
  status: 'draft' | 'publish';
  created_at: string;
  penulis?: string;
}

export interface Jurusan {
  id: string;
  nama_jurusan: string;
  singkatan: string;
  deskripsi: string | null;
  icon: string | null;
}

export interface Guru {
  id: string;
  nama: string;
  nip: string | null;
  mapel: string | null;
  jurusan_id: string | null;
  foto: string | null;
  jurusan?: Jurusan;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  status: boolean;
  created_at: string;
}

export interface PPDBPendaftar {
  id: string;
  nama: string;
  asal_sekolah: string;
  jurusan_pilihan: string;
  no_hp: string;
  alamat: string | null;
  status: 'baru' | 'verifikasi' | 'diterima' | 'ditolak';
  created_at: string;
  jurusan?: Jurusan;
}

export interface Galeri {
  id: string;
  judul: string;
  deskripsi: string | null;
  image_url: string;
  created_at: string;
}

export interface Pesan {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  subjek: string;
  isi: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface Profile {
  id: string;
  nama: string;
  role: 'admin' | 'operator';
  created_at?: string;
}

export interface IdentitasSekolah {
  id?: string;
  nama_sekolah: string;
  npsn: string;
  alamat: string;
  email: string;
  no_tlp: string;
  koordinat_ls: string;
  koordinat_lb: string;
  nama_kepsek: string;
  nip_kepsek: string;
  foto_kepsek: string | null;
  logo_sekolah: string | null;
}

export interface MedsosSekolah {
  id?: string;
  instagram: string | null;
  whatsapp: string | null;
  facebook: string | null;
  youtube: string | null;
  tiktok: string | null;
}

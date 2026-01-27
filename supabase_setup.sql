-- ==========================================
-- SCRIPT PERBAIKAN ROW LEVEL SECURITY (RLS)
-- Jalankan script ini di SQL Editor Supabase
-- ==========================================

-- 1. Pastikan RLS Aktif --
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ppdb_pendaftar ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pengumuman ENABLE ROW LEVEL SECURITY;

-- 2. TRIGGER OTOMATIS UNTUK PROFIL (SOLUSI RLS REGISTER) --
-- Fungsi ini akan berjalan otomatis saat user baru mendaftar di Auth --
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nama', 'Admin'), 
    COALESCE(new.raw_user_meta_data->>'role', 'operator')
  )
  ON CONFLICT (id) DO UPDATE
  SET nama = EXCLUDED.nama, role = EXCLUDED.role;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Security Definer mem-bypass RLS untuk fungsi ini

-- Pasang Trigger ke tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. POLICIES (ATURAN AKSES DATA) --

-- >> Tabel Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- >> Tabel Berita
DROP POLICY IF EXISTS "Public read published berita" ON berita;
CREATE POLICY "Public read published berita" ON berita FOR SELECT USING (status = 'publish');

DROP POLICY IF EXISTS "Admin full access berita" ON berita;
CREATE POLICY "Admin full access berita" ON berita FOR ALL USING (auth.role() = 'authenticated');

-- >> Tabel PPDB (Penting untuk Pendaftaran Siswa)
DROP POLICY IF EXISTS "Allow public insert for PPDB" ON ppdb_pendaftar;
CREATE POLICY "Allow public insert for PPDB" ON ppdb_pendaftar FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access PPDB" ON ppdb_pendaftar;
CREATE POLICY "Admin full access PPDB" ON ppdb_pendaftar FOR ALL USING (auth.role() = 'authenticated');

-- >> Tabel Jurusan & Pengumuman
DROP POLICY IF EXISTS "Public read jurusan" ON jurusan;
CREATE POLICY "Public read jurusan" ON jurusan FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin all jurusan" ON jurusan;
CREATE POLICY "Admin all jurusan" ON jurusan FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read pengumuman" ON pengumuman;
CREATE POLICY "Public read pengumuman" ON pengumuman FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin all pengumuman" ON pengumuman;
CREATE POLICY "Admin all pengumuman" ON pengumuman FOR ALL USING (auth.role() = 'authenticated');


-- 4. STORAGE POLICIES (Untuk Upload Gambar) --
-- Mengatur akses ke bucket 'web-sekolah' --

DROP POLICY IF EXISTS "Public access bucket" ON storage.objects;
CREATE POLICY "Public access bucket" ON storage.objects FOR SELECT USING (bucket_id = 'web-sekolah');

DROP POLICY IF EXISTS "Auth upload bucket" ON storage.objects;
CREATE POLICY "Auth upload bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'web-sekolah' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth update bucket" ON storage.objects;
CREATE POLICY "Auth update bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'web-sekolah' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete bucket" ON storage.objects;
CREATE POLICY "Auth delete bucket" ON storage.objects FOR DELETE USING (bucket_id = 'web-sekolah' AND auth.role() = 'authenticated');


-- 5. TABEL IDENTITAS SEKOLAH --
CREATE TABLE IF NOT EXISTS identitas_sekolah (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_sekolah text NOT NULL,
    npsn text,
    alamat text,
    email text,
    no_tlp text,
    koordinat_ls text,
    koordinat_lb text,
    nama_kepsek text,
    nip_kepsek text,
    foto_kepsek text,
    logo_sekolah text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE identitas_sekolah ENABLE ROW LEVEL SECURITY;

-- Policy Identitas Sekolah
DROP POLICY IF EXISTS "Public read identitas" ON identitas_sekolah;
CREATE POLICY "Public read identitas" ON identitas_sekolah FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update identitas" ON identitas_sekolah;
CREATE POLICY "Admin update identitas" ON identitas_sekolah FOR ALL USING (auth.role() = 'authenticated');

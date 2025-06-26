# IQBALRISKANIKAH

**IQBALRISKANIKAH** adalah sebuah website undangan pernikahan iqbal & riska yang terinspirasi dari tampilan _Netflix_, memberikan pengalaman visual menarik dan modern untuk pengguna. Proyek ini dibangun menggunakan **React** dengan bundler **Vite**, dilengkapi dengan **Supabase** untuk mengelola data undangan, serta dirancang agar mudah diakses, responsif, dan estetis.

## Demo

Anda dapat melihat demo langsung dari IQBALRISKANIKAH di sini: [IQBALRISKANIKAH - Demo](https://nikahfix-v01.vercel.app/).
Jika anda memiliki tujuan spesifik undangannya, bisa dibuat link seperti berikut [https://nikahfix-v01.vercel.app/?to=tajul+dan+gorbon](https://nikahfix-v01.vercel.app/?to=tajul+dan+gorbon)

## Teknologi yang Digunakan

- **React**: Library JavaScript untuk membangun antarmuka pengguna.
- **Vite**: Bundler modern untuk pengembangan aplikasi web cepat dengan konfigurasi minimal.
- **TailwindCSS**: Untuk mendesain tampilan visual agar lebih menarik.
- **Supabase**: Backend sebagai layanan untuk autentikasi, database, dan API real-time.
- **Vercel**: Platform hosting yang digunakan untuk menyajikan demo.

## Instalasi

Berikut adalah langkah-langkah untuk menginstal proyek ini di lingkungan lokal Anda:

1. **Clone Repository**:

   `git clone https://github.com/sanjikunnn/iqbalriskanikah.git`

2. **Masuk ke Direktori Proyek**:

   `cd iqbalriskanikah`

3. **Instal Dependensi**:
   Pastikan Anda sudah menginstal Node.js. Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan.

   `npm install`

4. **Menjalankan Proyek**:
   Setelah semua dependensi terpasang, jalankan proyek dengan perintah:

   `npm run dev`

5. **Mengakses Proyek**:
   Buka browser Anda dan akses proyek di

   `http://localhost:5173`

---

# Integrasi Supabase di IQBALRISKANIKAH

NIKAHFIX menggunakan **Supabase** untuk mengelola data undangan pernikahan, seperti informasi tamu, pesan, dan acara. Supabase menyediakan layanan **auth**, **database**, dan **storage** untuk membangun aplikasi secara cepat dan efisien.

## Langkah-langkah Integrasi Supabase

### 1. Mendaftar ke Supabase

- Kunjungi [Supabase](https://supabase.io) dan buat akun, kemudian buat proyek baru.
- Setelah proyek dibuat, Anda akan mendapatkan URL dan **anon key** untuk mengakses Supabase.

### 2. Menambahkan Variabel Lingkungan (Environment Variables)

Untuk menyimpan kredensial Supabase, buat file `.env` di root proyek dan tambahkan variabel berikut:

```
VITE_APP_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_SUPABASE_URL=https://your-project-url.supabase.co
VITE_APP_TABLE_NAME=your-table-name
```

Gantilah `your-anon-key`, `your-project-url.supabase.co`, dan `your-table-name` sesuai dengan kredensial proyek Supabase Anda.

### 3. Menginstal Supabase Client

Pasang dependensi Supabase untuk React:

```bash
npm install @supabase/supabase-js
```

## Struktur Proyek

Berikut adalah struktur direktori proyek yang telah terintegrasi dengan Supabase:

- `src/` - Berisi komponen utama, logika aplikasi, dan konfigurasi Supabase.
  - `supabaseClient.js` - File konfigurasi Supabase.
  - `App.js` - Komponen utama aplikasi.
- `public/` - Berisi aset-aset statis, seperti gambar dan ikon.
- `.env` - Berisi variabel lingkungan untuk kredensial Supabase.

## Kesimpulan

Dengan mengintegrasikan Supabase, Anda dapat dengan mudah mengelola data undangan pernikahan seperti tamu, pesan, dan acara menggunakan Supabase sebagai backend. Anda juga dapat memanfaatkan fitur autentikasi Supabase untuk memungkinkan tamu RSVP atau mengakses halaman pribadi.

---

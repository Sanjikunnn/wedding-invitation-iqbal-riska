Untuk mengisinya, kamu perlu mengganti teks deskripsi placeholder dengan informasi spesifik dari repositori/proyek milikmu.

Berikut adalah panduan isi dan contoh draf lengkap yang tinggal kamu sesuaikan (*copy-paste*):

---

# Kebijakan Keamanan

## Versi yang Didukung

Tabel ini digunakan untuk memberi tahu pengguna versi mana saja yang masih mendapatkan pembaruan keamanan (*security patches*).

* **Cara mengisi:** Sesuaikan angka versi dengan rilis proyekmu. Gunakan `:white_check_mark:` ($\checkmark$) untuk versi yang didukung dan `:x:` ($\mathbf{X}$) untuk versi yang sudah tidak didukung.

| Versi | Didukung |
| --- | --- |
| 5.1.x | :white_check_mark: |
| 5.0.x | :x: |
| 4.0.x | :white_check_mark: |
| < 4.0 | :x: |

---

## Melaporkan Celah Keamanan (*Vulnerability*)

Bagian ini menjelaskan prosedur penanganan bug/celah keamanan agar tidak dipublikasikan secara terbuka sebelum diperbaiki.

### Contoh Draf Pengisian (Tinggal Disesuaikan):

Kami sangat menghargai kontribusi komunitas dalam menjaga keamanan proyek ini. Jika Anda menemukan celah keamanan, mohon untuk **tidak** melaporkannya melalui *public issue tracker* di GitHub.

### Cara Melaporkan

Silakan kirimkan detail temuan Anda melalui email ke: **[email-keamanan-kamu@domain.com]** (atau buat *Draft Security Advisory* langsung di tab **Security** > **Advisories** pada repositori GitHub ini).

Mohon sertakan informasi berikut dalam laporan Anda:

1. Deskripsi celah keamanan dan dampaknya.
2. Langkah-langkah untuk mereproduksi masalah (*proof of concept*).
3. Versi proyek yang terdampak.

### Proses & Respon

* **Konfirmasi Awal:** Kami akan mengonfirmasi penerimaan laporan Anda dalam waktu **[misal: 24–48 jam]**.
* **Pembaruan Status:** Kami akan memberikan pembaruan berkala setiap **[misal: 3–5 hari kerja]** mengenai proses investigasi dan perbaikan.
* **Penanganan:** Jika laporan diterima, kami akan merilis *patch* keamanan pada versi yang didukung dan mencantumkan nama Anda di catatan rilis (*kredit/penghargaan*), kecuali jika Anda memilih untuk tetap anonim. Jika laporan ditolak, kami akan memberikan penjelasan alasannya secara transparan.

---

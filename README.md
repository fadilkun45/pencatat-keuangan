# Pencatat Keuangan

PWA pencatat jajan: bikin budget per kategori, catat pengeluaran, lihat sisanya. Data disimpan di HP (localStorage) jadi mencatat selalu instan, lalu dikirim ke Google Sheet di background.

```bash
npm install
npm run dev     # pengembangan
npm test        # tes data & sinkronisasi
npm run build
```

Stack: React 18, Redux Toolkit, Tailwind CSS 4, vite-plugin-pwa.

## Hubungkan ke Google Sheet

1. Buat Google Sheet baru.
2. Buka **Extensions → Apps Script**, hapus isinya, tempel isi [`apps-script/Code.gs`](apps-script/Code.gs), lalu simpan.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Salin URL yang berakhiran `/exec`.
5. Di app, tekan tombol **Sheet**, tempel URL-nya, lalu **Simpan link**. Semua catatan yang sudah ada langsung dikirim.

Hasilnya masuk ke tab `Transaksi` dengan kolom `uid, tanggal, kategori, nama, nominal`. Untuk rekap per kategori atau per bulan, pakai Pivot table di tab lain dan jangan ubah tab `Transaksi`.

Cara kerjanya:
- Setiap tambah atau hapus pengeluaran masuk antrean dan langsung dikirim. Kalau sedang offline atau gagal, antrean disimpan dan dikirim lagi saat online atau saat app dibuka. Titik di tombol **Sheet** menunjukkan status: hijau berarti terkirim, kuning berarti ada antrean, merah berarti gagal.
- Pengiriman bersifat idempoten berdasarkan `uid`, jadi kirim ulang tidak menghasilkan baris dobel.
- Arahnya satu: app ke Sheet. Edit langsung di Sheet tidak akan kembali ke app.

**Keamanan:** URL `/exec` berfungsi sebagai kunci. Siapa pun yang tahu URL-nya bisa menambah atau menghapus baris di tab itu, jadi jangan dibagikan. Kalau bocor, buat deployment baru dan ganti link di app.

Kalau setelah mengubah `Code.gs` kamu ingin URL-nya tetap sama, pilih **Deploy → Manage deployments → Edit → New version**.

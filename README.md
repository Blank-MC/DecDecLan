# DECLAN — Satu Tim, Banyak Arena

Website portofolio untuk tim kompetisi **DECLAN** dari Semarang dan Yogyakarta.
Fokusnya lintas bidang: web development, ethical hacking/CTF, esports/gaming,
serta UI/UX dan creative tech. Dibuat sebagai situs statis (HTML + CSS + JS),
tanpa framework dan tanpa build step.

---

## Cara menjalankan

1. Buka **Laragon**, klik **Start All** (Apache harus menyala).
2. Buka salah satu alamat berikut:
   - `http://localhost/declan/`
   - `http://declan.test` (jika Pretty URLs / auto virtual host aktif)

Bisa juga dibuka langsung dengan double-click `index.html`, tetapi font lokal
dan perilaku beberapa browser lebih stabil saat diakses lewat server.

---

## Struktur folder

```
declan/
├─ index.html                  # seluruh konten & markup
├─ README.md
├─ .htmlvalidate.json          # konfigurasi validasi HTML (opsional)
└─ assets/
   ├─ css/
   │  └─ main.css              # seluruh styling, animasi, responsive
   ├─ js/
   │  └─ main.js               # preloader, menu, reveal, lightbox, form, dll.
   ├─ fonts/                   # Anton + Sora (self-hosted, offline-ready)
   └─ img/
      ├─ logo-declan.jpeg      # logo utama
      ├─ favicon-32.png
      ├─ favicon-192.png
      ├─ apple-touch-icon.png
      ├─ og-cover.jpg          # preview sosial (1200 × 630)
      ├─ merch-poster.jpeg     # poster Match Day
      ├─ merch-jersey.jpeg     # jersey Home 26
      ├─ merch-jacket-front.jpeg
      ├─ merch-jacket-back.jpeg
      ├─ merch-figure.jpeg     # art toy
      ├─ merch-pillow.jpeg     # bantal
      ├─ merch-fankit.jpeg     # mousepad, topi, lanyard, tumbler
      ├─ merch-mascot.jpeg     # maskot 德龙 + background hero
      └─ merch-cards.jpeg      # booster pack & collector's box
```

Total aset gambar ±3 MB. Semua gambar di bawah lipatan sudah `loading="lazy"`.

---

## Peta gambar

Foto dari folder `Downloads/Bahan` semuanya **foto produk/merch**, bukan foto
pemain. Pemetaannya:

| File asli | Disimpan sebagai | Dipakai di |
|---|---|---|
| `...11.30.20.jpeg` (persegi) | `logo-declan.jpeg` | navbar, preloader, crest hero, footer, favicon |
| `...11.29.31.jpeg` | `merch-poster.jpeg` | Merch — Match Day Poster |
| `...11.32.12.jpeg` | `merch-jersey.jpeg` | Merch — Jersey Home 26 |
| `...11.33.15.jpeg` | `merch-jacket-front.jpeg` | Varsity Naga (depan) |
| `...11.33.44.jpeg` | `merch-jacket-back.jpeg` | Varsity Naga (belakang) |
| `...11.39.59.jpeg` | `merch-figure.jpeg` | Merch — Naga Emas Figure |
| `...11.41.19.jpeg` | `merch-pillow.jpeg` | Merch — Bantal Kawung |
| `...11.39.05.jpeg` | `merch-fankit.jpeg` | Fan Kit + lookbook |
| `...11.43.20.jpeg` | `merch-mascot.jpeg` | background hero + lookbook |
| `...11.44.12.jpeg` | `merch-cards.jpeg` | Booster Pack + lookbook |

Kalau ada foto yang tertukar, cukup ganti nama file di `assets/img/` atau ubah
`src` pada kartu yang bersangkutan di `index.html`.

Karena foto anggota tim asli tidak tersedia, kartu tim memakai **plate monogram**
(initial + karakter Han) yang dibuat murni dengan CSS — bukan foto orang.
Ganti nama dan bidang pada blok `<article class="pcard">` serta plate monogram
jika profil anggota sebenarnya sudah tersedia.

---

## Bagian yang bisa diedit cepat

| Ingin mengubah | Lokasi |
|---|---|
| Nama, tagline, deskripsi | `<head>` + bagian `.hero` |
| Nama/role/origin/stat anggota tim | blok `<article class="pcard">` di `index.html` |
| Cabang kompetisi | hero, marquee, kartu tim, dan formulir di `index.html` |
| Produk, harga, badge merch | blok `<article class="mcard">` di `#merch` (gambar ada di `.mcard-media`) |
| Caption lookbook | atribut `data-caption` dan teks `.g-cap` |
| Timeline prestasi | blok `<article class="t-item">` |
| Cabang pada marquee kompetisi | `.partner-track` |
| Email & alamat | bagian `#kontak` + footer |
| Link sosial | semua `href="#"` pada `.footer-social` (ganti dengan URL asli) |
| Formulir | `#joinForm` — saat ini hanya menampilkan toast (belum kirim ke server) |

> **Catatan:** nama orang, cerita, statistik, kompetisi/hasil lomba, alamat, email, nama
> sponsor, serta **produk dan harga merch** di situs ini fiktif (dibuat untuk
> kebutuhan portofolio). Ganti dengan data asli sebelum dipublikasikan. Untuk
> ethical hacking, gunakan hanya lab, CTF, atau sistem yang memberi izin eksplisit.

---

## Kustomisasi visual

Semua warna dan font diatur lewat CSS variables di bagian atas
`assets/css/main.css`:

```css
:root {
  --bg: #060a09;        /* latar utama */
  --gold: #d8a76b;      /* aksen utama */
  --gold-2: #f3d6a5;
  --jade: #5fc9b0;      /* aksen sekunder */
  --seal: #b4432f;      /* merah stempel Tiongkok */
  --text: #f3f0e8;
  --muted: #9aa7a2;
  --ff-display: 'Anton', ...;
  --ff-body: 'Sora', ...;
}
```

- **Font** disimpan lokal di `assets/fonts/` supaya tetap tampil tanpa internet.
- **Motif batik kawung** dibuat sebagai pattern SVG data-URI di CSS.
- **Ukuran judul hero** memakai `clamp()` berbasis `vw`, jadi tetap proporsional
  di layar besar maupun ponsel.

---

## Fitur

- Preloader dengan logo dan progress bar
- Navigasi sticky + progress bar scroll + active section
- Menu seluler full-screen
- Hero paralaks + animasi huruf per huruf + crest logo berputar
- **Section cabang & tim inti**: web development, ethical hacking/CTF, esports/gaming, UI/UX, dan creative tech
- **Section merch Drop 001**: 8 produk, badge stok, harga, dan kartu varsity jacket yang bisa dibalik (depan/belakang)
- Reveal on scroll, counter angka, kartu tim dengan efek tilt 3D
- Lightbox galeri (klik, panah kiri/kanan, Escape)
- Form demo dengan validasi HTML; data tidak dikirim atau disimpan
- Cursor kustom (khusus perangkat dengan mouse)
- `prefers-reduced-motion` support, skip link, focus state, aria-label
- Responsive: 1440 / 1280 / 1024 / 768 / 600 / 390 px

---

## Catatan performa & aksesibilitas

- Font `font-display: swap`; hero image di-preload.
- Semua gambar punya dimensi `width`/`height` untuk mengurangi layout shift.
- Audit otomatis Axe (WCAG 2.1 A/AA) di halaman ini: **0 violation**.
- Sudah diuji headless Chrome pada viewport 1440, 1280, 768, dan 390 tanpa
  horizontal scroll dan tanpa error console.

Selamat memakai. Kalau mau menambah halaman (news, profil anggota tim, store),
halaman itu bisa dibuat dengan pola section yang sama seperti di `index.html`.

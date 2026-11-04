// =========================================================
// DATA PRODUK TOKO
// Edit file ini untuk menambah, mengubah, atau menghapus barang.
// Nama, harga, dan stok di bawah ini hanya CONTOH. Ganti dengan data aslimu.
//
// Keterangan field:
//   id         : angka unik, jangan sama antar produk
//   kategori   : harus salah satu dari daftar KATEGORI di bawah
//   harga      : harga jual (angka, tanpa titik)
//   hargaAsli  : (opsional) harga sebelum diskon. Kalau lebih besar dari harga,
//                label Sale dan persen diskon muncul otomatis
//   stok       : jumlah tersedia (0 = habis)
//   terjual    : jumlah terjual, dipakai untuk urutan "Terlaris"
//   tanggal    : tanggal barang masuk (TTTT-BB-HH), dipakai untuk urutan "Terbaru"
//   label      : (opsional) 'best-seller' dan/atau 'new'
//   gambar     : file foto di folder img/produk/
//   kompatibel : tipe Vespa yang cocok (dipakai di halaman detail, Tahap 2).
//                Pastikan diisi sesuai barang aslinya.
// =========================================================

const KATEGORI = [
  'Mesin dan Komponen',
  'Kelistrikan',
  'Karburator',
  'Pengereman',
  'Body dan Aksesori',
  'Transmisi',
  'Ban dan Velg'
];

const produk = [
  { id: 1,  nama: 'Piston Kit',          kategori: 'Mesin dan Komponen', harga: 450000, stok: 8,  terjual: 34,  tanggal: '2026-09-10', label: ['best-seller'], gambar: 'img/produk/piston-kit.jpg',     kompatibel: ['Vespa Super', 'Vespa Sprint'], deskripsi: 'Piston lengkap dengan ring dan pen.' },
  { id: 2,  nama: 'Gasket Set Mesin',    kategori: 'Mesin dan Komponen', harga: 95000,  stok: 15, terjual: 21,  tanggal: '2026-10-20', label: ['new'],         gambar: 'img/produk/gasket-set.jpg',     kompatibel: ['Vespa Super', 'Vespa PX'],     deskripsi: 'Satu set gasket untuk turun mesin.' },
  { id: 3,  nama: 'Busi',                kategori: 'Kelistrikan',        harga: 35000,  stok: 40, terjual: 120, tanggal: '2026-06-01', label: ['best-seller'], gambar: 'img/produk/busi.jpg',           kompatibel: ['Semua tipe (cek kode busi)'],  deskripsi: 'Busi pengganti untuk pengapian yang stabil.' },
  { id: 4,  nama: 'Set Platina',         kategori: 'Kelistrikan',        harga: 85000,  stok: 3,  terjual: 18,  tanggal: '2026-08-05', label: [],              gambar: 'img/produk/platina.jpg',        kompatibel: ['Vespa Super', 'Vespa Sprint'], deskripsi: 'Platina dan kondensor untuk sistem pengapian.' },
  { id: 5,  nama: 'Karburator',          kategori: 'Karburator',         harga: 650000, stok: 4,  terjual: 12,  tanggal: '2026-07-14', label: [],              gambar: 'img/produk/karburator.jpg',     kompatibel: ['Vespa PX', 'Vespa Excel'],     deskripsi: 'Karburator pengganti siap pasang.' },
  { id: 6,  nama: 'Jet Utama Karburator',kategori: 'Karburator',         harga: 25000,  stok: 0,  terjual: 45,  tanggal: '2026-05-22', label: [],              gambar: 'img/produk/jet-utama.jpg',      kompatibel: ['Vespa PX', 'Vespa Excel'],     deskripsi: 'Jet utama berbagai ukuran.' },
  { id: 7,  nama: 'Kampas Rem',          kategori: 'Pengereman',         harga: 75000,  hargaAsli: 90000, stok: 20, terjual: 56, tanggal: '2026-09-28', label: [], gambar: 'img/produk/kampas-rem.jpg',     kompatibel: ['Vespa Super', 'Vespa PX'],     deskripsi: 'Kampas rem untuk pengereman yang pakem.' },
  { id: 8,  nama: 'Kabel Rem Depan',     kategori: 'Pengereman',         harga: 40000,  stok: 12, terjual: 27,  tanggal: '2026-08-19', label: [],              gambar: 'img/produk/kabel-rem.jpg',      kompatibel: ['Vespa Super', 'Vespa Sprint'], deskripsi: 'Kabel rem depan lengkap dengan selongsong.' },
  { id: 9,  nama: 'Spion Bulat',         kategori: 'Body dan Aksesori',  harga: 150000, stok: 6,  terjual: 15,  tanggal: '2026-10-25', label: ['new'],         gambar: 'img/produk/spion.jpg',          kompatibel: ['Semua tipe'],                  deskripsi: 'Spion bulat dengan tampilan klasik.' },
  { id: 10, nama: 'Jok Kulit',           kategori: 'Body dan Aksesori',  harga: 320000, hargaAsli: 380000, stok: 5, terjual: 9, tanggal: '2026-07-30', label: [], gambar: 'img/produk/jok.jpg',            kompatibel: ['Vespa Super'],                 deskripsi: 'Jok kulit dengan jahitan rapi.' },
  { id: 11, nama: 'Kampas Kopling',      kategori: 'Transmisi',          harga: 120000, stok: 10, terjual: 48,  tanggal: '2026-09-02', label: ['best-seller'], gambar: 'img/produk/kampas-kopling.jpg', kompatibel: ['Vespa Super', 'Vespa PX'],     deskripsi: 'Satu set kampas kopling.' },
  { id: 12, nama: 'Kabel Kopling',       kategori: 'Transmisi',          harga: 45000,  stok: 18, terjual: 30,  tanggal: '2026-08-11', label: [],              gambar: 'img/produk/kabel-kopling.jpg',  kompatibel: ['Vespa Super', 'Vespa PX'],     deskripsi: 'Kabel kopling lengkap dengan selongsong.' },
  { id: 13, nama: 'Ban Luar Ring 10',    kategori: 'Ban dan Velg',       harga: 280000, stok: 9,  terjual: 22,  tanggal: '2026-10-02', label: [],              gambar: 'img/produk/ban-luar.jpg',       kompatibel: ['Vespa Super', 'Vespa PX'],     deskripsi: 'Ban luar ring 10 untuk pemakaian harian.' },
  { id: 14, nama: 'Velg Ring 10',        kategori: 'Ban dan Velg',       harga: 380000, stok: 2,  terjual: 7,   tanggal: '2026-10-18', label: ['new'],         gambar: 'img/produk/velg.jpg',           kompatibel: ['Vespa Super', 'Vespa Sprint'], deskripsi: 'Velg ring 10 siap pasang.' }
];
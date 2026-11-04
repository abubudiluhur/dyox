(function () {
  'use strict';

  // =========================================================
  // PENGATURAN
  // =========================================================
  const NOMOR_WA = '6285959602525';   // nomor WhatsApp penerima pesanan (format 62...)
  const NAMA_TOKO = 'Toko Sparepart Vespa Klasik';
  const STOK_MENIPIS = 5;             // stok sampai angka ini ditandai "tinggal sedikit"

  const KUNCI_KERANJANG = 'keranjang-vespa';
  const KUNCI_FAVORIT = 'favorit-vespa';

  // Gambar pengganti kalau file foto belum ada
  const FOTO_KOSONG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">' +
    '<rect width="100%" height="100%" fill="#f1efe9"/>' +
    '<text x="50%" y="50%" fill="#6b675e" font-family="sans-serif" font-size="20" text-anchor="middle">Foto belum tersedia</text>' +
    '</svg>'
  );

  // =========================================================
  // ELEMEN
  // =========================================================
  const el = {
    grid: document.getElementById('produk'),
    kosong: document.getElementById('kosong'),
    kosongJudul: document.getElementById('kosong-judul'),
    kosongTeks: document.getElementById('kosong-teks'),
    hasil: document.getElementById('jumlah-hasil'),
    cari: document.getElementById('cari'),
    kategori: document.getElementById('kategori'),
    min: document.getElementById('harga-min'),
    max: document.getElementById('harga-max'),
    tersedia: document.getElementById('f-tersedia'),
    favorit: document.getElementById('f-favorit'),
    jumlahFavorit: document.getElementById('jumlah-favorit'),
    urut: document.getElementById('urut'),
    items: document.getElementById('cart-items'),
    total: document.getElementById('cart-total'),
    badge: document.getElementById('cart-count'),
    checkout: document.getElementById('btn-checkout'),
    kosongkan: document.getElementById('btn-kosongkan'),
    toast: document.getElementById('toast-area')
  };

  // Kalau elemen utama tidak ada (bukan halaman toko), berhenti
  if (!el.grid) return;

  // =========================================================
  // UTILITAS
  // =========================================================
  function rupiah(angka) {
    return 'Rp' + angka.toLocaleString('id-ID');
  }

  function esc(teks) {
    return String(teks)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cariProduk(id) {
    return produk.find(function (p) { return p.id === id; });
  }

  function baca(kunci) {
    try {
      const data = JSON.parse(localStorage.getItem(kunci));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function tulis(kunci, data) {
    try { localStorage.setItem(kunci, JSON.stringify(data)); } catch (e) { /* abaikan */ }
  }

  // Notifikasi singkat di pojok kanan bawah
  function notif(pesan) {
    const toast = document.createElement('div');
    toast.className = 'toast toko-toast align-items-center border-0';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML =
      '<div class="d-flex">' +
        '<div class="toast-body"></div>' +
        '<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button>' +
      '</div>';
    toast.querySelector('.toast-body').textContent = pesan;
    el.toast.appendChild(toast);
    toast.addEventListener('hidden.bs.toast', function () { toast.remove(); });
    new bootstrap.Toast(toast, { delay: 2600 }).show();
  }

  // Kalau foto gagal dimuat, ganti dengan gambar pengganti
  function pasangFallbackFoto(wadah) {
    wadah.addEventListener('error', function (e) {
      const img = e.target;
      if (img.tagName === 'IMG' && !img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = FOTO_KOSONG;
      }
    }, true);
  }
  pasangFallbackFoto(el.grid);
  pasangFallbackFoto(el.items);

  // =========================================================
  // FAVORIT
  // =========================================================
  let favorit = baca(KUNCI_FAVORIT).filter(function (id) { return !!cariProduk(id); });

  function perbaruiJumlahFavorit() {
    el.jumlahFavorit.textContent = favorit.length;
  }

  function toggleFavorit(id, tombol) {
    const p = cariProduk(id);
    if (!p) return;
    const idx = favorit.indexOf(id);
    const jadiFavorit = idx === -1;
    if (jadiFavorit) { favorit.push(id); } else { favorit.splice(idx, 1); }
    tulis(KUNCI_FAVORIT, favorit);
    perbaruiJumlahFavorit();

    if (state.hanyaFavorit) {
      renderProduk();   // daftar berubah, gambar ulang
    } else if (tombol) {
      tombol.classList.toggle('aktif', jadiFavorit);
      tombol.setAttribute('aria-pressed', String(jadiFavorit));
      tombol.setAttribute('aria-label', (jadiFavorit ? 'Hapus dari favorit ' : 'Simpan ke favorit ') + p.nama);
      tombol.querySelector('i').className = 'bi ' + (jadiFavorit ? 'bi-heart-fill' : 'bi-heart');
    }
    notif(jadiFavorit ? p.nama + ' disimpan ke favorit.' : p.nama + ' dihapus dari favorit.');
  }

  // =========================================================
  // KERANJANG (disimpan di localStorage: hanya id dan jumlah)
  // =========================================================
  let keranjang = baca(KUNCI_KERANJANG).reduce(function (hasil, i) {
    const p = cariProduk(i.id);
    if (!p || !Number.isInteger(i.qty) || i.qty < 1 || p.stok < 1) return hasil;
    hasil.push({ id: p.id, qty: Math.min(i.qty, p.stok) });   // jangan melebihi stok
    return hasil;
  }, []);

  function simpanKeranjang() {
    tulis(KUNCI_KERANJANG, keranjang);
  }

  function jumlahDiKeranjang(id) {
    const item = keranjang.find(function (i) { return i.id === id; });
    return item ? item.qty : 0;
  }

  // Mengembalikan true kalau berhasil menambah
  function tambah(id) {
    const p = cariProduk(id);
    if (!p) return false;
    if (p.stok < 1) { notif(p.nama + ' sedang habis.'); return false; }
    const sekarang = jumlahDiKeranjang(id);
    if (sekarang >= p.stok) { notif('Stok ' + p.nama + ' hanya ' + p.stok + '.'); return false; }

    if (sekarang > 0) {
      keranjang.find(function (i) { return i.id === id; }).qty += 1;
    } else {
      keranjang.push({ id: id, qty: 1 });
    }
    simpanKeranjang();
    renderKeranjang();
    notif(p.nama + ' ditambahkan ke keranjang.');
    return true;
  }

  function ubahJumlah(id, selisih) {
    const p = cariProduk(id);
    const item = keranjang.find(function (i) { return i.id === id; });
    if (!p || !item) return;

    if (selisih > 0 && item.qty >= p.stok) {
      notif('Stok ' + p.nama + ' hanya ' + p.stok + '.');
      return;
    }
    item.qty += selisih;
    if (item.qty <= 0) keranjang = keranjang.filter(function (i) { return i.id !== id; });
    simpanKeranjang();
    renderKeranjang();
  }

  function hapus(id) {
    keranjang = keranjang.filter(function (i) { return i.id !== id; });
    simpanKeranjang();
    renderKeranjang();
  }

  function totalHarga() {
    return keranjang.reduce(function (jumlah, i) {
      return jumlah + cariProduk(i.id).harga * i.qty;
    }, 0);
  }

  function linkWhatsApp() {
    const baris = keranjang.map(function (i) {
      const p = cariProduk(i.id);
      return '- ' + p.nama + ' x' + i.qty + ' = ' + rupiah(p.harga * i.qty);
    });
    const pesan =
      'Halo, saya mau pesan dari ' + NAMA_TOKO + ':\n' +
      baris.join('\n') + '\n\n' +
      'Subtotal: ' + rupiah(totalHarga()) + '\n\n' +
      'Nama:\nAlamat pengiriman:';
    return 'https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(pesan);
  }

  function renderKeranjang() {
    const jumlahBarang = keranjang.reduce(function (n, i) { return n + i.qty; }, 0);
    el.badge.textContent = jumlahBarang;
    el.badge.hidden = jumlahBarang === 0;
    el.total.textContent = rupiah(totalHarga());

    if (keranjang.length === 0) {
      el.items.innerHTML =
        '<div class="cart-kosong">' +
          '<i class="bi bi-bag"></i>' +
          '<p>Keranjang masih kosong.</p>' +
          '<button type="button" class="btn btn-outline-info btn-sm" data-bs-dismiss="offcanvas">Lihat produk</button>' +
        '</div>';
      el.checkout.classList.add('disabled');
      el.checkout.setAttribute('aria-disabled', 'true');
      el.checkout.href = '#';
      el.kosongkan.hidden = true;
      return;
    }

    el.items.innerHTML = keranjang.map(function (i) {
      const p = cariProduk(i.id);
      const penuh = i.qty >= p.stok;
      return (
        '<div class="cart-item">' +
          '<img src="' + esc(p.gambar) + '" alt="' + esc(p.nama) + '">' +
          '<div class="cart-item-info">' +
            '<h6>' + esc(p.nama) + '</h6>' +
            '<small>' + rupiah(p.harga) + '</small>' +
            '<div class="qty">' +
              '<button type="button" data-aksi="kurang" data-id="' + p.id + '" aria-label="Kurangi ' + esc(p.nama) + '">&minus;</button>' +
              '<span>' + i.qty + '</span>' +
              '<button type="button" data-aksi="tambah" data-id="' + p.id + '" aria-label="Tambah ' + esc(p.nama) + '"' + (penuh ? ' disabled' : '') + '>+</button>' +
            '</div>' +
            (penuh ? '<small class="cart-maks">Stok maksimal tercapai</small>' : '') +
          '</div>' +
          '<div class="cart-item-kanan">' +
            '<strong>' + rupiah(p.harga * i.qty) + '</strong>' +
            '<button type="button" class="btn-hapus" data-aksi="hapus" data-id="' + p.id + '" aria-label="Hapus ' + esc(p.nama) + '">' +
              '<i class="bi bi-trash3"></i>' +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    el.checkout.classList.remove('disabled');
    el.checkout.removeAttribute('aria-disabled');
    el.checkout.href = linkWhatsApp();
    el.kosongkan.hidden = false;
  }

  el.items.addEventListener('click', function (e) {
    const tombol = e.target.closest('button[data-aksi]');
    if (!tombol) return;
    const id = Number(tombol.dataset.id);
    if (tombol.dataset.aksi === 'tambah') ubahJumlah(id, 1);
    if (tombol.dataset.aksi === 'kurang') ubahJumlah(id, -1);
    if (tombol.dataset.aksi === 'hapus') hapus(id);
  });

  el.kosongkan.addEventListener('click', function () {
    keranjang = [];
    simpanKeranjang();
    renderKeranjang();
  });

  // =========================================================
  // KATALOG: FILTER, SORTING, TAMPILAN
  // =========================================================
  const state = {
    cari: '',
    kategori: 'Semua',
    min: null,
    max: null,
    hanyaTersedia: false,
    hanyaFavorit: false,
    urut: 'terbaru'
  };

  function filterProduk() {
    return produk.filter(function (p) {
      if (state.kategori !== 'Semua' && p.kategori !== state.kategori) return false;
      if (state.min !== null && p.harga < state.min) return false;
      if (state.max !== null && p.harga > state.max) return false;
      if (state.hanyaTersedia && p.stok < 1) return false;
      if (state.hanyaFavorit && favorit.indexOf(p.id) === -1) return false;
      if (state.cari) {
        const teks = (p.nama + ' ' + p.kategori + ' ' + p.deskripsi + ' ' + (p.kompatibel || []).join(' ')).toLowerCase();
        if (teks.indexOf(state.cari) === -1) return false;
      }
      return true;
    });
  }

  function urutkan(daftar) {
    const salinan = daftar.slice();
    if (state.urut === 'termurah') salinan.sort(function (a, b) { return a.harga - b.harga; });
    if (state.urut === 'termahal') salinan.sort(function (a, b) { return b.harga - a.harga; });
    if (state.urut === 'terlaris') salinan.sort(function (a, b) { return b.terjual - a.terjual; });
    if (state.urut === 'terbaru') salinan.sort(function (a, b) { return b.tanggal.localeCompare(a.tanggal); });
    return salinan;
  }

  function labelHtml(p) {
    const label = p.label || [];
    const hasil = [];
    if (label.indexOf('best-seller') !== -1) hasil.push('<span class="produk-label label-best">Best Seller</span>');
    if (label.indexOf('new') !== -1) hasil.push('<span class="produk-label label-new">New Arrival</span>');
    if (p.hargaAsli && p.hargaAsli > p.harga) {
      const persen = Math.round((1 - p.harga / p.hargaAsli) * 100);
      hasil.push('<span class="produk-label label-sale">Sale -' + persen + '%</span>');
    }
    return hasil.join('');
  }

  function hargaHtml(p) {
    let html = '<span class="produk-harga">' + rupiah(p.harga) + '</span>';
    if (p.hargaAsli && p.hargaAsli > p.harga) {
      html += '<s class="harga-coret">' + rupiah(p.hargaAsli) + '</s>';
    }
    return html;
  }

  function stokHtml(p) {
    if (p.stok < 1) return '<p class="produk-stok stok-habis">Stok habis</p>';
    if (p.stok <= STOK_MENIPIS) return '<p class="produk-stok stok-tipis">Stok tinggal ' + p.stok + '</p>';
    return '<p class="produk-stok stok-ok">Stok tersedia (' + p.stok + ')</p>';
  }

  function kartuHtml(p) {
    const habis = p.stok < 1;
    const fav = favorit.indexOf(p.id) !== -1;
    return (
      '<div class="col-6 col-md-4">' +
        '<article class="produk-card' + (habis ? ' is-habis' : '') + '">' +
          '<div class="produk-foto">' +
            '<div class="produk-label-wrap">' + labelHtml(p) + '</div>' +
            '<button type="button" class="btn-fav' + (fav ? ' aktif' : '') + '" data-fav="' + p.id + '" aria-pressed="' + fav + '" ' +
              'aria-label="' + (fav ? 'Hapus dari favorit ' : 'Simpan ke favorit ') + esc(p.nama) + '">' +
              '<i class="bi ' + (fav ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
            '</button>' +
            '<img src="' + esc(p.gambar) + '" alt="' + esc(p.nama) + '" loading="lazy">' +
          '</div>' +
          '<div class="produk-body">' +
            '<span class="skill-badge produk-kategori">' + esc(p.kategori) + '</span>' +
            '<h5>' + esc(p.nama) + '</h5>' +
            '<div class="produk-harga-wrap">' + hargaHtml(p) + '</div>' +
            stokHtml(p) +
            '<button type="button" class="btn btn-info btn-sm produk-tambah" data-tambah="' + p.id + '"' + (habis ? ' disabled' : '') + '>' +
              '<i class="bi bi-cart-plus"></i> ' + (habis ? 'Stok habis' : 'Tambah ke keranjang') +
            '</button>' +
          '</div>' +
        '</article>' +
      '</div>'
    );
  }

  function renderKategori() {
    const daftar = ['Semua'].concat(KATEGORI);
    el.kategori.innerHTML = daftar.map(function (k) {
      const jumlah = k === 'Semua'
        ? produk.length
        : produk.filter(function (p) { return p.kategori === k; }).length;
      const aktif = k === state.kategori;
      return (
        '<button type="button" class="kat-btn' + (aktif ? ' aktif' : '') + '" data-kategori="' + esc(k) + '" aria-pressed="' + aktif + '">' +
          '<span>' + esc(k) + '</span><span class="kat-jumlah">' + jumlah + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function renderProduk() {
    const hasil = urutkan(filterProduk());
    el.hasil.textContent = 'Menampilkan ' + hasil.length + ' dari ' + produk.length + ' produk';

    if (hasil.length === 0) {
      const belumAdaFavorit = state.hanyaFavorit && favorit.length === 0;
      el.grid.innerHTML = '';
      el.kosongJudul.textContent = belumAdaFavorit ? 'Belum ada favorit' : 'Produk tidak ditemukan';
      el.kosongTeks.textContent = belumAdaFavorit
        ? 'Tekan ikon hati pada produk untuk menyimpannya di sini.'
        : 'Coba ubah kata kunci atau longgarkan filter yang aktif.';
      el.kosong.classList.remove('d-none');
      return;
    }

    el.kosong.classList.add('d-none');
    el.grid.innerHTML = hasil.map(kartuHtml).join('');
  }

  function resetFilter() {
    state.cari = '';
    state.kategori = 'Semua';
    state.min = null;
    state.max = null;
    state.hanyaTersedia = false;
    state.hanyaFavorit = false;
    state.urut = 'terbaru';

    el.cari.value = '';
    el.min.value = '';
    el.max.value = '';
    el.tersedia.checked = false;
    el.favorit.checked = false;
    el.urut.value = 'terbaru';

    renderKategori();
    renderProduk();
  }

  function angkaAtauNull(nilai) {
    if (nilai === '') return null;
    const n = Number(nilai);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  // ----- Pasang event -----
  el.cari.addEventListener('input', function () {
    state.cari = el.cari.value.trim().toLowerCase();
    renderProduk();
  });

  el.kategori.addEventListener('click', function (e) {
    const tombol = e.target.closest('button[data-kategori]');
    if (!tombol) return;
    state.kategori = tombol.dataset.kategori;
    renderKategori();
    renderProduk();
  });

  el.min.addEventListener('input', function () {
    state.min = angkaAtauNull(el.min.value);
    renderProduk();
  });

  el.max.addEventListener('input', function () {
    state.max = angkaAtauNull(el.max.value);
    renderProduk();
  });

  el.tersedia.addEventListener('change', function () {
    state.hanyaTersedia = el.tersedia.checked;
    renderProduk();
  });

  el.favorit.addEventListener('change', function () {
    state.hanyaFavorit = el.favorit.checked;
    renderProduk();
  });

  el.urut.addEventListener('change', function () {
    state.urut = el.urut.value;
    renderProduk();
  });

  document.querySelectorAll('[data-reset]').forEach(function (tombol) {
    tombol.addEventListener('click', resetFilter);
  });

  el.grid.addEventListener('click', function (e) {
    const tambahBtn = e.target.closest('button[data-tambah]');
    if (tambahBtn) {
      if (tambah(Number(tambahBtn.dataset.tambah))) {
        const asli = tambahBtn.innerHTML;
        tambahBtn.innerHTML = '<i class="bi bi-check2"></i> Masuk keranjang';
        setTimeout(function () { tambahBtn.innerHTML = asli; }, 900);
      }
      return;
    }
    const favBtn = e.target.closest('button[data-fav]');
    if (favBtn) toggleFavorit(Number(favBtn.dataset.fav), favBtn);
  });

  // =========================================================
  // MULAI
  // =========================================================
  perbaruiJumlahFavorit();
  renderKategori();
  renderProduk();
  renderKeranjang();
})();
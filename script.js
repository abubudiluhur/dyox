// ===== DATA PROJECT =====
const projects = [
  {
    title: "Aplikasi Manajemen Sanggar",
    description: "Aplikasi Android untuk mengelola data sanggar seni tradisional.",
    tech: ["PHP", "Android Studio", "SQLite"],
    link: "#"
  },
  {
    title: "Website Portofolio",
    description: "Website portofolio pribadi dengan beberapa halaman.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "#"
  }
];

// ===== MENAMPILKAN PROJECT =====
function renderProjects() {
  const container = document.getElementById("project-list");

  // Kalau elemen ini tidak ada (bukan halaman project), berhenti
  if (!container) return;

  projects.forEach(function (item) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const techTags = item.tech
      .map(function (t) {
        return `<span class="badge rounded-pill text-bg-info me-1">${t}</span>`;
      })
      .join("");

    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${item.description}</p>
          <div class="mb-3">${techTags}</div>
          <a href="${item.link}" class="btn btn-info btn-sm">Lihat Detail</a>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

// ===== DATA LEARNING =====
const learnings = [
  { topic: "HTML & CSS", progress: 80, status: "Hampir selesai" },
  { topic: "JavaScript", progress: 50, status: "Sedang dipelajari" },
  { topic: "Kotlin (Android)", progress: 65, status: "Sedang dipelajari" },
  { topic: "Basis Data", progress: 40, status: "Sedang dipelajari" }
];

// ===== MENAMPILKAN LEARNING =====
function renderLearning() {
  const container = document.getElementById("learning-list");
  if (!container) return;

  learnings.forEach(function (item) {
    const box = document.createElement("div");
    box.className = "learning-item";

    box.innerHTML = `
      <div class="learning-head">
        <h3>${item.topic}</h3>
        <span>${item.progress}%</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: ${item.progress}%"></div>
      </div>
      <small>${item.status}</small>
    `;

    container.appendChild(box);
  });
}

// ===== MENU AKTIF OTOMATIS =====
function setActiveMenu() {
  // Ambil nama halaman dari URL, misalnya "learning"
  let page = window.location.pathname.split("/").pop() || "index";
  page = page.replace(".html", "");

  document.querySelectorAll(".navbar .nav-link").forEach(function (link) {
    const target = link.getAttribute("href").split("/").pop().replace(".html", "");
    link.classList.toggle("active", target === page);
  });
}

// ===== EFEK MENGETIK DI HERO (hanya halaman Home) =====
function initTyping() {
  const typingEl = document.getElementById("typing");
  if (!typingEl) return;

  const words = ["Web Developer", "Android Developer", "Wakil Ketua BEM FTI"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    typingEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 50 : 100;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1400; // jeda setelah kata selesai diketik
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400; // jeda sebelum kata berikutnya
    }

    setTimeout(tick, delay);
  }

  typingEl.textContent = "";
  tick();
}

// ===== ANIMASI MUNCUL SAAT SCROLL =====
function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("show"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target); // cukup sekali
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });
}

renderProjects();
renderLearning();
setActiveMenu();
initTyping();
initReveal();
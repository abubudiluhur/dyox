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
renderProjects();
renderLearning();
setActiveMenu();

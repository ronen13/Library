// ===== CONFIG =====
const PAGE_SIZE = 12;

// ===== PAYWALL CONFIG =====
const FREE_COUNT  = 4;
const PAYMENT_URL = "https://meshulam.co.il/quick_payment?b=cda745194cf906235974d5e3cb35e9c7";
const RETURN_URL  = "https://library.inno-tech.io/?paid=true";
const STORAGE_KEY = "innotech_paid";

// אם הלקוח חוזר אחרי תשלום — שמור גישה ונקה URL
(function () {
  const p = new URLSearchParams(window.location.search);
  if (p.get("paid") === "true") {
    localStorage.setItem(STORAGE_KEY, "1");
    window.history.replaceState({}, "", window.location.pathname);
  }
})();

const isPaid = () => localStorage.getItem(STORAGE_KEY) === "1";

// סגנונות פייוול
const pwStyle = document.createElement("style");
pwStyle.textContent = `
  .pw-banner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15); border-radius: 14px;
    padding: 18px 24px; margin: 0 16px 28px; direction: rtl; flex-wrap: wrap;
  }
  .pw-banner h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #fff; }
  .pw-banner p  { margin: 0; font-size: 13px; color: rgba(255,255,255,0.55); }
  .pw-banner a  {
    background: #e63946; color: #fff; text-decoration: none;
    padding: 10px 22px; border-radius: 8px; font-size: 13px;
    font-weight: 700; white-space: nowrap; flex-shrink: 0;
  }
  .pw-banner a:hover { background: #c1121f; }

  .pw-free-badge {
    position: absolute; top: 8px; right: 8px;
    background: #1D9E75; color: #fff;
    font-size: 10px; font-weight: 700;
    padding: 2px 8px; border-radius: 20px; z-index: 5;
    pointer-events: none;
  }

  .pw-lock-overlay {
    position: absolute; inset: 0; z-index: 10;
    background: rgba(0,0,0,0.72);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px;
    border-radius: 10px; cursor: pointer;
  }
  .pw-lock-overlay svg { width: 34px; height: 34px; color: #fff; opacity: 0.9; }
  .pw-lock-overlay span { color: #fff; font-size: 12px; opacity: 0.75; }
  .pw-lock-overlay a {
    margin-top: 4px; background: #e63946; color: #fff;
    text-decoration: none; font-size: 12px; font-weight: 700;
    padding: 7px 16px; border-radius: 6px;
  }
  .pw-lock-overlay a:hover { background: #c1121f; }

  .pw-locked .card-thumb img { filter: blur(5px); }
  .pw-locked { cursor: default; }
`;
document.head.appendChild(pwStyle);

function buildLockOverlay() {
  const d = document.createElement("div");
  d.className = "pw-lock-overlay";
  d.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <span>תוכן פרימיום</span>
    <a href="${PAYMENT_URL}&return_url=${encodeURIComponent(RETURN_URL)}" target="_blank" rel="noopener">לרכישת גישה מלאה ▶</a>
  `;
  return d;
}

function insertPaywallBanner() {
  if (isPaid() || document.getElementById("pw-main-banner")) return;
  const grid = document.getElementById("videosGrid");
  if (!grid) return;
  const banner = document.createElement("div");
  banner.id = "pw-main-banner";
  banner.className = "pw-banner";
  banner.innerHTML = `
    <div>
      <h3>ספריית הסרטונים המלאה</h3>
      <p>4 הסרטונים האחרונים זמינים בחינם · שאר הספרייה נפתחת לאחר רכישת גישה</p>
    </div>
    <a href="${PAYMENT_URL}&return_url=${encodeURIComponent(RETURN_URL)}" target="_blank" rel="noopener">לרכישת גישה מלאה ▶</a>
  `;
  grid.parentNode.insertBefore(banner, grid);
}

function applyPaywall() {
  if (isPaid()) return;
  insertPaywallBanner();
  const cards = Array.from(document.querySelectorAll("#videosGrid .video-card"));
  cards.forEach((card, i) => {
    if (i < FREE_COUNT) {
      // תג חינם
      const thumb = card.querySelector(".card-thumb");
      if (thumb && !thumb.querySelector(".pw-free-badge")) {
        const badge = document.createElement("div");
        badge.className = "pw-free-badge";
        badge.textContent = "חינם";
        thumb.appendChild(badge);
      }
    } else {
      // נעל את הכרטיסייה
      if (!card.classList.contains("pw-locked")) {
        card.classList.add("pw-locked");
        card.onclick = null; // בטל פתיחת מודאל
        const thumb = card.querySelector(".card-thumb");
        if (thumb && !thumb.querySelector(".pw-lock-overlay")) {
          thumb.appendChild(buildLockOverlay());
        }
      }
    }
  });
}
// ===== END PAYWALL =====


// ===== STATE =====
let allVideos = [];
let filtered  = [];
let displayed = 0;

// ===== LOAD FROM JSON =====
async function loadVideos() {
  showLoading(true);
  showError(false);
  allVideos = [];

  try {
    const res = await fetch('/videos.json');
    if (!res.ok) throw new Error(`שגיאה בטעינת הקובץ: ${res.status}`);
    const data = await res.json();

    allVideos = data.videos || [];

    // Channel stats
    const ch = data.channelStats;
    if (ch) {
      document.getElementById('statVideos').textContent = formatNum(allVideos.length);
      document.getElementById('statViews').textContent  = formatNum(ch.viewCount       || 0);
      document.getElementById('statSubs').textContent   = formatNum(ch.subscriberCount || 0);
      document.getElementById('statsBar').style.display = 'block';
    }

    showLoading(false);
    applyFilters();
  } catch (err) {
    console.error(err);
    showLoading(false);
    showError(true, err.message);
  }
}

// ===== FILTERS & SORT =====
function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const sort  = document.getElementById('sortSelect').value;

  filtered = allVideos.filter(v =>
    !query || v.title.toLowerCase().includes(query) || v.desc.toLowerCase().includes(query)
  );

  if (sort === 'date')     filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'date-asc') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sort === 'views')    filtered.sort((a, b) => b.views - a.views);
  if (sort === 'title')    filtered.sort((a, b) => a.title.localeCompare(b.title, 'he'));

  displayed = 0;
  document.getElementById('videosGrid').innerHTML = '';
  document.getElementById('noResults').style.display   = 'none';
  document.getElementById('loadMoreWrap').style.display = 'none';

  const count = document.getElementById('resultsCount');
  count.textContent = filtered.length ? `${filtered.length} סרטונים` : '';

  if (filtered.length === 0) {
    document.getElementById('noResults').style.display = 'block';
    return;
  }

  renderMore();
}

function renderMore() {
  const grid  = document.getElementById('videosGrid');
  const batch = filtered.slice(displayed, displayed + PAGE_SIZE);

  batch.forEach((v, i) => {
    const card = buildCard(v, displayed + i);
    grid.appendChild(card);
  });

  displayed += batch.length;

  const wrap = document.getElementById('loadMoreWrap');
  wrap.style.display = displayed < filtered.length ? 'block' : 'none';

  // הפעל פייוול אחרי כל רינדור
  applyPaywall();
}

function loadMore() { renderMore(); }

// ===== CARD =====
function buildCard(v, index) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.style.animationDelay = `${Math.min(index % PAGE_SIZE * 40, 400)}ms`;
  card.onclick = () => openModal(v);

  card.innerHTML = `
    <div class="card-thumb">
      <img src="${v.thumb}" alt="${escHtml(v.title)}" loading="lazy" />
      ${v.duration ? `<span class="card-duration">${v.duration}</span>` : ''}
      <div class="card-play">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="22" fill="rgba(0,0,0,0.6)"/>
          <polygon points="17,14 34,22 17,30" fill="white"/>
        </svg>
      </div>
    </div>
    <div class="card-body">
      <p class="card-title">${escHtml(v.title)}</p>
      <div class="card-meta">
        ${v.views ? `<span class="card-views">${formatNum(v.views)} צפיות</span><span class="card-dot">·</span>` : ''}
        <span class="card-date">${formatDate(v.date)}</span>
      </div>
    </div>
  `;
  return card;
}

// ===== MODAL =====
function openModal(v) {
  document.getElementById('modalIframe').src        = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
  document.getElementById('modalTitle').textContent = v.title;
  document.getElementById('modalDate').textContent  = formatDate(v.date);
  document.getElementById('modalViews').textContent = v.views ? `${formatNum(v.views)} צפיות` : '';
  document.getElementById('modalDesc').textContent  = v.desc || '';
  document.getElementById('modalYtLink').href       = `https://www.youtube.com/watch?v=${v.id}`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('modalIframe').src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== SEARCH =====
document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.trim();
  document.getElementById('clearBtn').style.display = q ? 'block' : 'none';
  applyFilters();
});

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  applyFilters();
}
window.clearSearch = clearSearch;

// ===== HELPERS =====
function showLoading(on) {
  document.getElementById('loadingWrap').style.display = on ? 'flex'  : 'none';
  document.getElementById('videosGrid').style.display  = on ? 'none'  : 'grid';
}

function showError(on, msg = '') {
  document.getElementById('errorWrap').style.display = on ? 'flex' : 'none';
  if (msg) document.getElementById('errorMsg').textContent = `שגיאה: ${msg}`;
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1)     + 'K';
  return n.toLocaleString('he-IL');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== INIT =====
loadVideos();

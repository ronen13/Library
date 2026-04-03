// ===== CONFIG =====
const API_KEY    = 'AIzaSyBA55iJqRZW-BKe0oewbHhNq16gj68Jp0Y';
const CHANNEL_ID = 'UC1O24WAzLuYg6yNrlPqLABw';
const PAGE_SIZE  = 12;

// ===== STATE =====
let allVideos    = [];
let filtered     = [];
let displayed    = 0;
let nextPageToken = null;
let isFetching   = false;

// ===== YOUTUBE API =====
async function fetchPage(pageToken = '') {
  const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video${tokenParam}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return res.json();
}

async function fetchVideoStats(ids) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids.join(',')}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return {};
  const data = await res.json();
  const map = {};
  for (const item of data.items) {
    map[item.id] = {
      views:    parseInt(item.statistics?.viewCount || 0),
      duration: parseDuration(item.contentDetails?.duration || ''),
    };
  }
  return map;
}

async function fetchChannelStats() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.statistics || null;
}

async function loadVideos() {
  showLoading(true);
  showError(false);
  allVideos = [];

  try {
    // Fetch all pages
    let token = '';
    do {
      const data = await fetchPage(token);
      const ids = data.items.map(i => i.id.videoId).filter(Boolean);

      if (ids.length) {
        const stats = await fetchVideoStats(ids);
        for (const item of data.items) {
          const vid = item.id.videoId;
          if (!vid) continue;
          allVideos.push({
            id:        vid,
            title:     item.snippet.title,
            desc:      item.snippet.description,
            thumb:     item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
            date:      item.snippet.publishedAt,
            views:     stats[vid]?.views || 0,
            duration:  stats[vid]?.duration || '',
          });
        }
      }
      token = data.nextPageToken || '';
    } while (token);

    // Channel stats
    const chStats = await fetchChannelStats();
    if (chStats) {
      document.getElementById('statVideos').textContent = formatNum(allVideos.length);
      document.getElementById('statViews').textContent  = formatNum(parseInt(chStats.viewCount || 0));
      document.getElementById('statSubs').textContent   = formatNum(parseInt(chStats.subscriberCount || 0));
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
  document.getElementById('noResults').style.display  = 'none';
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
  document.getElementById('modalIframe').src  = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
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
  document.getElementById('loadingWrap').style.display = on ? 'flex' : 'none';
  document.getElementById('videosGrid').style.display  = on ? 'none' : 'grid';
}

function showError(on, msg = '') {
  document.getElementById('errorWrap').style.display = on ? 'flex' : 'none';
  if (msg) document.getElementById('errorMsg').textContent = `שגיאה: ${msg}`;
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString('he-IL');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' });
}

function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  if (h) return `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${min}:${String(s).padStart(2,'0')}`;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== INIT =====
loadVideos();

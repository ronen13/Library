// ===== SITES DATA =====
const SITES = [
  // AI
  { name: "ChatGPT", desc: "צ'אט AI של OpenAI — שאל, כתוב, צור", emoji: "🤖", cat: "ai", url: "https://chat.openai.com", tag: "בינה מלאכותית", tagClass: "tag-ai" },
  { name: "Claude", desc: "AI של Anthropic — חשיבה עמוקה ואמינה", emoji: "🧠", cat: "ai", url: "https://claude.ai", tag: "בינה מלאכותית", tagClass: "tag-ai" },
  { name: "Gemini", desc: "AI של גוגל — משולב עם כל כלי גוגל", emoji: "✨", cat: "ai", url: "https://gemini.google.com", tag: "בינה מלאכותית", tagClass: "tag-ai" },
  { name: "Perplexity", desc: "מנוע חיפוש AI עם מקורות מהרשת בזמן אמת", emoji: "🔎", cat: "ai", url: "https://www.perplexity.ai", tag: "חיפוש AI", tagClass: "tag-ai" },
  { name: "Midjourney", desc: "יצירת תמונות AI מהשורה הראשונה", emoji: "🖼️", cat: "ai", url: "https://www.midjourney.com", tag: "יצירה", tagClass: "tag-ai" },
  { name: "Hugging Face", desc: "מאגר מודלי AI בקוד פתוח ורכזת הקהילה", emoji: "🤗", cat: "ai", url: "https://huggingface.co", tag: "מודלים", tagClass: "tag-ai" },
  { name: "Runway ML", desc: "עריכת וידאו ויצירת תוכן עם AI", emoji: "🎬", cat: "ai", url: "https://runwayml.com", tag: "וידאו AI", tagClass: "tag-ai" },
  { name: "ElevenLabs", desc: "יצירת קול וסינתזת דיבור ב-AI", emoji: "🔊", cat: "ai", url: "https://elevenlabs.io", tag: "קול AI", tagClass: "tag-ai" },

  // DEV
  { name: "GitHub", desc: "פלטפורמת קוד פתוח, גרסאות ושיתוף פעולה", emoji: "🐙", cat: "dev", url: "https://github.com", tag: "פיתוח", tagClass: "tag-dev" },
  { name: "Stack Overflow", desc: "שאלות ותשובות למפתחים מכל העולם", emoji: "💬", cat: "dev", url: "https://stackoverflow.com", tag: "קהילה", tagClass: "tag-dev" },
  { name: "MDN Web Docs", desc: "תיעוד מלא ואמין לפיתוח ווב", emoji: "📖", cat: "dev", url: "https://developer.mozilla.org", tag: "תיעוד", tagClass: "tag-dev" },
  { name: "CodePen", desc: "כתוב ושתף קוד HTML/CSS/JS בדפדפן", emoji: "✏️", cat: "dev", url: "https://codepen.io", tag: "פיתוח", tagClass: "tag-dev" },
  { name: "Replit", desc: "כתוב והרץ קוד ישירות בדפדפן עם AI", emoji: "🔧", cat: "dev", url: "https://replit.com", tag: "IDE", tagClass: "tag-dev" },
  { name: "Vercel", desc: "פריסת אפליקציות ווב מהירה בלחיצה", emoji: "▲", cat: "dev", url: "https://vercel.com", tag: "פריסה", tagClass: "tag-dev" },
  { name: "npm", desc: "מאגר הפקגאות הגדול בעולם לג'אוואסקריפט", emoji: "📦", cat: "dev", url: "https://www.npmjs.com", tag: "פקגאות", tagClass: "tag-dev" },

  // NEWS
  { name: "Geektime", desc: "חדשות הייטק וטכנולוגיה בישראל", emoji: "📰", cat: "news", url: "https://www.geektime.co.il", tag: "חדשות", tagClass: "tag-news" },
  { name: "TechCrunch", desc: "חדשות סטארטאפ וטכנולוגיה בינלאומי", emoji: "🌐", cat: "news", url: "https://techcrunch.com", tag: "חדשות", tagClass: "tag-news" },
  { name: "The Verge", desc: "טכנולוגיה, מדע ותרבות דיגיטלית", emoji: "📡", cat: "news", url: "https://www.theverge.com", tag: "חדשות", tagClass: "tag-news" },
  { name: "Ars Technica", desc: "ניתוח טכנולוגי עמוק ומפורט", emoji: "🔬", cat: "news", url: "https://arstechnica.com", tag: "ניתוח", tagClass: "tag-news" },
  { name: "Product Hunt", desc: "גלה כלים ומוצרים טכנולוגיים חדשים כל יום", emoji: "🚀", cat: "news", url: "https://www.producthunt.com", tag: "מוצרים", tagClass: "tag-news" },

  // TOOLS
  { name: "Notion", desc: "סדר מידע, הערות ומשימות — הכל במקום אחד", emoji: "📋", cat: "tools", url: "https://www.notion.so", tag: "פרודוקטיביות", tagClass: "tag-tools" },
  { name: "Zapier", desc: "אוטומציה בין אלפי אפליקציות ללא קוד", emoji: "⚡", cat: "tools", url: "https://zapier.com", tag: "אוטומציה", tagClass: "tag-tools" },
  { name: "Airtable", desc: "מסד נתונים גמיש ומעוצב לכל צוות", emoji: "🗃️", cat: "tools", url: "https://airtable.com", tag: "מסד נתונים", tagClass: "tag-tools" },
  { name: "Linear", desc: "ניהול פרויקטים מהיר לצוותי פיתוח", emoji: "🎯", cat: "tools", url: "https://linear.app", tag: "ניהול", tagClass: "tag-tools" },

  // LEARN
  { name: "Coursera", desc: "קורסים אקדמיים מהאוניברסיטאות הטובות בעולם", emoji: "🎓", cat: "learn", url: "https://www.coursera.org", tag: "למידה", tagClass: "tag-learn" },
  { name: "freeCodeCamp", desc: "לימוד פיתוח ווב בחינם — מהתחלה ועד עבודה", emoji: "🆓", cat: "learn", url: "https://www.freecodecamp.org", tag: "חינמי", tagClass: "tag-learn" },
  { name: "YouTube", desc: "אלפי קורסי טכנולוגיה וסרטוני הסבר", emoji: "▶️", cat: "learn", url: "https://www.youtube.com", tag: "וידאו", tagClass: "tag-learn" },
  { name: "roadmap.sh", desc: "מפות דרך מפורטות לכל תחום בפיתוח", emoji: "🗺️", cat: "learn", url: "https://roadmap.sh", tag: "מפת דרך", tagClass: "tag-learn" },

  // DESIGN
  { name: "Figma", desc: "עיצוב ממשקים שיתופי ישירות בדפדפן", emoji: "🎨", cat: "design", url: "https://www.figma.com", tag: "עיצוב", tagClass: "tag-design" },
  { name: "Canva", desc: "יצירת גרפיקה מקצועית בקלות לכולם", emoji: "🖌️", cat: "design", url: "https://www.canva.com", tag: "גרפיקה", tagClass: "tag-design" },
  { name: "Tailwind CSS", desc: "ספריית CSS מהירה ומודרנית עם כלי AI", emoji: "💨", cat: "design", url: "https://tailwindcss.com", tag: "CSS", tagClass: "tag-design" },
  { name: "Coolors", desc: "מחולל פלטות צבע יפות בשניות", emoji: "🎭", cat: "design", url: "https://coolors.co", tag: "צבעים", tagClass: "tag-design" },

  // CLOUD
  { name: "AWS", desc: "שירותי ענן של אמזון — התשתית של האינטרנט", emoji: "☁️", cat: "cloud", url: "https://aws.amazon.com", tag: "ענן", tagClass: "tag-cloud" },
  { name: "Render", desc: "פריסה פשוטה וזולה לאפליקציות ווב", emoji: "🖥️", cat: "cloud", url: "https://render.com", tag: "פריסה", tagClass: "tag-cloud" },
  { name: "Cloudflare", desc: "CDN, אבטחה ו-edge computing לכולם", emoji: "🛡️", cat: "cloud", url: "https://cloudflare.com", tag: "CDN", tagClass: "tag-cloud" },
  { name: "Docker", desc: "קונטיינרים — הרץ כל אפליקציה בכל מקום", emoji: "🐳", cat: "cloud", url: "https://www.docker.com", tag: "DevOps", tagClass: "tag-cloud" },
];

// ===== STATE =====
let currentCat = "all";
let currentQuery = "";

// ===== RENDER =====
function renderCards(list) {
  const grid = document.getElementById("cardsGrid");
  const noRes = document.getElementById("noResults");
  const count = document.getElementById("resultsCount");

  if (list.length === 0) {
    grid.innerHTML = "";
    noRes.style.display = "block";
    count.textContent = "לא נמצאו תוצאות";
    return;
  }

  noRes.style.display = "none";
  count.textContent = `מציג ${list.length} אתרים`;

  grid.innerHTML = list.map((s, i) => `
    <a
      class="site-card"
      href="${s.url}"
      target="_blank"
      rel="noopener noreferrer"
      style="animation-delay:${Math.min(i * 30, 400)}ms"
      aria-label="${s.name} — ${s.desc}"
    >
      <div class="card-favicon">${s.emoji}</div>
      <div class="card-body">
        <div class="card-name">
          ${s.name}
          <svg class="card-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
        <p class="card-desc">${s.desc}</p>
      </div>
      <span class="card-tag ${s.tagClass}">${s.tag}</span>
    </a>
  `).join("");
}

function applyFilters() {
  let filtered = SITES;

  if (currentCat !== "all") {
    filtered = filtered.filter(s => s.cat === currentCat);
  }

  if (currentQuery) {
    const q = currentQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.tag.toLowerCase().includes(q)
    );
  }

  renderCards(filtered);
}

// ===== CATEGORY BUTTONS =====
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCat = btn.dataset.cat;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();

    // scroll cats into view on mobile
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
});

// ===== SEARCH =====
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");

searchInput.addEventListener("input", () => {
  currentQuery = searchInput.value.trim();
  clearBtn.style.display = currentQuery ? "block" : "none";
  applyFilters();
});

function clearSearch() {
  searchInput.value = "";
  currentQuery = "";
  clearBtn.style.display = "none";
  applyFilters();
  searchInput.focus();
}

// expose for inline onclick
window.clearSearch = clearSearch;

// ===== INIT =====
renderCards(SITES);

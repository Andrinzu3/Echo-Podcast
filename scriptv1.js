document.addEventListener("DOMContentLoaded", function () {

  
    // 🌄 Slideshow-Logik
    const hero = document.querySelector('.hero');
    const images = [
      'Assets/Bild_hero/Echo_Hindergrundbilder-1.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-2.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-3.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-4.jpg',
      'Assets/Bild_hero/Echo_Hindergrundbilder-5.jpg',
    ];
  
    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    bg1.className = 'hero-bg bg1';
    bg2.className = 'hero-bg bg2';
    hero.appendChild(bg1);
    hero.appendChild(bg2);
  
    let current = 0;
    let next = 1;
  
    bg1.style.backgroundImage = `url(${images[current]})`;
    bg2.style.opacity = 0;
  
    setInterval(() => {
      bg2.style.backgroundImage = `url(${images[next]})`;
      bg2.style.opacity = 1;
  
      setTimeout(() => {
        bg1.style.backgroundImage = `url(${images[next]})`;
        bg2.style.opacity = 0;
  
        current = next;
        next = (next + 1) % images.length;
      }, 2000);
    }, 8000);
  
    // 🧭 Navigation sanft scrollen
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Standardverhalten verhindern
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const burger = document.getElementById("burger");
    const mobileNav = document.getElementById("mobileNav");

    burger.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
  // === Konfiguration ===
  const CHANNEL_ID = "UCMvOsNaPaGkskrzEzlMc7bg"; // z.B. "UCxxxxxxxxxxxx"
  const API_KEY    = "AIzaSyBGaBG4xnSM2TA2watOgU_OcaH4hb5fPhA";    // Domain-restriktiert!
  const IFRAME_ID  = "featured-video";
  const CACHE_TTL_MINUTES = 60;          // 1h cachen, um Quoten zu sparen

  // === Hilfsfunktionen ===
  const cacheKey = `yt_latest_${CHANNEL_ID}`;
  function setIframe(videoId) {
    const iframe = document.getElementById(IFRAME_ID);
    if (!iframe) return;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      color: "white",
      iv_load_policy: "3"
    }).toString();
    iframe.src = `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      const { videoId, ts } = JSON.parse(raw);
      if (!videoId || !ts) return null;
      const ageMin = (Date.now() - ts) / 60000;
      return ageMin < CACHE_TTL_MINUTES ? videoId : null;
    } catch { return null; }
  }

  function writeCache(videoId) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ videoId, ts: Date.now() }));
    } catch {}
  }

  // RSS-Fallback (optional, falls API fehlschlägt). Achtung: CORS!
  // Hier nutzen wir einen CORS-kompatiblen Reader (r.jina.ai). Wenn ihr das nicht wollt,
  // macht das über eine kleine Serverless-Funktion.
  async function fetchLatestViaRSS(channelId) {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxy  = `https://r.jina.ai/http://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    try {
      const res = await fetch(proxy);
      if (!res.ok) throw new Error("RSS fetch failed");
      const text = await res.text();
      // yt:videoId aus dem XML-Text herausziehen
      const match = text.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  async function fetchLatestViaAPI(channelId, apiKey) {
    // Schnellster Weg: search.list nach Date sortiert
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.search = new URLSearchParams({
      key: apiKey,
      channelId: channelId,
      part: "id",
      order: "date",
      maxResults: "1",
      type: "video"
    }).toString();

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("YouTube API request failed");
    const data = await res.json();
    const item = data.items && data.items[0];
    return item?.id?.videoId || null;
  }

  (async () => {
    // 1) Cache versuchen
    const cached = readCache();
    if (cached) {
      setIframe(cached);
      return;
    }

    // 2) YouTube API
    try {
      const latestId = await fetchLatestViaAPI(CHANNEL_ID, API_KEY);
      if (latestId) {
        setIframe(latestId);
        writeCache(latestId);
        return;
      }
      throw new Error("No latest via API");
    } catch {
      // 3) RSS-Fallback
      const rssId = await fetchLatestViaRSS(CHANNEL_ID);
      if (rssId) {
        setIframe(rssId);
        writeCache(rssId);
        return;
      }
      // 4) Worst-case Fallback: Hardcoded Video
      setIframe("dQw4w9WgXcQ"); // TODO: durch euer bestehendes Startvideo ersetzen
    }
  })();
});



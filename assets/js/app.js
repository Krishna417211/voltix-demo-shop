/* ============================================================
   Voltix — demo e-commerce store (client-only, for QA testing)
   Auth + cart + catalog live in localStorage. No real backend.
   Demo login:  shopper@voltix.io  /  Voltix123
   ============================================================ */

const DEMO_USER = { email: "shopper@voltix.io", password: "Voltix123", name: "Alex Shopper" };

const PRODUCTS = [
  { id: 1,  name: "Aurora Wireless Headphones", cat: "Audio",       price: 149.00, art: "🎧", blurb: "Active noise-cancelling over-ear headphones with 40-hour battery life.", specs: ["Bluetooth 5.3", "40h battery", "Hi-Res certified", "USB-C fast charge"] },
  { id: 2,  name: "Pulse Smartwatch 2",         cat: "Wearables",   price: 199.00, art: "⌚", blurb: "Track workouts, heart rate and sleep with a bright AMOLED display.", specs: ["AMOLED 1.4\"", "GPS + heart rate", "5 ATM water resistant", "7-day battery"] },
  { id: 3,  name: "Nimbus Bluetooth Speaker",   cat: "Audio",       price: 89.00,  art: "🔊", blurb: "Room-filling 360° sound in a pocket-sized, splash-proof body.", specs: ["360° sound", "IPX6 splash-proof", "16h playtime", "Stereo pairing"] },
  { id: 4,  name: "Vertex Mechanical Keyboard", cat: "Accessories", price: 119.00, art: "⌨️", blurb: "Hot-swappable mechanical keyboard with per-key RGB lighting.", specs: ["Hot-swap switches", "Per-key RGB", "Wired + 2.4GHz", "PBT keycaps"] },
  { id: 5,  name: "Glide Wireless Mouse",       cat: "Accessories", price: 49.00,  art: "🖱️", blurb: "Ultralight 58g wireless mouse with a silent, precise sensor.", specs: ["58g ultralight", "26k DPI sensor", "70h battery", "Silent clicks"] },
  { id: 6,  name: "Lumen Desk Lamp",            cat: "Home",        price: 59.00,  art: "💡", blurb: "Adjustable LED desk lamp with warm-to-cool tuning and USB port.", specs: ["Tunable 2700–6500K", "Touch dimmer", "Built-in USB-A", "Memory setting"] },
  { id: 7,  name: "Cobalt 4K Webcam",           cat: "Accessories", price: 79.00,  art: "📷", blurb: "Crisp 4K webcam with auto-framing and a dual-mic array.", specs: ["4K / 30fps", "Auto-framing", "Dual mics", "Privacy shutter"] },
  { id: 8,  name: "Terra Portable SSD 1TB",     cat: "Accessories", price: 129.00, art: "💾", blurb: "Rugged 1TB SSD with 1050MB/s transfers over USB-C.", specs: ["1TB", "1050MB/s", "USB-C 3.2", "Shock resistant"] },
  { id: 9,  name: "Halo Smart Bulb (2-pack)",   cat: "Home",        price: 39.00,  art: "🔆", blurb: "16-million-colour smart bulbs controllable from any phone.", specs: ["16M colours", "Wi-Fi, no hub", "Schedules", "Voice-assistant ready"] },
  { id: 10, name: "Drift Noise-Free Earbuds",   cat: "Audio",       price: 99.00,  art: "🎵", blurb: "True-wireless earbuds with adaptive ANC and a wireless case.", specs: ["Adaptive ANC", "Wireless charge case", "28h total", "Multipoint"] },
  { id: 11, name: "Atlas Laptop Stand",         cat: "Home",        price: 45.00,  art: "🧱", blurb: "Aluminium laptop stand that raises your screen to eye level.", specs: ["Aircraft aluminium", "Foldable", "Fits 11–17\"", "Cable channel"] },
  { id: 12, name: "Volt 100W GaN Charger",      cat: "Accessories", price: 55.00,  art: "🔌", blurb: "Compact 100W GaN charger that powers a laptop and two phones.", specs: ["100W GaN", "3 ports", "PD 3.0", "Foldable pins"] },
];

const THUMB_BG = {
  Audio:       "linear-gradient(135deg,#243b8f,#5b2f9e)",
  Wearables:   "linear-gradient(135deg,#0f6f6b,#1f9e7a)",
  Home:        "linear-gradient(135deg,#8a5a1e,#b58234)",
  Accessories: "linear-gradient(135deg,#3a2f6e,#6c8cff)",
};

/* ---------------- storage helpers ---------------- */
const KEY_AUTH = "voltix_auth", KEY_CART = "voltix_cart", KEY_ORDERS = "voltix_orders";
const money = n => "$" + n.toFixed(2);
const readJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const Auth = {
  user: () => readJSON(KEY_AUTH, null),
  isIn: () => !!readJSON(KEY_AUTH, null),
  login(email, password) {
    if (email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
      writeJSON(KEY_AUTH, { email: DEMO_USER.email, name: DEMO_USER.name });
      return true;
    }
    return false;
  },
  logout() { localStorage.removeItem(KEY_AUTH); },
};

const Cart = {
  items: () => readJSON(KEY_CART, []),
  count: () => Cart.items().reduce((s, i) => s + i.qty, 0),
  subtotal: () => Cart.items().reduce((s, i) => s + i.qty * i.price, 0),
  add(id, qty = 1) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return;
    const items = Cart.items();
    const row = items.find(i => i.id === id);
    if (row) row.qty += qty; else items.push({ id, name: p.name, price: p.price, art: p.art, qty });
    writeJSON(KEY_CART, items);
  },
  setQty(id, qty) {
    let items = Cart.items();
    if (qty <= 0) items = items.filter(i => i.id !== id);
    else { const r = items.find(i => i.id === id); if (r) r.qty = qty; }
    writeJSON(KEY_CART, items);
  },
  remove(id) { writeJSON(KEY_CART, Cart.items().filter(i => i.id !== id)); },
  clear() { localStorage.removeItem(KEY_CART); },
};

/* ---------------- guard + chrome ---------------- */
function requireAuth() {
  if (!Auth.isIn()) { location.href = "login.html"; return false; }
  return true;
}

function renderNav(active) {
  const u = Auth.user();
  const c = Cart.count();
  return `
  <nav class="nav">
    <a class="brand" href="products.html"><span class="dot"></span> Voltix</a>
    <div class="links">
      <a href="products.html" class="${active==='shop'?'active':''}">Shop</a>
      <a href="products.html?cat=Audio">Audio</a>
      <a href="products.html?cat=Wearables">Wearables</a>
      <a href="products.html?cat=Home">Home</a>
      <a href="products.html?cat=Accessories">Accessories</a>
    </div>
    <div class="spacer"></div>
    <div class="nav-right">
      <a class="cart-link" href="cart.html" data-testid="cart-link">🛒 Cart${c?`<span class="cart-badge">${c}</span>`:''}</a>
      <a href="account.html" class="who">${u?u.name:'Account'}</a>
    </div>
  </nav>`;
}

function mountChrome(active) {
  const host = document.getElementById("nav");
  if (host) host.innerHTML = renderNav(active);
}

/* inline SVG favicon on every page (avoids a /favicon.ico 404) */
(function setFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%236c8cff"/><stop offset="1" stop-color="%238a6cff"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="%230f1220"/><circle cx="16" cy="16" r="7" fill="url(%23g)"/></svg>`;
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = "data:image/svg+xml," + svg;
  document.head.appendChild(link);
})();

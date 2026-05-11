/* ═══════════════════════════════════════════════════════════
   STYLEBOLT — app.js
   Day 2: Product Loop, Cart, Filter, Sort, Quick View, Forms
═══════════════════════════════════════════════════════════ */

/* ── Mock Product Data ─────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1, name: "Oversized Drop-Shoulder Tee",
    category: "tops", price: 1499, original: 1999,
    tag: "new", emoji: "👕",
    desc: "Heavyweight 280gsm cotton with a relaxed drop-shoulder cut. Perfect for layering or wearing solo.",
    sizes: ["XS","S","M","L","XL"]
  },
  {
    id: 2, name: "Washed Cargo Joggers",
    category: "bottoms", price: 2299, original: 2999,
    tag: "hot", emoji: "👖",
    desc: "Garment-washed for a lived-in feel. 6-pocket utility design with tapered ankle cuffs.",
    sizes: ["S","M","L","XL","XXL"]
  },
  {
    id: 3, name: "Asymmetric Coach Jacket",
    category: "outerwear", price: 3499, original: null,
    tag: "new", emoji: "🧥",
    desc: "Technical nylon shell with an asymmetric zip closure. Packs into its own chest pocket.",
    sizes: ["XS","S","M","L","XL"]
  },
  {
    id: 4, name: "Distressed Denim Shorts",
    category: "bottoms", price: 1799, original: 2199,
    tag: "sale", emoji: "🩳",
    desc: "Raw-hem distressed denim in a mid-rise cut. Hand-finished for a unique worn look.",
    sizes: ["28","30","32","34","36"]
  },
  {
    id: 5, name: "Ribbed Longline Vest",
    category: "tops", price: 999, original: null,
    tag: null, emoji: "🎽",
    desc: "Fine-knit ribbed construction in a body-skimming silhouette. Wear tucked or untucked.",
    sizes: ["XS","S","M","L"]
  },
  {
    id: 6, name: "Utility Crossbody Bag",
    category: "accessories", price: 1299, original: 1799,
    tag: "sale", emoji: "👜",
    desc: "Multi-compartment design with adjustable strap. Water-resistant 600D polyester shell.",
    sizes: ["One Size"]
  },
  {
    id: 7, name: "Mesh Bucket Hat",
    category: "accessories", price: 699, original: null,
    tag: "new", emoji: "🧢",
    desc: "6-panel mesh construction with embroidered logo on the front panel. One-size adjustable.",
    sizes: ["One Size"]
  },
  {
    id: 8, name: "Heavyweight Hoodie",
    category: "tops", price: 2799, original: 3299,
    tag: "hot", emoji: "🧤",
    desc: "450gsm brushed fleece interior. Dropped shoulders, kangaroo pocket, and ribbed cuffs.",
    sizes: ["S","M","L","XL","XXL"]
  },
  {
    id: 9, name: "Wide-Leg Track Pants",
    category: "bottoms", price: 2099, original: null,
    tag: null, emoji: "🩲",
    desc: "Silky satin-touch poly with a wide leg and elastic waistband. Side-stripe detail.",
    sizes: ["XS","S","M","L","XL"]
  },
];

/* ── State ─────────────────────────────────────────────── */
let cart = [];
let activeFilter = "all";
let activeSort   = "default";

/* ── DOM Refs ──────────────────────────────────────────── */
const productGrid  = document.getElementById("productGrid");
const cartBadge    = document.getElementById("cartBadge");
const cartCount    = document.getElementById("cartCount");
const cartItems    = document.getElementById("cartItems");
const cartFooter   = document.getElementById("cartFooter");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartSidebar  = document.getElementById("cartSidebar");
const cartOverlay  = document.getElementById("cartOverlay");
const modalOverlay = document.getElementById("modalOverlay");
const quickViewModal = document.getElementById("quickViewModal");
const modalContent = document.getElementById("modalContent");
const navbar       = document.getElementById("navbar");
const hamburger    = document.getElementById("hamburger");
const navLinks     = document.getElementById("navLinks");
const searchToggle = document.getElementById("searchToggle");
const searchBar    = document.getElementById("searchBar");
const searchClose  = document.getElementById("searchClose");
const searchInput  = document.getElementById("searchInput");
const cartToggle   = document.getElementById("cartToggle");
const cartClose    = document.getElementById("cartClose");
const modalClose   = document.getElementById("modalClose");
const sortSelect   = document.getElementById("sortSelect");
const emailInput   = document.getElementById("emailInput");
const subscribeBtn = document.getElementById("subscribeBtn");
const formFeedback = document.getElementById("formFeedback");

/* ══════════════════════════════════════════════════════
   PRODUCT RENDERING
══════════════════════════════════════════════════════ */
function getFilteredSorted() {
  let list = activeFilter === "all"
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.category === activeFilter);

  switch (activeSort) {
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    case "newest":     list.sort((a,b) => (b.tag==="new"?1:0) - (a.tag==="new"?1:0)); break;
    default: break;
  }
  return list;
}

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function renderProducts() {
  const list = getFilteredSorted();
  if (list.length === 0) {
    productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--gray);font-family:var(--font-mono);font-size:13px;letter-spacing:.1em">NO PRODUCTS IN THIS CATEGORY YET</div>`;
    return;
  }

  productGrid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        ${p.tag ? `<div class="product-tag tag-${p.tag}">${p.tag.toUpperCase()}</div>` : ""}
        <div class="product-img-placeholder">
          <img
            src="product-${p.id}.jpg"
            alt="${p.name}"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          />
          <div class="img-fallback">${p.emoji}<span>${p.category.toUpperCase()}</span></div>
        </div>
        <div class="quick-view-trigger" onclick="openQuickView(${p.id})">Quick View ↗</div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">${formatINR(p.price)}</span>
            ${p.original ? `<span class="price-original">${formatINR(p.original)}</span>` : ""}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})" aria-label="Add to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

/* ══════════════════════════════════════════════════════
   FILTER & SORT
══════════════════════════════════════════════════════ */
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderProducts();
  });
});

sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  renderProducts();
});

/* ══════════════════════════════════════════════════════
   CART
══════════════════════════════════════════════════════ */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  openCart();
  pulseCartBadge();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCart();
}

function updateCart() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  cartBadge.textContent = total;
  cartCount.textContent = `(${total})`;
  cartSubtotal.textContent = formatINR(subtotal);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <a href="#shop" class="btn btn-primary" onclick="closeCart()">Start Shopping</a>
      </div>`;
    cartFooter.style.display = "none";
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="product-${item.id}.jpg" alt="${item.name}" onerror="this.style.display='none';this.parentElement.innerHTML='${item.emoji}';" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-cat">${item.category}</div>
          <div class="cart-item-footer">
            <div class="cart-item-price">${formatINR(item.price * item.qty)}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
    cartFooter.style.display = "flex";
  }

  // Shipping note
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const note = document.querySelector(".cart-shipping-note");
  if (note) {
    note.textContent = sub >= 999
      ? "Free shipping on this order 🎉"
      : `Add ${formatINR(999 - sub)} more for free shipping`;
  }
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function pulseCartBadge() {
  cartBadge.style.transform = "scale(1.5)";
  setTimeout(() => { cartBadge.style.transform = "scale(1)"; cartBadge.style.transition = "transform 0.2s"; }, 200);
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* ══════════════════════════════════════════════════════
   QUICK VIEW MODAL
══════════════════════════════════════════════════════ */
function openQuickView(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;

  modalContent.innerHTML = `
    <div class="modal-img" style="padding:0;overflow:hidden;"><img src="product-${p.id}.jpg" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='${p.emoji}';" /></div>
    <div class="modal-details">
      <div class="modal-category">${p.category}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-price">
        <span class="price-current">${formatINR(p.price)}</span>
        ${p.original ? `<span class="price-original">${formatINR(p.original)}</span>` : ""}
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-sizes">
        <span>Select Size</span>
        <div class="size-options">
          ${p.sizes.map(s => `<button class="size-btn" onclick="selectSize(this)">${s}</button>`).join("")}
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="addToCart(${p.id}); closeModal()">
        Add to Cart — ${formatINR(p.price)}
      </button>
      ${p.original ? `<div style="font-family:var(--font-mono);font-size:11px;color:#FF8C00;text-align:center;letter-spacing:.06em">SAVE ${formatINR(p.original - p.price)} ON THIS ITEM</div>` : ""}
    </div>
  `;

  quickViewModal.classList.add("open");
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  quickViewModal.classList.remove("open");
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function selectSize(btn) {
  btn.closest(".size-options").querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

/* ══════════════════════════════════════════════════════
   NAVBAR — scroll / hamburger / search
══════════════════════════════════════════════════════ */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Close nav on link click
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

searchToggle.addEventListener("click", () => {
  searchBar.classList.add("active");
  searchInput.focus();
});
searchClose.addEventListener("click", () => {
  searchBar.classList.remove("active");
  searchInput.value = "";
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeCart();
    closeModal();
    searchBar.classList.remove("active");
  }
});

/* ══════════════════════════════════════════════════════
   NEWSLETTER FORM
══════════════════════════════════════════════════════ */
subscribeBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formFeedback.className = "form-feedback";

  if (!email) {
    formFeedback.textContent = "✕ Please enter your email address.";
    formFeedback.classList.add("error");
    emailInput.style.borderColor = "#FF3A3A";
    return;
  }
  if (!emailRegex.test(email)) {
    formFeedback.textContent = "✕ That doesn't look like a valid email.";
    formFeedback.classList.add("error");
    emailInput.style.borderColor = "#FF3A3A";
    return;
  }

  // Simulate success
  subscribeBtn.textContent = "...";
  subscribeBtn.disabled = true;
  emailInput.style.borderColor = "";

  setTimeout(() => {
    formFeedback.textContent = "✓ You're in! Watch your inbox for the next drop.";
    formFeedback.classList.add("success");
    emailInput.value = "";
    subscribeBtn.textContent = "Subscribe";
    subscribeBtn.disabled = false;
  }, 800);
});

emailInput.addEventListener("keydown", e => {
  if (e.key === "Enter") subscribeBtn.click();
  emailInput.style.borderColor = "";
  formFeedback.textContent = "";
});

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
renderProducts();
updateCart();

/* ═══════════════════════════════════════════════════════════
   DAY 3 — Micro-interactions, Scroll Animations, Polish
═══════════════════════════════════════════════════════════ */

/* ── Progress Bar ──────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});

/* ── Countdown Timer ───────────────────────────────────── */
function updateCountdown() {
  const target = new Date('2026-05-12T12:00:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    document.getElementById('countdownBanner').classList.add('hidden');
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');

  // Animate flip on change
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && el.textContent !== pad(val)) {
      el.style.transform = 'translateY(-8px)';
      el.style.opacity   = '0';
      setTimeout(() => {
        el.textContent   = pad(val);
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 150);
    }
  };

  setVal('cdDays',  days);
  setVal('cdHours', hours);
  setVal('cdMins',  mins);
  setVal('cdSecs',  secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Close banner
document.getElementById('countdownClose').addEventListener('click', () => {
  document.getElementById('countdownBanner').classList.add('hidden');
});

/* ── Scroll Reveal (IntersectionObserver) ──────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  // Sections
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Trust items
  document.querySelectorAll('.trust-item').forEach(el => {
    revealObserver.observe(el);
  });

  // Collection cards
  document.querySelectorAll('.collection-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--i', i);
    revealObserver.observe(el);
  });
}

// Re-run after products render
const origRender = renderProducts;
window.renderProducts = function() {
  origRender();
  // Add reveal + stagger to each product card
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.setProperty('--i', i % 3);
    revealObserver.observe(card);
  });
};

// Override renderProducts to also init reveal
const _render = renderProducts;
renderProducts = function() {
  _render();
  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach((card, i) => {
      card.classList.add('reveal');
      card.style.setProperty('--i', i % 3);
      revealObserver.observe(card);
    });
  }, 50);
};

initReveal();
// Re-init after first render
setTimeout(initReveal, 100);

/* ── Button Ripple Effect ──────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn, .btn-primary, .btn-ghost, .btn-sm');
  if (!btn) return;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size/2}px;
    top:  ${e.clientY - rect.top  - size/2}px;
  `;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ── Toast Notification ────────────────────────────────── */
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg, icon = '✓') {
  clearTimeout(toastTimer);
  toastEl.innerHTML = `<span class="toast-icon">${icon}</span>${msg}`;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// Override addToCart to show toast
const _addToCart = addToCart;
addToCart = function(id) {
  const p = PRODUCTS.find(p => p.id === id);
  _addToCart(id);
  if (p) showToast(`${p.name} added to cart`, '✓');
};

/* ── Back to Top ───────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Active Nav Link on Scroll ─────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id="home"]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

/* ── Wishlist Toggle ───────────────────────────────────── */
document.querySelectorAll('.icon-btn[aria-label="Wishlist"]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('wishlisted');
    showToast(
      btn.classList.contains('wishlisted') ? 'Added to wishlist' : 'Removed from wishlist',
      btn.classList.contains('wishlisted') ? '♥' : '♡'
    );
  });
});

/* ── Smooth scroll for all anchor links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

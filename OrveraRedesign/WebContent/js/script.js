
// Prevent browser auto scroll restoration on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
/* =============================================
   ORVERA — Main JavaScript
   ============================================= */

/* ---- CANVAS ROUNDRECT POLYFILL ---- */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') {
      r = [r, r, r, r];
    } else if (Array.isArray(r)) {
      if (r.length === 1) r = [r[0], r[0], r[0], r[0]];
      else if (r.length === 2) r = [r[0], r[1], r[0], r[1]];
      else if (r.length === 3) r = [r[0], r[1], r[2], r[1]];
      else if (r.length >= 4) r = [r[0], r[1], r[2], r[3]];
    } else {
      r = [0, 0, 0, 0];
    }
    this.moveTo(x + r[0], y);
    this.lineTo(x + w - r[1], y);
    this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
    this.lineTo(x + w, y + h - r[2]);
    this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
    this.lineTo(x + r[3], y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
    this.lineTo(x, y + r[0]);
    this.quadraticCurveTo(x, y, x + r[0], y);
    this.closePath();
    return this;
  };
}

/* ---- NAVBAR SCROLL ---- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- MOBILE MENU ---- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-item').forEach(item => {
  const header = item.querySelector('.faq-header') || item.querySelector('.faq-question');
  header?.addEventListener('click', () => {
    const body = item.querySelector('.faq-body') || item.querySelector('.faq-content') || item.querySelector('.faq-text');
    const isOpen = item.classList.contains('open') || item.classList.contains('active');
    
    // Close other FAQs
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open', 'active');
      const b = i.querySelector('.faq-body') || i.querySelector('.faq-content') || i.querySelector('.faq-text');
      if (b) b.style.maxHeight = '0px';
    });
    
    if (!isOpen) {
      item.classList.add('open', 'active');
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    }
  });
});

/* ---- COUNTER ANIMATION ---- */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---- CONTACT FORM ---- */
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '&#10003; Request Sent';
    btn.style.background = '#3D6355';
    setTimeout(() => {
      btn.innerHTML = 'Send Request <i class="ti ti-arrow-right"></i>';
      btn.disabled = false;
      btn.style.background = '';
      this.reset();
    }, 3000);
  }, 1200);
});

/* ---- AI CHATBOT ---- */
const SYSTEM = `You are ORVERA's premium AI assistant. ORVERA is a luxury sustainable brand offering:
- Eco Cutlery: premium biodegradable cutlery for restaurants, hotels, cafes and events
- Eco Bottles: elegant reusable water/bamboo bottles, custom-branded
- Eco Packaging: sophisticated sustainable packaging for conscious businesses
Services: Bulk B2B supply, white-label custom branding, global shipping, minimum orders from 500 units.
Contact Email: orverabottles@gmail.com.
Mission: Sustainability should never compromise quality or luxury.
Tone: warm, knowledgeable, professional. Keep replies to 2-4 sentences. For contact or email requests, provide orverabottles@gmail.com. Never invent prices.`;

let chatHistory = [];
let chatOpen = true;

const fabBtn = document.getElementById('chat-fab');
const chatWin = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatChips = document.getElementById('chat-chips');

function toggleChat() {
  chatOpen = !chatOpen;
  chatWin.classList.toggle('hidden', !chatOpen);
  fabBtn.querySelector('i').className = chatOpen ? 'ti ti-x' : 'ti ti-message-circle';
  if (chatOpen) chatInput?.focus();
}

fabBtn?.addEventListener('click', toggleChat);
document.getElementById('chat-close')?.addEventListener('click', () => {
  chatOpen = true; toggleChat();
});

function appendMsg(role, html) {
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  if (role === 'bot') {
    div.innerHTML = `<div class="msg-icon"><i class="ti ti-leaf" aria-hidden="true"></i></div><div class="msg-bubble">${html}</div>`;
  } else {
    div.innerHTML = `<div class="msg-bubble">${html}</div>`;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function showTyping() {
  const d = document.createElement('div');
  d.id = 'typing-indicator';
  d.className = 'msg bot';
  d.innerHTML = `<div class="msg-icon"><i class="ti ti-leaf" aria-hidden="true"></i></div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function hideTyping() { document.getElementById('typing-indicator')?.remove(); }

async function sendChat(text) {
  const msg = text || chatInput?.value.trim();
  if (!msg) return;
  if (chatInput) chatInput.value = '';
  if (chatChips) chatChips.style.display = 'none';
  appendMsg('user', msg);
  chatHistory.push({ role: 'user', content: msg });
  if (chatSend) chatSend.disabled = true;
  showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages: chatHistory
      })
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || 'I\'m having trouble right now. Please use our contact form for assistance!';
    hideTyping();
    appendMsg('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    hideTyping();
    appendMsg('bot', 'Connection issue — please reach us via the contact form on this page.');
  }
  if (chatSend) chatSend.disabled = false;
  chatInput?.focus();
}

chatSend?.addEventListener('click', () => sendChat());
chatInput?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
document.querySelectorAll('.chat-chip').forEach(chip => {
  chip.addEventListener('click', () => sendChat(chip.textContent.trim()));
});

/* ---- THEME TOGGLER ---- */
const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  // Sync state with localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.innerText = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.innerText = "🌙";
  }
  
  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggleBtn.innerText = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeToggleBtn.innerText = "☀️";
    }
  });
}

/* =============================================
   ORVERA — Tableware Premium Logic Extension
   ============================================= */

// Lookbook Hotspots Mobile Click Toggle
document.querySelectorAll('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('click', (e) => {
    if (e.target.classList.contains('popover-btn') || e.target.closest('.hotspot-popover')) return;
    const popover = hotspot.querySelector('.hotspot-popover');
    if (popover) {
      const isVisible = getComputedStyle(popover).opacity !== '0';
      document.querySelectorAll('.hotspot-popover').forEach(p => {
        p.style.opacity = '0';
        p.style.pointerEvents = 'none';
        p.style.transform = 'translateX(-50%) translateY(10px) scale(0.95)';
      });
      if (!isVisible) {
        popover.style.opacity = '1';
        popover.style.pointerEvents = 'auto';
        popover.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      }
    }
  });
});

// Catalog live filtering and searching
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('catalog-search');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

  productCards.forEach(card => {
    const category = card.dataset.category;
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();

    const matchesFilter = (activeFilter === 'all' || category === activeFilter);
    const matchesSearch = (!searchQuery || title.includes(searchQuery) || desc.includes(searchQuery));

    if (matchesFilter && matchesSearch) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProducts();
  });
});

searchInput?.addEventListener('input', filterProducts);

// Inquiry Drawer / Cart Logic
let inquiryCart = JSON.parse(localStorage.getItem('orvera_inquiry_cart')) || [];

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const totalQty = inquiryCart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 0) {
      badge.textContent = totalQty;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function saveCart() {
  localStorage.setItem('orvera_inquiry_cart', JSON.stringify(inquiryCart));
  updateCartBadge();
  renderCartItems();
}

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  const totalValEl = document.getElementById('cart-total-val');
  if (!container) return;

  if (inquiryCart.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: var(--lt-gray); font-size: 13px;">Your inquiry list is empty. Explore our products to add items!</div>`;
    if (totalValEl) totalValEl.textContent = '₹0.00';
    return;
  }

  container.innerHTML = '';
  let grandTotal = 0;

  inquiryCart.forEach((item, index) => {
    const itemSubtotal = item.price * item.qty;
    grandTotal += itemSubtotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.style.display = 'flex';
    row.style.gap = '15px';
    row.style.alignItems = 'center';
    row.style.borderBottom = '1px solid var(--border-lt)';
    row.style.paddingBottom = '15px';
    row.style.marginBottom = '15px';

    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}" style="width: 55px; height: 55px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-lt);">
      <div style="flex: 1;">
        <h4 style="font-family: var(--serif); font-size:13px; color: var(--cream); margin-bottom: 4px;">${item.title}</h4>
        <span style="font-size:11px; color: var(--gold-lt);">${item.price > 0 ? `₹${item.price.toFixed(2)} / set` : 'Will update you soon'}</span>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
          <button class="qty-btn dec-qty" data-index="${index}" style="width:18px; height:18px; border:1px solid var(--border); background:none; color:var(--cream); cursor:pointer; font-size:11px; border-radius:50%; display:flex; align-items:center; justify-content:center;">-</button>
          <input type="number" class="qty-input" data-index="${index}" value="${item.qty}" min="1" style="width: 40px; text-align:center; border: 1px solid var(--border); border-radius:4px; font-size:11px; background:var(--off-white); color:var(--cream); padding:1px 0;">
          <button class="qty-btn inc-qty" data-index="${index}" style="width:18px; height:18px; border:1px solid var(--border); background:none; color:var(--cream); cursor:pointer; font-size:11px; border-radius:50%; display:flex; align-items:center; justify-content:center;">+</button>
        </div>
      </div>
      <button class="remove-cart-item" data-index="${index}" style="background:none; border:none; color:#a33; cursor:pointer; font-size:18px;">&times;</button>
    `;

    container.appendChild(row);
  });

  if (totalValEl) {
    totalValEl.textContent = grandTotal > 0 ? `₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Will update you soon';
  }

  container.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (inquiryCart[idx].qty > 1) {
        inquiryCart[idx].qty--;
        saveCart();
      }
    });
  });

  container.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      inquiryCart[idx].qty++;
      saveCart();
    });
  });

  container.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.dataset.index, 10);
      const val = parseInt(input.value, 10);
      if (val >= 1) {
        inquiryCart[idx].qty = val;
        saveCart();
      } else {
        input.value = inquiryCart[idx].qty;
      }
    });
  });

  container.querySelectorAll('.remove-cart-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      inquiryCart.splice(idx, 1);
      saveCart();
    });
  });
}

// Add to inquiry button handlers
document.querySelectorAll('.add-to-inquiry-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const id = card.dataset.id;
    const title = card.querySelector('h3').textContent;
    
    let price = 0;
    const priceText = card.querySelector('.product-price').textContent;
    const parsed = parseFloat(priceText.replace('$', '').replace('₹', ''));
    if (!isNaN(parsed)) {
      price = parsed;
    }
    
    const img = card.querySelector('img').src;

    const existing = inquiryCart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      inquiryCart.push({ id, title, price, img, qty: 1 });
    }

    saveCart();
    openCart();
    showToast(`Added ${title} to inquiry list.`);
  });
});

function openCart() {
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('open');
}

function closeCart() {
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('open');
}

document.getElementById('cart-trigger')?.addEventListener('click', openCart);
document.querySelector('.cart-close-btn')?.addEventListener('click', closeCart);
document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

// Submit Cart Inquiry
document.getElementById('submit-inquiry-btn')?.addEventListener('click', () => {
  if (inquiryCart.length === 0) {
    showToast("Your inquiry list is empty!");
    return;
  }
  showToast("Inquiry submitted! Redirecting to sales...");
  inquiryCart = [];
  saveCart();
  closeCart();
  setTimeout(() => {
    window.location.href = 'contact.html';
  }, 1200);
});

// Comparison Matrix Logic
let compareList = [];
const maxCompare = 3;

const productSpecs = {
  'cutlery-classic': {
    title: 'Classic Cutlery Set',
    material: '100% Sustainable Birchwood & Bamboo',
    price: '₹6.50 / set',
    compost: '90 Days (Home Compostable)',
    fsc: 'Yes (FSC Certified)'
  },
  'bottles-bamboo': {
    title: 'Matte Bamboo Bottle',
    material: 'Ceramic Core with Organic Bamboo Wrap',
    price: '₹24.00 / pc',
    compost: 'Reusable (Biodegradable Lid)',
    fsc: 'Yes (Bamboo Sourcing)'
  },
  'packaging-box': {
    title: 'Kraft Luxury Box',
    material: 'Raw Kraft Recycled Fiber Paperboard',
    price: '₹3.20 / pc',
    compost: '60 Days (Soil-to-Soil)',
    fsc: 'Yes (FSC Certified)'
  }
};

document.querySelectorAll('.compare-badge-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = btn.dataset.id;
    const idx = compareList.indexOf(id);

    if (idx !== -1) {
      compareList.splice(idx, 1);
      btn.classList.remove('selected');
      btn.textContent = 'Compare';
    } else {
      if (compareList.length >= maxCompare) {
        showToast(`You can compare up to ${maxCompare} products at once.`);
        return;
      }
      compareList.push(id);
      btn.classList.add('selected');
      btn.textContent = 'Selected';
    }

    updateCompareBar();
  });
});

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  const countEl = document.getElementById('compare-count');
  if (!bar) return;

  if (compareList.length > 0) {
    countEl.textContent = compareList.length;
    bar.classList.add('open');
  } else {
    bar.classList.remove('open');
  }
}

document.getElementById('compare-now-btn')?.addEventListener('click', () => {
  openCompareModal();
});

function openCompareModal() {
  const modal = document.getElementById('compare-modal');
  const overlay = document.getElementById('compare-overlay');
  const tbody = modal?.querySelector('.compare-table tbody');
  if (!modal || !tbody) return;

  tbody.innerHTML = '';

  let headerRow = `<tr><th>Specification</th>`;
  compareList.forEach(id => {
    const spec = productSpecs[id];
    headerRow += `<th>${spec.title}</th>`;
  });
  headerRow += `</tr>`;
  tbody.innerHTML += headerRow;

  const props = [
    { label: 'Material Composition', key: 'material' },
    { label: 'Wholesale Unit Rate', key: 'price' },
    { label: 'Biodegradability Period', key: 'compost' },
    { label: 'FSC Sustainability Certified', key: 'fsc' }
  ];

  props.forEach(prop => {
    let row = `<tr><td><strong>${prop.label}</strong></td>`;
    compareList.forEach(id => {
      const spec = productSpecs[id];
      row += `<td>${spec[prop.key]}</td>`;
    });
    row += `</tr>`;
    tbody.innerHTML += row;
  });

  modal.classList.add('open');
  overlay.style.display = 'block';
}

function closeCompareModal() {
  document.getElementById('compare-modal')?.classList.remove('open');
  const overlay = document.getElementById('compare-overlay');
  if (overlay) overlay.style.display = 'none';
}

document.getElementById('compare-modal-close')?.addEventListener('click', closeCompareModal);
document.getElementById('compare-overlay')?.addEventListener('click', closeCompareModal);

// Pricing Estimator Widget
const sizeInput = document.getElementById('set-size');
const sizeValText = document.getElementById('set-size-val');
const customEngravingCheck = document.getElementById('custom-engraving');
const freightRegionSelect = document.getElementById('freight-region');

function updateEstimator() {
  if (!sizeInput) return;
  const size = parseInt(sizeInput.value, 10);
  if (sizeValText) sizeValText.textContent = size;

  const finishRadio = document.querySelector('input[name="finish"]:checked');
  const finishSurchargeRate = parseFloat(finishRadio?.dataset.surcharge || '0.00');
  
  const hasEngraving = customEngravingCheck ? customEngravingCheck.checked : false;
  const engravingSurchargeRate = hasEngraving ? 1.25 : 0.00;

  const baseRate = 6.50;
  const basePrice = size * baseRate;
  const finishSurcharge = size * finishSurchargeRate;
  const engravingSurcharge = size * engravingSurchargeRate;
  const total = basePrice + finishSurcharge + engravingSurcharge;

  const sizeEl = document.getElementById('res-size');
  const basePriceEl = document.getElementById('res-base-price');
  const finishSurchargeEl = document.getElementById('res-finish-surcharge');
  const engravingSurchargeEl = document.getElementById('res-engraving-surcharge');
  const totalPriceEl = document.getElementById('res-total-price');

  if (sizeEl) sizeEl.textContent = `${size} pieces`;
  if (basePriceEl) basePriceEl.textContent = `₹${basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (finishSurchargeEl) finishSurchargeEl.textContent = `₹${finishSurcharge.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (engravingSurchargeEl) engravingSurchargeEl.textContent = `₹${engravingSurcharge.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (totalPriceEl) totalPriceEl.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const region = freightRegionSelect ? freightRegionSelect.value : 'ind';
  const freightCostEl = document.getElementById('freight-cost');
  const freightTimeEl = document.getElementById('freight-time');
  const freightOffsetEl = document.getElementById('freight-offset');

  let freightCost = 0.00;
  let freightTime = "3-5 Business Days";
  let freightOffsetVal = Math.round(size * 0.024);

  if (region === 'ind') {
    freightCost = 0.00;
    freightTime = "3-5 Business Days";
  } else if (region === 'exp') {
    freightCost = 1200.00;
    freightTime = "1-2 Business Days";
    freightOffsetVal = Math.round(size * 0.036);
  } else if (region === 'intl') {
    freightCost = 5000.00;
    freightTime = "7-12 Business Days";
    freightOffsetVal = Math.round(size * 0.052);
  }

  if (freightCostEl) freightCostEl.textContent = freightCost === 0 ? "Free" : `₹${freightCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (freightTimeEl) freightTimeEl.textContent = freightTime;
  if (freightOffsetEl) freightOffsetEl.textContent = `${freightOffsetVal} kg CO2 Offset`;

  const plasticsAvoided = Math.round(size * 1.5);
  const carbonOffset = Math.round(size * 0.04) + freightOffsetVal;
  const treesEquivalent = parseFloat((carbonOffset / 21.8).toFixed(2));

  const esgCo2 = document.getElementById('esg-co2');
  const esgPlastics = document.getElementById('esg-plastics');
  const esgTrees = document.getElementById('esg-trees');

  if (esgCo2) { esgCo2.dataset.target = carbonOffset; esgCo2.dataset.suffix = ' kg'; esgCo2.textContent = `${carbonOffset} kg`; }
  if (esgPlastics) { esgPlastics.dataset.target = plasticsAvoided; esgPlastics.dataset.suffix = ' pcs'; esgPlastics.textContent = `${plasticsAvoided} pcs`; }
  if (esgTrees) { esgTrees.dataset.target = treesEquivalent; esgTrees.dataset.suffix = ' trees'; esgTrees.textContent = `${treesEquivalent} trees`; }
}

sizeInput?.addEventListener('input', updateEstimator);
customEngravingCheck?.addEventListener('change', updateEstimator);
freightRegionSelect?.addEventListener('change', updateEstimator);
document.querySelectorAll('input[name="finish"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.finish-card').forEach(c => c.classList.remove('selected'));
    radio.closest('.finish-card')?.classList.add('selected');
    updateEstimator();
  });
});

// Canvas-based Spoon Logo Engraving Customizer
const visualizerCanvas = document.getElementById('visualizer-canvas');
const logoUploadInput = document.getElementById('logo-upload');
const removeLogoBtn = document.getElementById('remove-logo');
let uploadedLogoImg = null;


function initVisualizerCanvas() {
  if (!visualizerCanvas) return;
  drawSpoonEngraving();
}

function drawSpoonEngraving() {
  const ctx = visualizerCanvas.getContext('2d');
  const w = visualizerCanvas.width;
  const h = visualizerCanvas.height;

  ctx.clearRect(0, 0, w, h);

  // Helper to remove white/light backgrounds from uploaded images and tint black lines to gold
  const removeWhiteBackground = (img) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth || img.width || 1;
    tempCanvas.height = img.naturalHeight || img.height || 1;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    try {
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If the pixel is white/near-white, make it transparent
        if (r > 200 && g > 200 && b > 200) {
          data[i + 3] = 0; // Make transparent
        }
        // If the pixel is black/near-black, convert to premium gold (#c5a880: R=197, G=168, B=128)
        else if (r < 60 && g < 60 && b < 60) {
          data[i] = 197;
          data[i + 1] = 168;
          data[i + 2] = 128;
        }
      }
      tempCtx.putImageData(imgData, 0, 0);
      return tempCanvas;
    } catch (e) {
      return img;
    }
  };

  // Helper function to scale and draw logo proportionally
  const drawLogoProportionally = (img) => {
    ctx.save();
    const maxLogoW = w - 60; // 30px padding left & right
    const maxLogoH = h - 60; // 30px padding top & bottom
    let logoW = maxLogoW;
    let logoH = maxLogoH;

    const wImg = img.naturalWidth || img.width || 1;
    const hImg = img.naturalHeight || img.height || 1;
    const imgRatio = wImg / hImg;
    const canvasRatio = maxLogoW / maxLogoH;

    if (imgRatio > canvasRatio) {
      logoW = maxLogoW;
      logoH = maxLogoW / imgRatio;
    } else {
      logoH = maxLogoH;
      logoW = maxLogoH * imgRatio;
    }

    const lx = w / 2 - logoW / 2;
    const ly = h / 2 - logoH / 2;

    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, lx, ly, logoW, logoH);
    ctx.restore();
  };

  // Render brand logo preview on transparent/green background
  if (uploadedLogoImg) {
    const processedLogo = removeWhiteBackground(uploadedLogoImg);
    drawLogoProportionally(processedLogo);
  }
}

logoUploadInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      uploadedLogoImg = img;
      const container = document.querySelector('.visualizer-canvas-container');
      if (container) container.style.display = 'flex';
      drawSpoonEngraving();
      if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

removeLogoBtn?.addEventListener('click', () => {
  uploadedLogoImg = null;
  if (logoUploadInput) logoUploadInput.value = '';
  const container = document.querySelector('.visualizer-canvas-container');
  if (container) container.style.display = 'none';
  drawSpoonEngraving();
  if (removeLogoBtn) removeLogoBtn.style.display = 'none';
});

// Setup visualizer box drag and drop
const visualizerBox = document.getElementById('visualizer-box');
visualizerBox?.addEventListener('dragover', (e) => {
  e.preventDefault();
  visualizerBox.classList.add('dragover');
});
visualizerBox?.addEventListener('dragleave', () => {
  visualizerBox.classList.remove('dragover');
});
visualizerBox?.addEventListener('drop', (e) => {
  e.preventDefault();
  visualizerBox.classList.remove('dragover');
  
  const file = e.dataTransfer.files[0];
  if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedLogoImg = img;
        const container = document.querySelector('.visualizer-canvas-container');
        if (container) container.style.display = 'flex';
        drawSpoonEngraving();
        if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Image Gallery Lightbox Widget
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    }
  });
});

document.getElementById('lightbox-close')?.addEventListener('click', () => {
  document.getElementById('lightbox')?.classList.remove('open');
});
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox' || e.target.id === 'lightbox-close') {
    document.getElementById('lightbox')?.classList.remove('open');
  }
});


// Write B2B Review modal handling
const writeReviewBtn = document.getElementById('write-review-btn');
const reviewModal = document.getElementById('review-modal');
const reviewModalOverlay = document.getElementById('review-modal-overlay');
const reviewModalClose = document.getElementById('review-modal-close');

function openReviewModal() {
  reviewModal?.classList.add('open');
  reviewModalOverlay?.classList.add('open');
}

function closeReviewModal() {
  reviewModal?.classList.remove('open');
  reviewModalOverlay?.classList.remove('open');
}

writeReviewBtn?.addEventListener('click', openReviewModal);
reviewModalClose?.addEventListener('click', closeReviewModal);
reviewModalOverlay?.addEventListener('click', closeReviewModal);

// ESG Impact Certificate Generator Logic
const generateCertBtn = document.getElementById('generate-cert-btn');
const certModal = document.getElementById('cert-modal');
const certOverlay = document.getElementById('cert-overlay');
const certModalClose = document.getElementById('cert-modal-close');
const certPartnerNameInput = document.getElementById('cert-partner-name');
const certCanvas = document.getElementById('cert-canvas');
const downloadCertBtn = document.getElementById('download-cert-btn');

function generateCertificate() {
  const companyName = certPartnerNameInput ? certPartnerNameInput.value.trim() : '';
  if (!companyName) {
    showToast("Please enter a company name first!");
    return;
  }

  const size = sizeInput ? parseInt(sizeInput.value, 10) : 500;
  const plasticsAvoided = Math.round(size * 1.5);
  const region = freightRegionSelect ? freightRegionSelect.value : 'us';
  let freightOffsetVal = Math.round(size * 0.024);
  if (region === 'eu') freightOffsetVal = Math.round(size * 0.036);
  else if (region === 'intl') freightOffsetVal = Math.round(size * 0.052);
  const carbonOffset = Math.round(size * 0.04) + freightOffsetVal;

  const ctx = certCanvas.getContext('2d');
  const w = certCanvas.width;
  const h = certCanvas.height;

  // Draw luxury background cream color
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, w, h);

  // Double border with gold/forest accents
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#2b4f37'; // Forest
  ctx.strokeRect(10, 10, w - 20, h - 20);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#8b6b41'; // Gold
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Border corners details
  ctx.fillStyle = '#8b6b41';
  ctx.fillRect(14, 14, 15, 15);
  ctx.fillRect(w - 29, 14, 15, 15);
  ctx.fillRect(14, h - 29, 15, 15);
  ctx.fillRect(w - 29, h - 29, 15, 15);

  // Title: ORVERA
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillStyle = '#2b4f37';
  ctx.textAlign = 'center';
  ctx.fillText('O R V E R A', w / 2, 45);

  // Subtitle
  ctx.font = 'italic 9px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#8b6b41';
  ctx.fillText('PREMIUM SUSTAINABLE LUXURY TABLEWARE', w / 2, 60);

  // Main Heading: CERTIFICATE OF ECO IMPACT
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = '#101c16';
  ctx.fillText('Certificate of Sustainability', w / 2, 100);

  // Presented to text
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#738078';
  ctx.fillText('THIS COMMENDATION IS PRESENTED TO', w / 2, 135);

  // Partner Name
  ctx.font = 'italic bold 20px Georgia, serif';
  ctx.fillStyle = '#8b6b41';
  ctx.fillText(companyName, w / 2, 168);

  // Statement body
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#2d3531';
  ctx.fillText('For demonstrating exceptional environmental responsibility in B2B supply logistics,', w / 2, 205);
  ctx.fillText(`preventing a projected ${plasticsAvoided.toLocaleString()} single-use plastic waste units and offsetting`, w / 2, 220);
  ctx.fillText(`approximately ${carbonOffset.toLocaleString()} kg of CO₂ carbon emissions through certified organic fibers.`, w / 2, 235);

  // Footer: Issue Date & Signature lines
  ctx.font = '8px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#738078';
  
  // Date
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillText(`ISSUED ON: ${dateStr}`, 100, 290);
  ctx.fillText('OFFICIAL SEAL & CSO SIGNATURE', w - 110, 290);

  // Simple signature rendering
  ctx.beginPath();
  ctx.strokeStyle = '#8b6b41';
  ctx.lineWidth = 1;
  ctx.moveTo(w - 150, 275);
  ctx.lineTo(w - 70, 275);
  ctx.stroke();

  // Seal circle
  ctx.beginPath();
  ctx.strokeStyle = '#2b4f37';
  ctx.lineWidth = 1.5;
  ctx.arc(w - 110, 265, 14, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.font = '7px Georgia';
  ctx.fillText('ORV', w - 110, 267);

  // Date line
  ctx.beginPath();
  ctx.strokeStyle = '#738078';
  ctx.lineWidth = 0.5;
  ctx.moveTo(60, 275);
  ctx.lineTo(140, 275);
  ctx.stroke();

  // Show Modal & Overlay
  certModal?.classList.add('open');
  certOverlay?.classList.add('open');
}

generateCertBtn?.addEventListener('click', generateCertificate);

function closeCertModal() {
  certModal?.classList.remove('open');
  certOverlay?.classList.remove('open');
}

certModalClose?.addEventListener('click', closeCertModal);
certOverlay?.addEventListener('click', closeCertModal);

// Download Certificate PNG Link Exporter
downloadCertBtn?.addEventListener('click', () => {
  if (!certCanvas) return;
  const link = document.createElement('a');
  link.download = `${certPartnerNameInput?.value.trim().replace(/\s+/g, '_') || 'orvera'}_esg_certificate.png`;
  link.href = certCanvas.toDataURL('image/png');
  link.click();
  showToast("Certificate downloaded successfully!");
});

// Mappings for hamburger handled at the top of the file

// Toast helper utility
function showToast(message) {
  let toast = document.getElementById('orvera-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'orvera-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '30px';
    toast.style.background = '#1b3323';
    toast.style.border = '1px solid rgba(139,107,65,0.18)';
    toast.style.color = '#faf9f6';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '99999';
    toast.style.boxShadow = '0 8px 30px rgba(0,0,0,0.35)';
    toast.style.fontSize = '12.5px';
    toast.style.transition = 'opacity 0.35s, transform 0.35s';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

// Star selector hover/click ratings logic
const stars = document.querySelectorAll('#star-rating-selector .star-select');
const ratingInput = document.getElementById('review-rating');

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const rating = parseInt(star.dataset.rating, 10);
    stars.forEach(s => {
      const r = parseInt(s.dataset.rating, 10);
      s.classList.toggle('hover', r <= rating);
    });
  });

  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hover'));
  });

  star.addEventListener('click', () => {
    const rating = parseInt(star.dataset.rating, 10);
    if (ratingInput) ratingInput.value = rating;
    stars.forEach(s => {
      const r = parseInt(s.dataset.rating, 10);
      s.classList.toggle('selected', r <= rating);
    });
  });
});

// Submit review form
document.getElementById('review-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const rating = parseInt(document.getElementById('review-rating').value, 10);
  const name = document.getElementById('review-input-name').value.trim();
  const role = document.getElementById('review-input-role').value.trim();
  const title = document.getElementById('review-input-title').value.trim();
  const text = document.getElementById('review-input-text').value.trim();
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const newReview = { rating, name, role, title, text, date };
  let customReviews = JSON.parse(localStorage.getItem('orvera_custom_reviews')) || [];
  customReviews.push(newReview);
  localStorage.setItem('orvera_custom_reviews', JSON.stringify(customReviews));

  renderReviewCard(newReview);

  showToast("Review submitted successfully! Thank you.");
  this.reset();
  stars.forEach(s => s.classList.remove('selected'));
  if (ratingInput) ratingInput.value = '5';
  closeReviewModal();
});

function renderReviewCard(review) {
  const reviewsGrid = document.getElementById('reviews-grid');
  if (!reviewsGrid) return;

  const ratingStarsStr = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `
    <div class="review-header">
      <span class="review-stars">${ratingStarsStr}</span>
      <span class="review-date">${review.date}</span>
    </div>
    <h4 class="review-title">${review.title}</h4>
    <p class="review-text">"${review.text}"</p>
    <div class="review-author">
      <div class="author-avatar">${initials}</div>
      <div>
        <strong>${review.name}</strong>
        <span>${review.role}</span>
      </div>
    </div>
  `;
  reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
}

function loadCustomReviews() {
  const customReviews = JSON.parse(localStorage.getItem('orvera_custom_reviews')) || [];
  customReviews.forEach(review => {
    renderReviewCard(review);
  });
}

// ---- CLIENT PORTAL LOGIN REGISTRATION ----
const loginModal = document.getElementById('login-modal');
const loginOverlay = document.getElementById('login-modal-overlay');
const loginModalClose = document.getElementById('login-modal-close');

function openLoginModal() {
  loginModal?.classList.add('open');
  loginOverlay?.classList.add('open');
}

function closeLoginModal() {
  loginModal?.classList.remove('open');
  loginOverlay?.classList.remove('open');
}

document.querySelectorAll('#login-trigger-btn, .login-trigger-btn-mobile').forEach(btn => {
  btn?.addEventListener('click', openLoginModal);
});
loginModalClose?.addEventListener('click', closeLoginModal);
loginOverlay?.addEventListener('click', closeLoginModal);

document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('login-input-name').value.trim();
  const email = document.getElementById('login-input-email').value.trim();
  const company = document.getElementById('login-input-company').value.trim();
  const phone = document.getElementById('login-input-phone').value.trim();
  const timestamp = new Date().toISOString();

  // Check if admin login
  if (email.toLowerCase() === 'orverabottles@gmail.com') {
    sessionStorage.setItem('orvera_is_admin', 'true');
    showToast("Logged in as Administrator! Export controls enabled.");
    this.reset();
    closeLoginModal();
    document.querySelectorAll('#login-trigger-btn, .login-trigger-btn-mobile').forEach(btn => {
      btn.textContent = "Hi, Admin";
    });
    const controls = document.getElementById('admin-export-controls');
    if (controls) {
      controls.style.display = 'flex';
    }
    return;
  }

  let db = JSON.parse(localStorage.getItem('orvera_client_logins')) || [];
  db.push({ name, email, company, phone, timestamp });
  localStorage.setItem('orvera_client_logins', JSON.stringify(db));

  showToast(`Welcome, ${name}! Logged in successfully.`);
  this.reset();
  closeLoginModal();

  document.querySelectorAll('#login-trigger-btn, .login-trigger-btn-mobile').forEach(btn => {
    btn.textContent = `Hi, ${name.split(' ')[0]}`;
  });
});

function syncLoggedInState() {
  if (sessionStorage.getItem('orvera_is_admin') === 'true') {
    document.querySelectorAll('#login-trigger-btn, .login-trigger-btn-mobile').forEach(btn => {
      btn.textContent = "Hi, Admin";
    });
    const controls = document.getElementById('admin-export-controls');
    if (controls) {
      controls.style.display = 'flex';
    }
    return;
  }

  const db = JSON.parse(localStorage.getItem('orvera_client_logins')) || [];
  if (db.length > 0) {
    const lastUser = db[db.length - 1];
    document.querySelectorAll('#login-trigger-btn, .login-trigger-btn-mobile').forEach(btn => {
      btn.textContent = `Hi, ${lastUser.name.split(' ')[0]}`;
    });
  }
}

// ---- EXPORT DATABASE TO CSV (EXCEL) ----
const exportUsersBtn = document.getElementById('footer-export-users-btn');

function exportDatabaseToCSV() {
  const db = JSON.parse(localStorage.getItem('orvera_client_logins')) || [];
  
  if (db.length === 0) {
    db.push({
      name: "Demo Corporate Client",
      email: "corporate@example.com",
      company: "Grand Hyatt Mumbai",
      phone: "+91 98765 43210",
      timestamp: new Date().toISOString()
    });
  }

  const headers = ["Full Name", "Email Address", "Company Name", "Phone Number", "Login Timestamp"];
  const rows = db.map(user => [
    `"${user.name.replace(/"/g, '""')}"`,
    `"${user.email.replace(/"/g, '""')}"`,
    `"${user.company.replace(/"/g, '""')}"`,
    `"${user.phone.replace(/"/g, '""')}"`,
    `"${user.timestamp}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "orvera_client_database.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast("Excel/CSV Client Database exported successfully!");
}

exportUsersBtn?.addEventListener('click', exportDatabaseToCSV);

// ---- EXPORT REVIEWS DATABASE TO CSV (EXCEL) ----
const exportReviewsBtn = document.getElementById('footer-export-reviews-btn');

function exportReviewsToCSV() {
  const defaultReviews = [
    {
      name: "Robert H.",
      role: "Resort Director, EcoSands Group",
      rating: 5,
      title: "Excellent B2B Custom Engravings",
      text: "The birchwood forks and spoons we ordered for our resort look outstanding with our custom logo. Absolutely splinter-free and highly durable.",
      date: "June 10, 2026"
    },
    {
      name: "Laura M.",
      role: "Operations Head, GreenCrest Events",
      rating: 5,
      title: "Flawless Sustainable Transition",
      text: "Switching our catering line to ORVERA was seamless. Our clients love the natural aesthetic, and the composting speed is certified as promised.",
      date: "May 24, 2026"
    }
  ];

  const customReviews = JSON.parse(localStorage.getItem('orvera_custom_reviews')) || [];
  const allReviews = [...customReviews, ...defaultReviews];

  const headers = ["Author Name", "Company / Role", "Rating (Stars)", "Review Title", "Review Content", "Date Submitted"];
  const rows = allReviews.map(r => [
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.role.replace(/"/g, '""')}"`,
    `"${r.rating}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.text.replace(/"/g, '""')}"`,
    `"${r.date}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "orvera_reviews_database.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast("Excel/CSV Reviews Database exported successfully!");
}

exportReviewsBtn?.addEventListener('click', exportReviewsToCSV);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initVisualizerCanvas();
  updateEstimator();
  renderCartItems();
  syncLoggedInState();
  loadCustomReviews();
});

// Preloader Fade Out
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 400);
  }
});

// Fallback preloader removal
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 400);
  }
}, 3500);

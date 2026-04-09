/* ============================================================
   GOLAZO STICKERS — MAIN JAVASCRIPT
   Editable config at the top of the file.
   ============================================================ */

/* ---------- EDITABLE CONFIG ---------- */
const CONFIG = {
  // Número de WhatsApp (solo dígitos, sin +)
  whatsappNumber: '525587975494',

  // Nombre de marca
  brandName: 'Golazo Stickers',

  // Ciudad base
  city: 'Ciudad de México',

  // Mensaje por defecto de WhatsApp
  whatsappDefaultMsg: 'Hola, me interesa hacer un pedido de Golazo Stickers. ¿Pueden ayudarme?',

  // Precio en MXN (editar aquí para reflejar en toda la página)
  // — Álbum de estampas —
  prices: {
    albumSuave:      90,      // Álbum pasta suave
    albumDura:       330,     // Álbum pasta dura
    blister10:       240,     // Blister 10 sobres
    caja100:         2400,    // Caja 100 sobres
    bundleSuaveCaja: 2450,    // Álbum suave + caja 100 sobres
    bundleDuraCaja:  2700,    // Álbum dura + caja 100 sobres
  },

  // Stock status: 'available' | 'limited' | 'soldout'
  stock: {
    albumSuave:      'limited',   // Preventa
    albumDura:       'limited',   // Preventa
    blister10:       'limited',   // Preventa
    caja100:         'limited',   // Preventa
    bundleSuaveCaja: 'limited',
    bundleDuraCaja:  'limited',
  }
};

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initFAQ();
  initQtyControls();
  initForms();
  initWhatsAppButtons();
  initCounters();
  updatePricesFromConfig();
  updateStockFromConfig();
  initConfetti();
  initPapelPicado();
  initSparks();
});

/* ============================================================
   CONFETTI — lluvia festiva estilo México
   ============================================================ */
function initConfetti() {
  const container = document.querySelector('.confetti-container');
  if (!container) return;

  const colors = [
    '#006847', // verde México
    '#CE1126', // rojo México
    '#FFFFFF', // blanco
    '#E0A000', // dorado trofeo
    '#00A855', // verde claro
    '#F5C418', // dorado claro
    '#CC1A30', // rojo oscuro
    '#00D166', // verde brillante
  ];

  const shapes = ['rect', 'circle', 'strip'];
  const count  = 55;

  for (let i = 0; i < count; i++) {
    const el    = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size  = Math.random() * 10 + 5;     // 5–15px
    const left  = Math.random() * 100;          // %
    const dur   = Math.random() * 7  + 5;       // 5–12s
    const delay = Math.random() * 12;            // 0–12s delay
    const wiggle= Math.random() * 6 + 2;         // 2–8s wiggle

    el.classList.add('confetti-piece');
    el.style.left       = `${left}%`;
    el.style.width      = shape === 'strip' ? `${size * 0.35}px` : `${size}px`;
    el.style.height     = shape === 'strip' ? `${size * 3}px`    : `${size}px`;
    el.style.background = color;
    el.style.borderRadius = shape === 'circle' ? '50%' : shape === 'strip' ? '1px' : '2px';
    el.style.animationDuration      = `${dur}s, ${wiggle}s`;
    el.style.animationDelay         = `-${delay}s, -${Math.random() * wiggle}s`;
    el.style.animationName          = 'confettiFall, confettiWiggle';
    el.style.animationTimingFunction= 'linear, ease-in-out';
    el.style.animationIterationCount= 'infinite, infinite';

    container.appendChild(el);
  }
}

/* ============================================================
   NAVBAR — scroll + toggle
   ============================================================ */
function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks?.classList.toggle('open');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  });

  // Cierra menú al hacer click en un enlace
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cierra todos
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });

      // Abre el clicked (si no estaba abierto)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================
   QUANTITY CONTROLS
   ============================================================ */
function initQtyControls() {
  document.querySelectorAll('.qty-controls').forEach(ctrl => {
    const input  = ctrl.querySelector('.qty-input');
    const btnMin = ctrl.querySelector('[data-action="minus"]');
    const btnPlu = ctrl.querySelector('[data-action="plus"]');
    if (!input) return;

    btnMin?.addEventListener('click', () => {
      const min = parseInt(input.min) || 1;
      input.value = Math.max(min, parseInt(input.value) - 1);
      input.dispatchEvent(new Event('change'));
    });

    btnPlu?.addEventListener('click', () => {
      const max = parseInt(input.max) || 9999;
      input.value = Math.min(max, parseInt(input.value) + 1);
      input.dispatchEvent(new Event('change'));
    });
  });
}

/* ============================================================
   FORMS — validation + submission
   ============================================================ */
function initForms() {
  document.querySelectorAll('.order-form-el').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
  document.querySelectorAll('.cotiza-form-el').forEach(form => {
    form.addEventListener('submit', handleCotizaSubmit);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  const btn     = form.querySelector('[type="submit"]');
  const success = form.querySelector('.form-success');

  btn.disabled    = true;
  btn.textContent = 'Enviando…';

  // Simulación de envío (aquí conectarías tu backend o servicio)
  setTimeout(() => {
    btn.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.innerHTML = '✅ ¡Pedido recibido! Te contactaremos a la brevedad.';
    }
    form.reset();
    // Restaurar después de 5s
    setTimeout(() => {
      btn.style.display  = '';
      btn.disabled       = false;
      btn.textContent    = 'Enviar pedido';
      if (success) success.style.display = 'none';
    }, 5000);
  }, 1200);
}

function handleCotizaSubmit(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) return;

  const btn     = form.querySelector('[type="submit"]');
  const success = form.querySelector('.form-success');

  btn.disabled    = true;
  btn.textContent = 'Enviando…';

  setTimeout(() => {
    btn.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.innerHTML = '✅ ¡Solicitud recibida! Un asesor te contactará pronto.';
    }
    form.reset();
    setTimeout(() => {
      btn.style.display = '';
      btn.disabled      = false;
      btn.textContent   = 'Solicitar cotización';
      if (success) success.style.display = 'none';
    }, 5000);
  }, 1200);
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      field.style.borderColor = 'var(--coral)';
      valid = false;
      setTimeout(() => { field.style.borderColor = ''; }, 3000);
    }
  });
  return valid;
}

/* ============================================================
   WHATSAPP BUTTONS
   ============================================================ */
function initWhatsAppButtons() {
  document.querySelectorAll('[data-whatsapp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const customMsg = btn.dataset.whatsapp !== 'true'
        ? btn.dataset.whatsapp
        : buildWhatsAppMessageFromForm(btn.closest('form'));
      openWhatsApp(customMsg);
    });
  });

  // Botón flotante
  const floatBtn = document.querySelector('.whatsapp-float');
  floatBtn?.addEventListener('click', () => {
    openWhatsApp(CONFIG.whatsappDefaultMsg);
  });
}

function buildWhatsAppMessageFromForm(form) {
  if (!form) return CONFIG.whatsappDefaultMsg;

  const get  = (sel) => form.querySelector(sel)?.value?.trim() || '';
  const name = get('[name="nombre"]') || get('[name="name"]');
  const city = get('[name="ciudad"]') || get('[name="city"]');
  const tipo = get('[name="tipo_pedido"]') || get('[name="tipo"]');
  const qty  = get('[name="cantidad"]')    || get('[name="qty"]');
  const note = get('[name="comentarios"]') || get('[name="notas"]');

  let msg = `Hola, me interesa un pedido de *${CONFIG.brandName}*.\n\n`;
  if (name) msg += `📋 Nombre: ${name}\n`;
  if (city) msg += `📍 Ciudad: ${city}\n`;
  if (tipo) msg += `🛒 Pedido: ${tipo}\n`;
  if (qty)  msg += `🔢 Cantidad: ${qty}\n`;
  if (note) msg += `💬 Notas: ${note}\n`;
  msg += '\n¿Pueden ayudarme con disponibilidad y envío?';

  return msg;
}

function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.counter);
  const duration = 1800;
  const start    = performance.now();
  const suffix   = el.dataset.suffix || '';

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = Math.round(eased * target);
    el.textContent = value.toLocaleString('es-MX') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ============================================================
   UPDATE PRICES FROM CONFIG
   ============================================================ */
function updatePricesFromConfig() {
  const map = {
    '[data-price="albumSuave"]':      CONFIG.prices.albumSuave,
    '[data-price="albumDura"]':       CONFIG.prices.albumDura,
    '[data-price="blister10"]':       CONFIG.prices.blister10,
    '[data-price="caja100"]':         CONFIG.prices.caja100,
    '[data-price="bundleSuaveCaja"]': CONFIG.prices.bundleSuaveCaja,
    '[data-price="bundleDuraCaja"]':  CONFIG.prices.bundleDuraCaja,
  };

  Object.entries(map).forEach(([selector, price]) => {
    document.querySelectorAll(selector).forEach(el => {
      if (typeof price === 'number') {
        el.textContent = '$' + price.toLocaleString('es-MX');
      } else {
        el.textContent = price;
      }
    });
  });
}

/* ============================================================
   UPDATE STOCK INDICATORS FROM CONFIG
   ============================================================ */
function updateStockFromConfig() {
  const labels = {
    available: { cls: 'green',  text: 'Disponible' },
    limited:   { cls: 'yellow', text: 'Stock limitado' },
    soldout:   { cls: 'red',    text: 'Agotado' },
  };

  Object.entries(CONFIG.stock).forEach(([product, status]) => {
    const info = labels[status] || labels.available;
    document.querySelectorAll(`[data-stock="${product}"]`).forEach(el => {
      const dot  = el.querySelector('.stock-dot');
      const text = el.querySelector('.stock-text');
      if (dot)  { dot.className  = `stock-dot ${info.cls}`;  }
      if (text) { text.className = `stock-text ${info.cls}`; text.textContent = info.text; }
    });
  });
}

/* ============================================================
   SMOOTH SCROLL para anclas internas
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // evita SyntaxError con querySelector('#')
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   HELPER: crear mensaje WhatsApp con producto específico
   ============================================================ */
function orderProduct(productName, qty, price) {
  const msg = `Hola, quiero pedir:\n\n🛒 *${productName}*\n🔢 Cantidad: ${qty}\n💰 Precio referencia: ${price}\n\n¿Hay disponibilidad?`;
  openWhatsApp(msg);
}

/* ============================================================
   PAPEL PICADO — Banderines festivos tricolor
   ============================================================ */
function initPapelPicado() {
  const wraps = document.querySelectorAll('.papel-picado-wrap');
  if (!wraps.length) return;

  const colors = [
    '#006847','#008A55','#004D2A',  // verdes
    '#FFFFFF','#F0F0F0',             // blancos
    '#CC1A30','#E83348','#A01122',  // rojos
    '#E0A000','#F5C418',             // dorados
  ];

  wraps.forEach(wrap => {
    // string line
    const str = document.createElement('div');
    str.className = 'papel-string';
    wrap.appendChild(str);

    const wrapWidth = window.innerWidth * 1.1;
    const pieceW   = 38;
    const gap      = 4;
    const count    = Math.ceil(wrapWidth / (pieceW + gap)) + 2;

    for (let i = 0; i < count; i++) {
      const el    = document.createElement('div');
      el.className = 'papel-piece';
      const color  = colors[i % colors.length];
      const delay  = (i * 0.18) % 3;
      const dur    = 2.4 + (i % 5) * 0.4;

      el.style.left = `${i * (pieceW + gap) - pieceW}px`;
      el.style.background = color;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay    = `-${delay}s`;
      wrap.appendChild(el);
    }
  });
}

/* ============================================================
   HERO SPARKS — Destellos de luz
   ============================================================ */
function initSparks() {
  const hero = document.querySelector('.hero, .page-header');
  if (!hero) return;

  const sparkColors = ['rgba(0,200,100,0.6)','rgba(255,255,255,0.5)','rgba(224,160,0,0.6)','rgba(204,26,48,0.5)'];
  for (let i = 0; i < 18; i++) {
    const el  = document.createElement('div');
    el.className = 'hero-spark';
    const size = Math.random() * 6 + 2;
    el.style.cssText = `
      left: ${Math.random()*100}%;
      top:  ${Math.random()*100}%;
      width:  ${size}px;
      height: ${size}px;
      background: ${sparkColors[i % sparkColors.length]};
      animation-duration: ${1.5 + Math.random()*2.5}s;
      animation-delay: ${Math.random()*3}s;
      filter: blur(1px);
    `;
    hero.appendChild(el);
  }
}

// Exponemos para uso en HTML inline
window.orderProduct = orderProduct;
window.openWhatsApp = openWhatsApp;
window.CONFIG       = CONFIG;

/* =============================================
   ELEGANT PRINTS — script.js
============================================= */

// ---- STICKY NAV ----
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ---- GALLERY FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (f === 'all' || item.dataset.cat === f) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Link category strip to gallery filter
document.querySelectorAll('.cat-item').forEach(cat => {
  cat.addEventListener('click', e => {
    e.preventDefault();
    const filter = cat.dataset.filter;
    document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const matchBtn = [...filterBtns].find(b => b.dataset.filter === filter);
      if (matchBtn) matchBtn.click();
    }, 600);
  });
});

// ---- LIGHTBOX ----
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-cap');
let currentImgs = [];
let currentIdx = 0;

function buildVisibleImgs() {
  currentImgs = [...galleryItems]
    .filter(i => !i.classList.contains('hidden'))
    .map(i => ({
      src: i.querySelector('img').src,
      alt: i.querySelector('img').alt,
      cap: i.querySelector('.gallery-overlay span')?.textContent || ''
    }));
}

function openLightbox(idx) {
  currentIdx = idx;
  lbImg.src = currentImgs[idx].src;
  lbImg.alt = currentImgs[idx].alt;
  lbCap.textContent = currentImgs[idx].cap;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    buildVisibleImgs();
    const visibleIdx = currentImgs.findIndex(c => c.src === item.querySelector('img').src);
    openLightbox(visibleIdx >= 0 ? visibleIdx : 0);
  });
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.getElementById('lightbox-prev').addEventListener('click', () => {
  currentIdx = (currentIdx - 1 + currentImgs.length) % currentImgs.length;
  openLightbox(currentIdx);
});
document.getElementById('lightbox-next').addEventListener('click', () => {
  currentIdx = (currentIdx + 1) % currentImgs.length;
  openLightbox(currentIdx);
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
  if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
});

// ---- TESTIMONIAL CAROUSEL ----
const testiCards = document.querySelectorAll('.testi-card');
const dots = document.querySelectorAll('.dot');
let testiIdx = 0;
let testiTimer;

function showTesti(i) {
  testiCards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  testiCards[i].classList.add('active');
  dots[i].classList.add('active');
  testiIdx = i;
}

function nextTesti() {
  showTesti((testiIdx + 1) % testiCards.length);
}

function startAutoplay() {
  testiTimer = setInterval(nextTesti, 4500);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(testiTimer);
    showTesti(parseInt(dot.dataset.i));
    startAutoplay();
  });
});

startAutoplay();

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = contactForm.querySelector('#name').value.trim();
  const phone = contactForm.querySelector('#phone').value.trim();
  const service = contactForm.querySelector('#service').value;

  if (!name || !phone || !service) {
    alert('Please fill in your name, phone number, and service needed.');
    return;
  }

  // Simulate submission (replace with real backend/Formspree/EmailJS)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    formSuccess.style.display = 'block';
    contactForm.reset();
    btn.textContent = 'Send Enquiry';
    btn.disabled = false;
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  }, 1200);
});

// ---- BACK TO TOP ----
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SCROLL REVEAL ANIMATIONS ----
const revealEls = document.querySelectorAll(
  '.product-card, .service-card, .why-card, .gallery-item, ' +
  '.about-inner, .contact-inner, .testi-card, .stat, .cat-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- STAGGER REVEAL FOR GRIDS ----
function staggerReveal(selector) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.06}s`;
  });
}
staggerReveal('.product-card');
staggerReveal('.service-card');
staggerReveal('.gallery-item');
staggerReveal('.why-card');

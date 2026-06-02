/* ============================================================
   SUMMIT DIAGNOSTIX — scripts.js
   ============================================================ */

'use strict';

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
    scrollTopBtn?.classList.add('visible');
  } else {
    navbar?.classList.remove('scrolled');
    scrollTopBtn?.classList.remove('visible');
  }
});

// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close nav when a link is clicked
navMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
  });
});

// ---- Active nav link ----
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNav();

// ---- Scroll to top ----
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Scroll Animations (IntersectionObserver) ----
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade-up');
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
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}
initScrollAnimations();

// ---- Counter Animation ----
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const startVal = 0;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * (target - startVal) + startVal).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter'));
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}
initCounters();

// ---- Contact / Order Forms ----
function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const successEl = document.getElementById(form.getAttribute('data-form') + '-success');

      // Button loading state
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      // Simulate async submit
      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.getAttribute('data-label') || 'Submit';
        }
        if (successEl) {
          successEl.classList.add('show');
          setTimeout(() => successEl.classList.remove('show'), 6000);
        }
      }, 1200);
    });
  });
}
initForms();

// ---- Newsletter Form ----
function initNewsletter() {
  const form = document.querySelector('.newsletter-form[data-form="newsletter"]');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    if (btn) { btn.disabled = true; btn.textContent = 'Subscribed! ✓'; }
    if (input) input.value = '';
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    }, 4000);
  });
}
initNewsletter();

// ---- Inquiry category selector (contact page) ----
function initInquirySelector() {
  const items = document.querySelectorAll('.inquiry-item');
  const hiddenInput = document.getElementById('inquiry-category');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      if (hiddenInput) hiddenInput.value = item.getAttribute('data-category');
      const subjectField = document.getElementById('contact-subject');
      if (subjectField) subjectField.value = item.getAttribute('data-category');
    });
  });
}
initInquirySelector();

// ---- Hero subtle parallax on mouse move ----
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const orbs = hero.querySelectorAll('.hero-bg-orb');
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX / width  - 0.5) * 20;
    const yPct = (clientY / height - 0.5) * 20;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${xPct * factor}px, ${yPct * factor}px)`;
    });
  });
}
initParallax();

// ---- Product tab filter (products page) ----
function initProductTabs() {
  const tabs = document.querySelectorAll('[data-tab-btn]');
  const panels = document.querySelectorAll('[data-tab-panel]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab-btn');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('anim-fade-up', 'visible');
      });

      tab.classList.add('active');
      const panel = document.querySelector(`[data-tab-panel="${target}"]`);
      if (panel) {
        panel.style.display = 'block';
        requestAnimationFrame(() => {
          panel.classList.add('anim-fade-up');
          requestAnimationFrame(() => panel.classList.add('visible'));
        });
      }
    });
  });
}
initProductTabs();

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length <= 1) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
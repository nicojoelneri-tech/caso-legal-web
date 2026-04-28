/* ============================================
   CASO LEGAL — MAIN SCRIPT
   ============================================ */

'use strict';

// ——— NAVBAR: scroll & mobile menu ———
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  // Scroll state
  let lastScrollY = 0;
  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });
})();


// ——— FADE IN ON SCROLL ———
(function () {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();


// ——— FAQ ACCORDION ———
(function () {
  const items = document.querySelectorAll('[data-faq]');

  items.forEach(function (item) {
    const btn = item.querySelector('.faq-item__question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      // Close all
      items.forEach(function (other) {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-item__question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


// ——— SMOOTH SCROLL FOR ANCHOR LINKS ———
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


// ——— ACTIVE NAV LINK ON SCROLL ———
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            link.style.color = href === '#' + id ? 'var(--color-yellow)' : '';
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();


// ——— CONVERSION TRACKING ———
(function () {
  if (typeof gtag !== 'function') return;

  // Clicks en el filtro de precalificación
  document.querySelectorAll('a[href*="consulta.casolegal.com.ar"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gtag('event', 'generate_lead', {
        event_category: 'conversion',
        event_label: 'filtro_precalificacion'
      });
    });
  });

  // Clicks en WhatsApp
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    el.addEventListener('click', function () {
      gtag('event', 'contact', {
        event_category: 'conversion',
        event_label: 'whatsapp'
      });
    });
  });
})();

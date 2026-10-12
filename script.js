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


// ——— VIDEO DIFERIDO (respeta ahorro de datos y reduced motion) ———
// Arranca apenas el DOM está listo (no espera a window "load", que
// demoraba el inicio hasta que TODA la página —imágenes, fuentes,
// etc.— terminara de cargar; eso hacía que el video de fondo del
// hero recién empezara a bajar cuando el usuario ya lo estaba
// mirando, y se notara el "tirón" del arranque en frío). El fundido
// con la clase is-playing evita que el primer frame aparezca de golpe.
(function () {
  var videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduced || saveData) return;

  function start(video) {
    if (video.dataset.started) return;
    video.dataset.started = '1';
    video.addEventListener('playing', function onPlaying() {
      video.classList.add('is-playing');
      video.removeEventListener('playing', onPlaying);
    });
    var source = document.createElement('source');
    source.src = video.getAttribute('data-src');
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { start(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px' });
    videos.forEach(function (v) { io.observe(v); });
  } else {
    videos.forEach(start);
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
  // Las páginas de Caso Legal Group (home y /empresas) llevan este atributo
  // y usan eventos propios (ver group.js) para no contaminar las conversiones de /personas.
  if (document.body.hasAttribute('data-no-conversion-tracking')) return;

  // Nota: se sacó el tracking de "generate_lead" (filtro de precalificación /
  // consulta.casolegal.com.ar) porque esa conexión se retiró del sitio — el
  // contacto ahora va directo a WhatsApp. Si en Google Ads hay una acción de
  // conversión "generate_lead" apuntando a este evento, dejará de recibir datos.

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

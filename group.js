/* ============================================
   CASO LEGAL GROUP — SCRIPT (home + empresas)
   Se carga junto con /script.js (navbar, fade-in, FAQ, scroll,
   video diferido). Acá viven: autodiagnóstico y eventos propios.
   Los eventos de conversión de Google Ads de /personas NO se
   disparan acá (ver data-no-conversion-tracking en <body>).
   ============================================ */

'use strict';

var WA_NUMBER = '5491130027028';

function waLink(message) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
}

function track(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params || {});
}

// ——— VIDEO DIFERIDO ———
// Se movió a /script.js (compartido por las 3 páginas) para que
// /personas también pueda usar video de fondo en el hero sin cargar
// este archivo (que trae el tracking propio de Caso Legal Group).

// ——— AUTODIAGNÓSTICO (empresas) ———
(function () {
  var wrap = document.getElementById('autodiagnostico');
  if (!wrap) return;

  var boxes = wrap.querySelectorAll('input[type="checkbox"][data-area]');
  var summary = document.getElementById('checkSummary');
  var text = document.getElementById('checkSummaryText');
  var cta = document.getElementById('checkCta');
  if (!summary || !text || !cta) return;

  var DEFAULT_MSG = 'Hola, quiero consultar por la Membresía de acompañamiento legal de Caso Legal Group para mi negocio.';
  var DEFAULT_TEXT = 'Marcá lo que te genere dudas y armamos juntos por dónde empezar. Si preferís, escribinos directo y nos contás cómo está tu negocio.';

  function render() {
    var areas = [];
    boxes.forEach(function (b) { if (b.checked) areas.push(b.getAttribute('data-area')); });

    if (!areas.length) {
      summary.classList.remove('has-marks');
      text.textContent = DEFAULT_TEXT;
      cta.textContent = 'Escribinos';
      cta.href = waLink(DEFAULT_MSG);
      return;
    }

    summary.classList.add('has-marks');
    text.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = areas.length === 1
      ? 'Marcaste 1 punto para revisar. '
      : 'Marcaste ' + areas.length + ' puntos para revisar. ';
    text.appendChild(strong);
    text.appendChild(document.createTextNode(
      'No es que estés haciendo algo mal: es que todavía no lo formalizaste. Y eso se resuelve.'
    ));
    cta.textContent = 'Contanos estos puntos';
    cta.href = waLink(
      'Hola, hice el autodiagnóstico de Caso Legal Group y me quedaron dudas en: ' +
      areas.join('; ') + '. Quiero consultar por la membresía de acompañamiento legal.'
    );
  }

  boxes.forEach(function (b) {
    b.addEventListener('change', function () {
      render();
      if (b.checked) track('autodiagnostico_empresas', { event_category: 'engagement', event_label: b.getAttribute('data-area') });
    });
  });
  render();
})();

// ——— EVENTOS PROPIOS DE CASO LEGAL GROUP ———
// Nombres distintos a los de /personas para no contaminar las
// conversiones de Google Ads (generate_lead / contact).
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;

    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) {
      track('contact_empresas', { event_category: 'conversion_empresas', event_label: a.getAttribute('data-label') || 'whatsapp' });
    } else if (a.hasAttribute('data-audience')) {
      track('select_audience', { event_category: 'navigation', event_label: a.getAttribute('data-audience') });
    }
  });
})();

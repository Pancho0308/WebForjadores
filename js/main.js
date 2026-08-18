window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar-principal');
  if (navbar) { 
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let slideActual = 0;
let intervalo;

if (slides.length > 0 && dots.length > 0) {

  function irASlide(indice) {

    slides[slideActual].classList.remove('activo');
    dots[slideActual].classList.remove('activo');


    slideActual = indice;


    if (slideActual >= slides.length) slideActual = 0;
    if (slideActual < 0) slideActual = slides.length - 1;


    slides[slideActual].classList.add('activo');
    dots[slideActual].classList.add('activo');
  }

  function siguienteSlide() {
    irASlide(slideActual + 1);
  }

  function iniciarIntervalo() {
    intervalo = setInterval(siguienteSlide, 5000);
  }

  dots.forEach(function(dot, indice) {
    dot.addEventListener('click', function() {
      clearInterval(intervalo);
      irASlide(indice);
      iniciarIntervalo();
    });
  });

  iniciarIntervalo();
}

// ── ESTRELLAS FORJAVERSARIOS ──
const starCanvas = document.getElementById('starCanvas');

if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let W, H, stars = [];
  const mouse = { x: -999, y: -999 };
  const N = 350, ATTRACT = 160;

function resizeCanvas() {
  const hero = document.getElementById('fv-hero');
  const lore = document.getElementById('fv-lore');

  W = starCanvas.width = starCanvas.offsetWidth;

  // La altura del canvas = hero + lore juntos
  if (hero && lore) {
    H = starCanvas.height = hero.offsetHeight + lore.offsetHeight;
  } else {
    H = starCanvas.height = starCanvas.offsetHeight;
  }
}

  function makeStar() {
    return {
      x:       Math.random() * (W || 680),
      y:       Math.random() * (H || 520),
      ox: 0, oy: 0,
      r:       Math.random() * 1.6 + 0.3,
      speed:   (Math.random() * 0.3 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
      twinkle: Math.random() * Math.PI * 2
    };
  }

  function initStars() {
    resizeCanvas();
    stars = Array.from({ length: N }, makeStar);
  }

  document.addEventListener('mousemove', function(e) {
  const rect = starCanvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

document.addEventListener('mouseleave', function() {
  mouse.x = -999;
  mouse.y = -999;
});

  function drawStars() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(function(s) {
      s.twinkle += 0.02;
      const alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(s.twinkle));

      const dx   = mouse.x - s.x;
      const dy   = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = s.x, ty = s.y;
      if (dist < ATTRACT && dist > 0) {
        const force = (1 - dist / ATTRACT) * 35;
        tx = s.x + (dx / dist) * force;
        ty = s.y + (dy / dist) * force;
      }

      s.ox += (tx - s.x - s.ox) * 0.12;
      s.oy += (ty - s.y - s.oy) * 0.12;

      const rx = s.x + s.ox;
      const ry = s.y + s.oy;

      const glow = dist < ATTRACT ? (1 - dist / ATTRACT) : 0;
      const radius = s.r + glow * 2.5;
      const color  = glow > 0.1
        ? `rgba(${Math.round(142 + glow * 60)},${Math.round(207 + glow * 30)},238,${Math.min(alpha + glow * 0.4, 1)})`
        : `rgba(200,225,255,${alpha})`;

      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (dist < ATTRACT * 0.6) {
        stars.forEach(function(s2) {
          const dx2 = s2.x - s.x;
          const dy2 = s2.y - s.y;
          const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < 120 && d2 > 0) {
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(s2.x + s2.ox, s2.y + s2.oy);
            ctx.strokeStyle = `rgba(142,207,238,${0.15 * (1 - d2 / 80) * glow})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }

      s.y -= s.speed * 0.25;
      if (s.y < -5) s.y = H + 5;
      if (s.y > H + 5) s.y = -5;
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', initStars);
  initStars();
  requestAnimationFrame(drawStars);
}

// ── TABS DE REDES SOCIALES ──
const embedTabs = document.querySelectorAll('.embed-tab');

if (embedTabs.length > 0) {
  embedTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {

      // Quita activo de todas las pestañas y paneles
      embedTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.embed-panel').forEach(p => p.classList.remove('activo'));

      // Activa la pestaña clickeada
      tab.classList.add('active');

      // Activa el panel correspondiente
      const red = tab.getAttribute('data-red');
      document.getElementById('panel-' + red).classList.add('activo');
    });
  });
}

  let fotos = [];
  let indiceActual = 0;

  function mostrarFoto(indice) {
  if (fotos.length === 0) return;
  if (indice < 0) indice = fotos.length - 1;
  if (indice >= fotos.length) indice = 0;
  indiceActual = indice;
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxPie = document.querySelector('.lightbox-pie');
  if (lightboxImg) lightboxImg.src = fotos[indiceActual].src;
  if (lightboxPie) lightboxPie.textContent = fotos[indiceActual].pie;
}

// ── LIGHTBOX ──
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImg  = lightbox.querySelector('.lightbox-img');
  const lightboxPie  = lightbox.querySelector('.lightbox-pie');
  const btnCerrar    = lightbox.querySelector('.lightbox-cerrar');
  const btnAnterior  = lightbox.querySelector('.lightbox-anterior');
  const btnSiguiente = lightbox.querySelector('.lightbox-siguiente');



  // Recopila todas las fotos de la galería
  function recopilarFotos() {
    fotos = [];
    document.querySelectorAll('.galeria-foto[data-foto]').forEach(function(el) {
      fotos.push({
        src: el.getAttribute('data-foto'),
        pie: el.getAttribute('data-pie') || ''
      });
    });
  }


  // Abre el lightbox al hacer click en una foto
  document.querySelectorAll('.galeria-foto[data-foto]').forEach(function(el, i) {
    el.addEventListener('click', function() {
      recopilarFotos();
      mostrarFoto(i);
      lightbox.classList.add('activo');
      document.body.style.overflow = 'hidden'; // evita scroll de fondo
    });
  });

  // Cierra con el botón X
  btnCerrar.addEventListener('click', function() {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
  });

  // Cierra al hacer click en el overlay
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', function() {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
  });

  // Navega entre fotos
  btnAnterior.addEventListener('click', function() {
    mostrarFoto(indiceActual - 1);
  });

  btnSiguiente.addEventListener('click', function() {
    mostrarFoto(indiceActual + 1);
  });

  // Navega con las flechas del teclado
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('activo')) return;
    if (e.key === 'ArrowRight') mostrarFoto(indiceActual + 1);
    if (e.key === 'ArrowLeft')  mostrarFoto(indiceActual - 1);
    if (e.key === 'Escape') {
      lightbox.classList.remove('activo');
      document.body.style.overflow = '';
    }
  });
}

// ── WIDGET DE X ──
function cargarTwitterWidget() {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load(
      document.getElementById('panel-twitter')
    );
  }
}

// Espera que el script de X esté listo
window.twttr = window.twttr || { _e: [], ready: function(f) { this._e.push(f); }};
window.twttr.ready(function(twttr) {
  cargarTwitterWidget();
});

// También recarga cuando se hace click en la pestaña
const tabTwitter = document.querySelector('[data-red="twitter"]');
if (tabTwitter) {
  tabTwitter.addEventListener('click', function() {
    setTimeout(cargarTwitterWidget, 100);
  });
}

// ── SISTEMA DE IDIOMA ──
const traducciones = {
  es: {
    // NAVBAR
    'nav-inicio':          'Inicio',
    'nav-nosotros':        'Nosotros',
    'nav-eventos':         'Eventos',
    'nav-forjaversarios':  'Forjaversarios',
    'nav-redes':           'Redes',
    'nav-colaboraciones':  'Colaboraciones',
    'nav-donar':           'Donar ♡',

    // INDEX — HERO
    'hero-badge':    'COMUNIDAD · VRCHAT · HISPANOHABLANTE',
    'hero-titulo':   'Forjadores<br><span class="hero-titulo-celeste">Hispanos</span>',
    'hero-tagline':  'Aprende, conecta y descubre talento hispanohablante dentro de VRChat.',
    'hero-btn1':     'Conoce la comunidad',
    'hero-btn2':     'Nuestras redes',

    // INDEX — QUIÉNES SOMOS
    'qs-label':   'QUIÉNES SOMOS',
    'qs-titulo':  'Un lugar para aprender, crecer y conocer gente',
    'qs-texto':   'Somos una comunidad hispanohablante en VRChat donde puedes aprender sobre arte 2D, modelado 3D y desarrollo, conocer personas talentosas y colaborar en proyectos reales — todo en español.',
    'qs-p1':      'Aprende con otros',
    'qs-p1-sub':  'Talleres semanales de arte y desarrollo',
    'qs-p2':      'Conoce gente nueva',
    'qs-p2-sub':  'Comunidad activa y abierta a todos',
    'qs-p3':      'Encuentra talento',
    'qs-p3-sub':  'Modeladores, artistas y creadores de VR',

    // INDEX — GALERÍA
    'galeria-label':  'GALERÍA',
    'galeria-titulo': 'Momentos de la comunidad',
    'galeria-ver':    'Ver todas las fotos →',

    // INDEX — EVENTOS
    'eventos-label':  'AGENDA',
    'eventos-titulo': 'Eventos semanales',
    'eventos-ver':    'Ver todos →',

    // INDEX — EQUIPO
    'equipo-label':  'PERSONAS',
    'equipo-titulo': 'Equipo de administración',

    // FOOTER
    'footer-desc':    'Comunidad hispanohablante en VRChat dedicada al aprendizaje, el arte digital y la colaboración.',
    'footer-nav':     'Navegación',
    'footer-com':     'Comunidad',
    'footer-sig':     'Síguenos',
    'footer-copy1':   '© 2026 Forjadores Hispanos VR · Creado por Noch',
    'footer-copy2':   'Actualizado por HorchataDuck · Pancho0308 · Umbra',
  },

  en: {
    // NAVBAR
    'nav-inicio':          'Home',
    'nav-nosotros':        'About Us',
    'nav-eventos':         'Events',
    'nav-forjaversarios':  'Forjaversarios',
    'nav-redes':           'Social Media',
    'nav-colaboraciones':  'Collaborations',
    'nav-donar':           'Donate ♡',

    // INDEX — HERO
    'hero-badge':    'COMMUNITY · VRCHAT · SPANISH-SPEAKING',
    'hero-titulo':   'Forjadores<br><span class="hero-titulo-celeste">Hispanos</span>',
    'hero-tagline':  'Learn, connect and discover Spanish-speaking talent inside VRChat.',
    'hero-btn1':     'Meet the community',
    'hero-btn2':     'Our social media',

    // INDEX — QUIÉNES SOMOS
    'qs-label':   'WHO WE ARE',
    'qs-titulo':  'A place to learn, grow and meet people',
    'qs-texto':   'We are a Spanish-speaking community in VRChat where you can learn about 2D art, 3D modeling and development, meet talented people and collaborate on real projects — all in Spanish.',
    'qs-p1':      'Learn together',
    'qs-p1-sub':  'Weekly art and development workshops',
    'qs-p2':      'Meet new people',
    'qs-p2-sub':  'Active community open to everyone',
    'qs-p3':      'Find talent',
    'qs-p3-sub':  'Modelers, artists and VR creators',

    // INDEX — GALERÍA
    'galeria-label':  'GALLERY',
    'galeria-titulo': 'Community moments',
    'galeria-ver':    'View all photos →',

    // INDEX — EVENTOS
    'eventos-label':  'SCHEDULE',
    'eventos-titulo': 'Weekly events',
    'eventos-ver':    'View all →',

    // INDEX — EQUIPO
    'equipo-label':  'PEOPLE',
    'equipo-titulo': 'Administration team',

    // FOOTER
    'footer-desc':    'Spanish-speaking community in VRChat dedicated to learning, digital art and collaboration.',
    'footer-nav':     'Navigation',
    'footer-com':     'Community',
    'footer-sig':     'Follow us',
    'footer-copy1':   '© 2026 Forjadores Hispanos VR · Created by Noch',
    'footer-copy2':   'Updated by HorchataDuck · Pancho0308 · Umbra',

    // EVENTOS — contenido real
    'evento1-tag':    'Event 1',
    'evento1-titulo': 'Event 1',
    'evento1-desc':   'Lorem ipsum event description in English.',
    'evento1-fecha':  '🗓 Every Saturday',

    'evento2-tag':    'Event 2',
    'evento2-titulo': 'Event 2',
    'evento2-desc':   'Lorem ipsum event description in English.',
    'evento2-fecha':  '🗓 Sundays in the afternoon',
  }
};

let idiomaActual = localStorage.getItem('idioma') || 'es';

function aplicarIdioma(idioma) {
  const t = traducciones[idioma];
  if (!t) return;

  // Actualiza todos los elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const clave = el.getAttribute('data-i18n');
    if (t[clave]) {
      el.innerHTML = t[clave];
    }
  });

  // Actualiza el botón
  const btn = document.getElementById('btn-idioma');
  if (btn) btn.textContent = idioma === 'es' ? '🌐 EN' : '🌐 ES';

  // Activa Google Translate para el resto
  if (idioma === 'en') {
    activarGoogleTranslate();
  } else {
    desactivarGoogleTranslate();
  }

  // Guarda preferencia
  localStorage.setItem('idioma', idioma);
  idiomaActual = idioma;
}

function cambiarIdioma() {
  const nuevoIdioma = idiomaActual === 'es' ? 'en' : 'es';
  aplicarIdioma(nuevoIdioma);
}

function activarGoogleTranslate() {
  // Agrega el widget de Google Translate oculto si no existe
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=iniciarGoogleTranslate';
    document.body.appendChild(script);
  } else if (window.google && window.google.translate) {
    window.google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'en',
      autoDisplay: false
    }, 'google-translate-container');
  }
}

function desactivarGoogleTranslate() {
  // Restaura el idioma original removiendo las cookies de translate
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
  location.reload();
}

// Función callback de Google Translate
window.iniciarGoogleTranslate = function() {
  new window.google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en',
    autoDisplay: true
  }, 'google-translate-container');
};

// Aplica el idioma guardado al cargar
document.addEventListener('DOMContentLoaded', function() {
  if (idiomaActual === 'en') {
    aplicarIdioma('en');
  }
});

// ── FILTRO DE GALERÍA ──
const galeriaTabs = document.querySelectorAll('.galeria-tab');

if (galeriaTabs.length > 0) {
  galeriaTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {

      // Activa la pestaña
      galeriaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const categoria = tab.getAttribute('data-categoria');
      const items = document.querySelectorAll('.galeria-item');
      let visibles = 0;

      items.forEach(function(item) {
        if (categoria === 'todas' || item.getAttribute('data-categoria') === categoria) {
          item.classList.remove('oculto');
          visibles++;
        } else {
          item.classList.add('oculto');
        }
      });

      // Actualiza el contador
      const count = document.getElementById('galeria-count');
      if (count) {
        count.textContent = categoria === 'todas'
          ? 'Mostrando todas las fotos'
          : 'Mostrando ' + visibles + ' foto' + (visibles !== 1 ? 's' : '');
      }
    });
  });
}

// ── LIGHTBOX GALERÍA ──
const galeriaItems = document.querySelectorAll('.galeria-item[data-foto]');

if (galeriaItems.length > 0 && lightbox) {
  galeriaItems.forEach(function(el, i) {
    el.addEventListener('click', function() {

      // Recopila solo las fotos visibles en ese momento
      const fotosVisibles = [];
      document.querySelectorAll('.galeria-item[data-foto]:not(.oculto)').forEach(function(f) {
        fotosVisibles.push({
          src: f.getAttribute('data-foto'),
          pie: f.getAttribute('data-pie') || ''
        });
      });

      // Encuentra el índice de la foto clickeada dentro de las visibles
      const fotoClickeada = el.getAttribute('data-foto');
      const indice = fotosVisibles.findIndex(f => f.src === fotoClickeada);

      // Abre el lightbox
      fotos = fotosVisibles;
      mostrarFoto(indice >= 0 ? indice : 0);
      lightbox.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });
}
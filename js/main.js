window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar-principal");
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// ── TEMA OSCURO ──
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("tema", tema);
  const btn = document.getElementById("btn-tema");
  if (btn) btn.textContent = tema === "dark" ? "☀️" : "🌙";
}
// oxlint-disable-next-line no-unused-vars
function toggleTema() {
  const actual =
    document.documentElement.getAttribute("data-theme") ||
    localStorage.getItem("tema") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  aplicarTema(actual === "dark" ? "light" : "dark");
}
(function initTema() {
  const guardado = localStorage.getItem("tema");
  const tema =
    guardado ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  aplicarTema(tema);
})();

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-dot");
let slideActual = 0;
let intervalo;

if (slides.length > 0 && dots.length > 0) {
  function irASlide(indice) {
    slides[slideActual].classList.remove("activo");
    dots[slideActual].classList.remove("activo");

    slideActual = indice;

    if (slideActual >= slides.length) slideActual = 0;
    if (slideActual < 0) slideActual = slides.length - 1;

    slides[slideActual].classList.add("activo");
    dots[slideActual].classList.add("activo");
  }

  function siguienteSlide() {
    irASlide(slideActual + 1);
  }

  function iniciarIntervalo() {
    intervalo = setInterval(siguienteSlide, 5000);
  }

  dots.forEach((dot, indice) => {
    dot.addEventListener("click", () => {
      clearInterval(intervalo);
      irASlide(indice);
      iniciarIntervalo();
    });
  });

  iniciarIntervalo();
}

// ── ESTRELLAS FORJAVERSARIOS ──
const starCanvas = document.getElementById("starCanvas");

if (starCanvas) {
  const ctx = starCanvas.getContext("2d");
  let W,
    H,
    stars = [];
  const mouse = { x: -999, y: -999 };
  const N = 1000,
    ATTRACT = 160;

  function resizeCanvas() {
    const hero = document.getElementById("fv-hero");
    const lore = document.getElementById("fv-lore");
    const error404 = document.getElementById("error-404");

    if (error404) {
      // En la 404 el canvas es fixed — debe coincidir exactamente con la ventana
      W = starCanvas.width = window.innerWidth;
      H = starCanvas.height = window.innerHeight;
    } else if (hero && lore) {
      W = starCanvas.width = starCanvas.offsetWidth;
      H = starCanvas.height = hero.offsetHeight + lore.offsetHeight;
    } else {
      W = starCanvas.width = starCanvas.offsetWidth;
      H = starCanvas.height = starCanvas.offsetHeight;
    }
  }

  function makeStar() {
    return {
      x: Math.random() * (W || 680),
      y: Math.random() * (H || 520),
      ox: 0,
      oy: 0,
      r: Math.random() * 1.6 + 0.3,
      speed: (Math.random() * 0.3 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  function initStars() {
    resizeCanvas();
    stars = Array.from({ length: N }, makeStar);
  }

  document.addEventListener("mousemove", (e) => {
    if (document.body.classList.contains("pagina-404")) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    } else {
      const rect = starCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
  });

  window.addEventListener("resize", () => {
    initStars();
  });

  document.addEventListener("mouseleave", () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  let rafId;
  function drawStars() {
    if (document.hidden) {
      rafId = requestAnimationFrame(drawStars);
      return;
    }
    ctx.clearRect(0, 0, W, H);

    stars.forEach((s) => {
      s.twinkle += 0.02;
      const alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(s.twinkle));

      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = s.x,
        ty = s.y;
      if (dist < ATTRACT && dist > 0) {
        const force = (1 - dist / ATTRACT) * 35;
        tx = s.x + (dx / dist) * force;
        ty = s.y + (dy / dist) * force;
      }

      s.ox += (tx - s.x - s.ox) * 0.12;
      s.oy += (ty - s.y - s.oy) * 0.12;

      const rx = s.x + s.ox;
      const ry = s.y + s.oy;

      const glow = dist < ATTRACT ? 1 - dist / ATTRACT : 0;
      const radius = s.r + glow * 2.5;
      const color =
        glow > 0.1
          ? `rgba(${Math.round(142 + glow * 60)},${Math.round(207 + glow * 30)},238,${Math.min(alpha + glow * 0.4, 1)})`
          : `rgba(200,225,255,${alpha})`;

      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // líneas entre estrellas: solo cerca del cursor y muestreado (cada 3ª) para evitar O(n²) completo
      if (glow > 0.3) {
        for (let k = 0; k < stars.length; k += 3) {
          const s2 = stars[k];
          if (s2 === s) continue;
          const dx2 = s2.x - s.x;
          const dy2 = s2.y - s.y;
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < 120 && d2 > 0) {
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(s2.x + s2.ox, s2.y + s2.oy);
            ctx.strokeStyle = `rgba(142,207,238,${0.15 * (1 - d2 / 80) * glow})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      s.y -= s.speed * 0.25;
      if (s.y < -5) s.y = H + 5;
      if (s.y > H + 5) s.y = -5;
    });

    rafId = requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", initStars);
  initStars();
  rafId = requestAnimationFrame(drawStars);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !rafId) rafId = requestAnimationFrame(drawStars);
  });
}

// ── TABS DE REDES SOCIALES ──
const embedTabs = document.querySelectorAll(".embed-tab");

if (embedTabs.length > 0) {
  embedTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Quita activo de todas las pestañas y paneles
      embedTabs.forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".embed-panel")
        .forEach((p) => p.classList.remove("activo"));

      // Activa la pestaña clickeada
      tab.classList.add("active");

      // Activa el panel correspondiente
      const red = tab.getAttribute("data-red");
      document.getElementById("panel-" + red).classList.add("activo");
    });
  });
}

let fotos = [];
let indiceActual = 0;
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox?.querySelector(".lightbox-img");
const lbPie = lightbox?.querySelector(".lightbox-pie");
let lbPan = { x: 0, y: 0 };
function lbScale() {
  return window.innerWidth <= 640 ? 1.25 : 1.6;
}
function lbApply() {
  if (!lbImg) return;
  lbImg.style.transform = lbImg.classList.contains("zoomed")
    ? `translate(${lbPan.x}px, ${lbPan.y}px) scale(${lbScale()})`
    : "";
}
function lbResetPan() {
  lbPan = { x: 0, y: 0 };
  if (lbImg) {
    lbImg.style.transform = "";
    lbImg.classList.remove("zoomed", "dragging");
  }
}
function mostrarFoto(i) {
  if (!fotos.length || !lbImg) return;
  if (i < 0) i = fotos.length - 1;
  if (i >= fotos.length) i = 0;
  indiceActual = i;
  lbResetPan();
  lbImg.src = fotos[indiceActual].src;
  lbImg.alt = fotos[indiceActual].pie || "";
  if (lbPie)
    lbPie.textContent = fotos[indiceActual].pie
      ? `${indiceActual + 1} / ${fotos.length} — ${fotos[indiceActual].pie}`
      : `${indiceActual + 1} / ${fotos.length}`;
}
function cerrarLightbox() {
  if (!lightbox) return;
  lbResetPan();
  lightbox.classList.add("closing");
  setTimeout(() => {
    lightbox.classList.remove("activo", "closing");
  }, 200);
  document.body.style.overflow = "";
}
function abrirLightbox(lista, idx) {
  fotos = lista;
  mostrarFoto(idx);
  lightbox.classList.remove("closing");
  lightbox.classList.add("activo");
  document.body.style.overflow = "hidden";
}
// ── LIGHTBOX (delegado, unificado) ──
if (lightbox && lbImg) {
  const qFotos = () => [
    ...document.querySelectorAll(
      ".galeria-item[data-foto], .galeria-foto[data-foto], .gal-foto-small[data-foto]",
    ),
  ];
  document.addEventListener("click", (e) => {
    const card = e.target.closest(
      ".galeria-item[data-foto], .galeria-foto[data-foto], .gal-foto-small[data-foto]",
    );
    if (!card) return;
    const visibles = qFotos().filter((el) => !el.classList.contains("oculto"));
    const lista = visibles.length ? visibles : qFotos();
    const datos = lista.map((el) => ({
      src: el.getAttribute("data-foto"),
      pie: el.getAttribute("data-pie") || el.querySelector("img")?.alt || "",
    }));
    const idx = datos.findIndex(
      (d) => d.src === card.getAttribute("data-foto"),
    );
    abrirLightbox(datos, idx >= 0 ? idx : 0);
  });
  lightbox
    .querySelector(".lightbox-cerrar")
    ?.addEventListener("click", cerrarLightbox);
  lightbox
    .querySelector(".lightbox-overlay")
    ?.addEventListener("click", cerrarLightbox);
  lightbox
    .querySelector(".lightbox-anterior")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      mostrarFoto(indiceActual - 1);
    });
  lightbox
    .querySelector(".lightbox-siguiente")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      mostrarFoto(indiceActual + 1);
    });
  // — click zoom (ignora si hubo drag)
  let lbDrag = { active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false };
  lbImg.addEventListener("click", () => {
    if (lbDrag.moved) {
      lbDrag.moved = false;
      return;
    }
    const isZoomed = lbImg.classList.contains("zoomed");
    if (isZoomed) lbResetPan();
    else {
      lbPan = { x: 0, y: 0 };
      lbImg.classList.add("zoomed");
      lbApply();
    }
  });
  // — drag pan cuando hay zoom (pointer unifica mouse + touch)
  lbImg.addEventListener("pointerdown", (e) => {
    if (!lbImg.classList.contains("zoomed")) return;
    lbDrag = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      ox: lbPan.x,
      oy: lbPan.y,
      moved: false,
    };
    lbImg.classList.add("dragging");
    lbImg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  lbImg.addEventListener("pointermove", (e) => {
    if (!lbDrag.active) return;
    const dx = e.clientX - lbDrag.sx,
      dy = e.clientY - lbDrag.sy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) lbDrag.moved = true;
    lbPan.x = lbDrag.ox + dx;
    lbPan.y = lbDrag.oy + dy;
    lbApply();
  });
  const lbEndDrag = (e) => {
    if (!lbDrag.active) return;
    lbDrag.active = false;
    lbImg.classList.remove("dragging");
    try {
      lbImg.releasePointerCapture(e.pointerId);
    } catch {}
  };
  lbImg.addEventListener("pointerup", lbEndDrag);
  lbImg.addEventListener("pointercancel", lbEndDrag);
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("activo")) return;
    if (e.key === "ArrowRight") mostrarFoto(indiceActual + 1);
    if (e.key === "ArrowLeft") mostrarFoto(indiceActual - 1);
    if (e.key === "Escape") {
      if (lbImg.classList.contains("zoomed")) lbResetPan();
      else cerrarLightbox();
    }
  });
  // — swipe para cambiar foto (solo si no hay zoom)
  let tx = 0;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      if (lbImg.classList.contains("zoomed")) return;
      tx = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  lightbox.addEventListener(
    "touchend",
    (e) => {
      if (lbImg.classList.contains("zoomed")) return;
      const dx = e.changedTouches[0].screenX - tx;
      if (Math.abs(dx) > 50) mostrarFoto(indiceActual + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
  window.addEventListener("resize", lbApply);
}



// ── WIDGET DE X ──
function cargarTwitterWidget() {
  if (window.twttr && window.twttr.widgets) {
    window.twttr.widgets.load(document.getElementById("panel-twitter"));
  }
}

// Espera que el script de X esté listo
window.twttr = window.twttr || {
  _e: [],
  ready: function (f) {
    this._e.push(f);
  },
};
window.twttr.ready(() => {
  cargarTwitterWidget();
});

// También recarga cuando se hace click en la pestaña
const tabTwitter = document.querySelector('[data-red="twitter"]');
if (tabTwitter) {
  tabTwitter.addEventListener("click", () => {
    setTimeout(cargarTwitterWidget, 100);
  });
}

// ── SISTEMA DE IDIOMA ──
const traducciones = {
  es: {
    // NAVBAR
    "nav-inicio": "Inicio",
    "nav-nosotros": "Nosotros",
    "nav-eventos": "Eventos",
    "nav-forjaversarios": "Forjaversarios",
    "nav-redes": "Redes",
    "nav-colaboraciones": "Colaboraciones",
    "nav-donar":
      'Donar <span class="donar-heart" aria-hidden="true"><span class="heart-outline"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-6.7-4.2-8.5-8.2C1.9 9.1 3.1 4.8 7.2 4.8c1.9 0 3.1 1 4.8 2.5 1.7-1.5 2.9-2.5 4.8-2.5 4.1 0 5.3 4.3 3.7 8C18.7 16.8 12 21 12 21z"/></svg></span><span class="heart-filled"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 21s-6.7-4.2-8.5-8.2C1.9 9.1 3.1 4.8 7.2 4.8c1.9 0 3.1 1 4.8 2.5 1.7-1.5 2.9-2.5 4.8-2.5 4.1 0 5.3 4.3 3.7 8C18.7 16.8 12 21 12 21z"/></svg></span></span>',

    // INDEX — HERO
    "hero-badge": "COMUNIDAD · VRCHAT · HISPANOHABLANTE",
    "hero-titulo":
      'Forjadores<br><span class="hero-titulo-celeste">Hispanos</span>',
    "hero-tagline":
      "Aprende, conecta y descubre talento hispanohablante dentro de VRChat.",
    "hero-btn1": "Conoce la comunidad",
    "hero-btn2": "Nuestras redes",

    // INDEX — QUIÉNES SOMOS
    "qs-label": "QUIÉNES SOMOS",
    "qs-titulo": "Un lugar para aprender, crecer y conocer gente",
    "qs-texto":
      "Somos una comunidad hispanohablante en VRChat donde puedes aprender sobre arte 2D, modelado 3D y desarrollo, conocer personas talentosas y colaborar en proyectos reales — todo en español.",
    "qs-p1": "Aprende con otros",
    "qs-p1-sub": "Talleres semanales de arte y desarrollo",
    "qs-p2": "Conoce gente nueva",
    "qs-p2-sub": "Comunidad activa y abierta a todos",
    "qs-p3": "Encuentra talento",
    "qs-p3-sub": "Modeladores, artistas y creadores de VR",

    // INDEX — GALERÍA
    "galeria-label": "GALERÍA",
    "galeria-titulo": "Momentos de la comunidad",
    "galeria-ver": "Ver todas las fotos →",

    // INDEX — EVENTOS
    "eventos-label": "AGENDA",
    "eventos-titulo": "Eventos semanales",
    "eventos-ver": "Ver todos →",

    // INDEX — EQUIPO
    "equipo-label": "PERSONAS",
    "equipo-titulo": "Equipo de administración",

    // FOOTER
    "footer-desc":
      "Comunidad hispanohablante en VRChat dedicada al aprendizaje, el arte digital y la colaboración.",
    "footer-nav": "Navegación",
    "footer-com": "Comunidad",
    "footer-sig": "Síguenos",
    "footer-copy1": "© 2026 Forjadores Hispanos VR · Creado por Noch",
    "footer-copy2": "Actualizado por HorchataDuck · Pancho0308 · Umbra",
  },

  en: {
    // NAVBAR
    "nav-inicio": "Home",
    "nav-nosotros": "About Us",
    "nav-eventos": "Events",
    "nav-forjaversarios": "Forjaversarios",
    "nav-redes": "Social Media",
    "nav-colaboraciones": "Collaborations",
    "nav-donar":
      'Donate <span class="donar-heart" aria-hidden="true"><span class="heart-outline"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-6.7-4.2-8.5-8.2C1.9 9.1 3.1 4.8 7.2 4.8c1.9 0 3.1 1 4.8 2.5 1.7-1.5 2.9-2.5 4.8-2.5 4.1 0 5.3 4.3 3.7 8C18.7 16.8 12 21 12 21z"/></svg></span><span class="heart-filled"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 21s-6.7-4.2-8.5-8.2C1.9 9.1 3.1 4.8 7.2 4.8c1.9 0 3.1 1 4.8 2.5 1.7-1.5 2.9-2.5 4.8-2.5 4.1 0 5.3 4.3 3.7 8C18.7 16.8 12 21 12 21z"/></svg></span></span>',

    // INDEX — HERO
    "hero-badge": "COMMUNITY · VRCHAT · SPANISH-SPEAKING",
    "hero-titulo":
      'Forjadores<br><span class="hero-titulo-celeste">Hispanos</span>',
    "hero-tagline":
      "Learn, connect and discover Spanish-speaking talent inside VRChat.",
    "hero-btn1": "Meet the community",
    "hero-btn2": "Our social media",

    // INDEX — QUIÉNES SOMOS
    "qs-label": "WHO WE ARE",
    "qs-titulo": "A place to learn, grow and meet people",
    "qs-texto":
      "We are a Spanish-speaking community in VRChat where you can learn about 2D art, 3D modeling and development, meet talented people and collaborate on real projects — all in Spanish.",
    "qs-p1": "Learn together",
    "qs-p1-sub": "Weekly art and development workshops",
    "qs-p2": "Meet new people",
    "qs-p2-sub": "Active community open to everyone",
    "qs-p3": "Find talent",
    "qs-p3-sub": "Modelers, artists and VR creators",

    // INDEX — GALERÍA
    "galeria-label": "GALLERY",
    "galeria-titulo": "Community moments",
    "galeria-ver": "View all photos →",

    // INDEX — EVENTOS
    "eventos-label": "SCHEDULE",
    "eventos-titulo": "Weekly events",
    "eventos-ver": "View all →",

    // INDEX — EQUIPO
    "equipo-label": "PEOPLE",
    "equipo-titulo": "Administration team",

    // FOOTER
    "footer-desc":
      "Spanish-speaking community in VRChat dedicated to learning, digital art and collaboration.",
    "footer-nav": "Navigation",
    "footer-com": "Community",
    "footer-sig": "Follow us",
    "footer-copy1": "© 2026 Forjadores Hispanos VR · Created by Noch",
    "footer-copy2": "Updated by HorchataDuck · Pancho0308 · Umbra",

    // EVENTOS — contenido real
    "evento1-tag": "Event 1",
    "evento1-titulo": "Meeting to share",
    "evento1-desc":
      "Do you have questions about Unity/Blender or just want to meet other creators and have a good time? This meetup is for you! Whether you are a beginner or already experienced, come share your projects, get your questions answered in a community, and connect with new people.",
    "evento1-fecha": "🗓 Every Sunday",

    "evento2-tag": "Event 2",
    "evento2-titulo": "Forjaversarios",
    "evento2-desc":
      "Our annual event that brings together 3D creators, artists and developers from across the Spanish-speaking community to celebrate the anniversary of the Forjadores.",
    "evento2-fecha": "🗓 Once a year",
  },
};

let idiomaActual = localStorage.getItem("idioma") || "es";

function aplicarIdioma(idioma) {
  const t = traducciones[idioma];
  if (!t) return;

  // Actualiza todos los elementos con data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const clave = el.getAttribute("data-i18n");
    if (t[clave]) {
      // biome-ignore lint/security/noDangerouslySetInnerHtml: traducciones controladas
      // pi-lens-ignore: no-inner-html-js
      el.innerHTML = t[clave];
    }
  });

  // Actualiza el botón
  const btn = document.getElementById("btn-idioma");
  if (btn) btn.textContent = idioma === "es" ? "🌐 EN" : "🌐 ES";

  // Activa Google Translate para el resto
  if (idioma === "en") {
    activarGoogleTranslate();
  } else {
    desactivarGoogleTranslate();
  }

  // Guarda preferencia
  localStorage.setItem("idioma", idioma);
  idiomaActual = idioma;
}

// oxlint-disable-next-line no-unused-vars
function cambiarIdioma() {
  const nuevoIdioma = idiomaActual === "es" ? "en" : "es";
  aplicarIdioma(nuevoIdioma);
}

function activarGoogleTranslate() {
  // Agrega el widget de Google Translate oculto si no existe
  if (!document.getElementById("google-translate-script")) {
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=iniciarGoogleTranslate";
    document.body.appendChild(script);
  } else if (window.google && window.google.translate) {
    window.google.translate.TranslateElement(
      {
        pageLanguage: "es",
        includedLanguages: "en",
        autoDisplay: false,
      },
      "google-translate-container",
    );
  }
}

function desactivarGoogleTranslate() {
  // Restaura el idioma original removiendo las cookies de translate
  document.cookie =
    "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
    location.hostname;
  location.reload();
}

// Función callback de Google Translate
window.iniciarGoogleTranslate = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "es",
      includedLanguages: "en",
      autoDisplay: true,
    },
    "google-translate-container",
  );
};

// Aplica el idioma guardado al cargar
document.addEventListener("DOMContentLoaded", () => {
  if (idiomaActual === "en") {
    aplicarIdioma("en");
  }
});

// ── FILTRO DE GALERÍA ──
const galeriaTabs = document.querySelectorAll(".galeria-tab");

if (galeriaTabs.length > 0) {
  galeriaTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Activa la pestaña
      galeriaTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const categoria = tab.getAttribute("data-categoria");
      const items = document.querySelectorAll(".galeria-item");
      let visibles = 0;

      items.forEach((item) => {
        if (
          categoria === "todas" ||
          item.getAttribute("data-categoria") === categoria
        ) {
          item.classList.remove("oculto");
          visibles++;
        } else {
          item.classList.add("oculto");
        }
      });

      // Placeholder si categoría vacía — oculta grids para que no deje hueco debajo
      const vacia = document.getElementById("galeria-vacia");
      const galMosaico = document.getElementById("galeria-mosaico");
      const galGrid = document.getElementById("galeria-grid");
      const esVacia = visibles === 0;
      if (vacia) vacia.hidden = !esVacia;
      if (galMosaico) galMosaico.hidden = esVacia;
      if (galGrid) galGrid.hidden = esVacia;
      // Actualiza el contador
      const count = document.getElementById("galeria-count");
      if (count) {
        count.textContent =
          categoria === "todas"
            ? "Mostrando todas las fotos"
            : "Mostrando " + visibles + " foto" + (visibles === 1 ? "" : "s");
      }
    });
  });
}

// ── MENSAJE ENCRIPTADO FV — va apareciendo el texto EN CLARO poco a poco en bloque ──
// ponytail: ~30 líneas, sin lib, respeta prefers-reduced-motion
(() => {
  const block = document.querySelector("[data-decrypt-block]");
  if (!block) return;
  const plains = [...block.querySelectorAll("[data-plain]")];
  if (!plains.length) return;
  // guarda original
  plains.forEach((el) => {
    if (!el.dataset.final) el.dataset.final = el.textContent;
  });
  const GLYPHS = "█▓▒░▞▟▚01#<>·_";
  // empieza encriptado — no se ve desencriptado hasta que toca desencriptar
  plains.forEach((el) => {
    const f = el.dataset.final;
    let s = "";
    for (let i = 0; i < f.length; i++)
      s +=
        f[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    el.textContent = s;
  });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    plains.forEach((s) => {
      s.textContent = s.dataset.final;
      s.classList.add("revealed");
    });
    block.classList.add("decrypt-done");
    const a = document.querySelector("#fv-mensaje-bloque .fv-mensaje-alerta");
    if (a) a.textContent = "✓ MENSAJE DESENCRIPTADO";
    return;
  }
  const alerta = document.querySelector(
    "#fv-mensaje-bloque .fv-mensaje-alerta",
  );
  function decryptEl(el, final) {
    return new Promise((res) => {
      el.classList.add("decrypting");
      const len = final.length;
      let frame = 0;
      const steps = 14;
      const id = setInterval(() => {
        frame++;
        const p = frame / steps;
        const revealed = Math.floor(p * len);
        let out = "";
        for (let i = 0; i < len; i++) {
          if (i < revealed) out += final[i];
          else if (final[i] === " " || final[i] === "¡" || final[i] === "!")
            out += final[i] === " " ? " " : final[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (frame >= steps) {
          clearInterval(id);
          el.textContent = final;
          el.classList.remove("decrypting");
          el.classList.add("revealed");
          res();
        }
      }, 32);
    });
  }
  let done = false;
  async function run() {
    if (done) return;
    done = true;
    await new Promise((r) => setTimeout(r, 400));
    for (let i = 0; i < plains.length; i++) {
      await decryptEl(plains[i], plains[i].dataset.final);
      if (i < plains.length - 1) await new Promise((r) => setTimeout(r, 120));
    }
    // bloques vacíos -> intento fallido con error falso
    const vacios = [...block.querySelectorAll(".censurado[data-error]")];
    for (const el of vacios) {
      el.classList.add("decrypt-trying");
      const err = el.dataset.error;
      for (let t = 0; t < 4; t++) {
        el.textContent = Array.from(
          { length: err.length },
          () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join("");
        await new Promise((r) => setTimeout(r, 70));
      }
      el.textContent = err;
      el.classList.remove("decrypt-trying");
      el.classList.add("decrypt-error");
      await new Promise((r) => setTimeout(r, 180));
    }
    block.classList.add("decrypt-done");
    if (alerta)
      alerta.textContent = "⚠ DESENCRIPTACIÓN PARCIAL — 4 BLOQUES CORRUPTOS";
  }
  // solo 1 vez al cargar la página
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
  // no IntersectionObserver, no fallback, no re-trigger — queda desencriptado
})();

// ── DONATIVOS: gracias + confeti en elección de método ──
// ponytail: sin librerías, canvas nativo, ~50 líneas
(() => {
  const links = document.querySelectorAll("#don-metodos .don-card-header");
  const gracias = document.getElementById("don-gracias");
  const canvas = document.getElementById("confetti-canvas");
  if (!links.length || !gracias || !canvas) return;
  const ctx = canvas.getContext("2d");
  let animId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    const colors = [
      "#ff5e5b",
      "#003087",
      "#8ecfee",
      "#ffd166",
      "#06d6a0",
      "#ffbe0b",
    ];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 120,
      r: 3 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      vx: -3 + Math.random() * 6,
      vy: 2 + Math.random() * 5,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
    }));
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.rot += p.vr;
        if (p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2 * 0.6);
          ctx.restore();
        }
      }
      if (alive && elapsed < 3200) animId = requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(frame);
  }

  function showGracias(href) {
    gracias.hidden = false;
    gracias.classList.remove("is-closing");
    const heart = gracias.querySelector("#don-heart-rect");
    if (heart) {
      heart.style.animation = "none";
      void heart.getBBox();
      heart.style.animation = "";
    }
    launchConfetti();
    // fade coordinado con la barrita (2.8s bar + fade) y autocierre a los 6s
    setTimeout(() => {
      gracias.classList.add("is-closing");
    }, 5500);
    setTimeout(() => {
      gracias.hidden = true;
      gracias.classList.remove("is-closing");
    }, 6000);
    if (href) {
      try {
        const u = new URL(href, location.href);
        const h = u.hostname;
        if (
          h.endsWith("ko-fi.com") ||
          h.endsWith("paypal.com") ||
          h.endsWith("paypal.me")
        ) {
          const safeUrl = u.href;
          // pi-lens-ignore: no-open-redirect-js
          setTimeout(() => window.open(safeUrl, "_blank", "noopener"), 2800);
        }
      } catch {}
    }
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      // permite ctrl/cmd/middle-click abrir sin intercepción
      if (e.ctrlKey || e.metaKey || e.button === 1) return;
      e.preventDefault();
      showGracias(a.href);
    });
  });
  // cerrar con Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gracias.hidden) gracias.hidden = true;
  });
  gracias.addEventListener("click", (e) => {
    if (e.target === gracias) gracias.hidden = true;
  });
})();

// (unificado arriba — ponytail: sin duplicar handlers)

// ── CAROUSEL ediciones anteriores — flechas solo si no caben ──
(function(){
  const track=document.querySelector('#fv-ediciones .fv-track');
  const prev=document.querySelector('.fv-arrow--prev');
  const next=document.querySelector('.fv-arrow--next');
  if(!track||!prev||!next) return;
  const update=()=>{
    const max=track.scrollWidth - track.clientWidth - 2;
    const atStart=track.scrollLeft <= 2;
    const atEnd=track.scrollLeft >= max;
    const needs=track.scrollWidth > track.clientWidth + 4;
    prev.hidden=next.hidden=!needs;
    if(needs){
      prev.disabled=atStart;
      next.disabled=atEnd;
    }
  };
  const scrollByCard=(dir)=>{
    const card=track.querySelector('.fv-col');
    const gap=12;
    const w=(card?card.offsetWidth:300)+gap;
    track.scrollBy({left: w*dir, behavior: 'smooth'});
  };
  prev.addEventListener('click', ()=>scrollByCard(-1));
  next.addEventListener('click', ()=>scrollByCard(1));
  track.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  // observer por si cambian cards
  new ResizeObserver(update).observe(track);
  update();
})();

window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar-principal');

  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let slideActual = 0;
let intervalo;

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

// ── ESTRELLAS FORJAVERSARIOS ──
const starCanvas = document.getElementById('starCanvas');

if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let W, H, stars = [];
  const mouse = { x: -999, y: -999 };
  const N = 350, ATTRACT = 160;

  function resizeCanvas() {
    W = starCanvas.width  = starCanvas.offsetWidth;
    H = starCanvas.height = starCanvas.offsetHeight;
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

  starCanvas.parentElement.addEventListener('mousemove', function(e) {
    const rect = starCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  starCanvas.parentElement.addEventListener('mouseleave', function() {
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
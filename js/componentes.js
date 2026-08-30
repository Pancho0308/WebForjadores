// ── FAVICON ──
function cargarFavicon() {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "img/logo.png";
  document.head.appendChild(favicon);
}

// ── NAVBAR ──
function cargarNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg" id="navbar-principal">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <img src="img/logo.png" alt="Logo Forjadores" width="42" height="42" class="logo-img">
          <div>
            <div class="nav-nombre">Forjadores Hispanos</div>
            <div class="nav-sub">Comunidad VRChat hispanohablante</div>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu-principal">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menu-principal">
          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="nosotros.html">Nosotros</a></li>
            <li class="nav-item"><a class="nav-link" href="que-es-forjaversario.html">Forjaversarios</a></li>
            <li class="nav-item"><a class="nav-link" href="redes.html">Redes</a></li>
            <li class="nav-item"><a class="nav-link" href="colaboraciones.html">Colaboraciones</a></li>
            <li class="nav-item"><a class="nav-link" href="squad-forever-fest.html">Noved Squad</a></li>
            <li class="nav-item">
              <button class="btn-tema" id="btn-tema" onclick="toggleTema()" aria-label="Cambiar tema">🌙</button>
            </li>
            <li class="nav-item">
              <button class="btn-idioma" id="btn-idioma" onclick="cambiarIdioma()">
                🌐 EN
              </button>
            </li>
            <li class="nav-item"><a class="btn btn-donar" href="donativo.html">Donar ♡</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML estático controlado
  // pi-lens-ignore: no-inner-html-js
  document.getElementById("navbar-container").innerHTML = navbarHTML;

  // Marca automáticamente el link activo según la página actual
  const paginaActual =
    window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#navbar-principal .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === paginaActual) {
      link.classList.add("active");
    }
  });

  // Sincroniza icono tema con preferencia guardada
  const temaGuardado = localStorage.getItem("tema");
  const esOscuro =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    (!temaGuardado &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const btnTema = document.getElementById("btn-tema");
  if (btnTema) btnTema.textContent = esOscuro ? "☀️" : "🌙";
}

// ── FOOTER ──
function cargarFooter() {
  const footerHTML = `
    <footer id="footer">
      <div class="container">
        <div class="row gy-4">
          <div class="col-12 col-lg-4">
            <div class="footer-marca">
              <img src="img/logo.png" alt="Logo Forjadores" width="40" height="40" class="logo-img mb-3">
              <h4 class="footer-nombre">Forjadores Hispanos VR</h4>
              <p class="footer-desc">Comunidad hispanohablante en VRChat dedicada al aprendizaje, el arte digital y la colaboración.</p>
            </div>
          </div>
          <div class="col-6 col-lg-2 offset-lg-1">
            <p class="footer-titulo-col">Navegación</p>
            <ul class="footer-links">
              <li><a href="index.html">Inicio</a></li>
              <li><a href="nosotros.html">Sobre Nosotros</a></li>
              <li><a href="que-es-forjaversario.html">Forjaversarios</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <p class="footer-titulo-col">Comunidad</p>
            <ul class="footer-links">
              <li><a href="redes.html">Nuestras Redes</a></li>
              <li><a href="colaboraciones.html">Colaboraciones</a></li>
              <li><a href="que-es-forjaversario.html">Forjaversarios</a></li>
              <li><a href="donativos.html">Donativos</a></li>
            </ul>
          </div>
          <div class="col-12 col-lg-3">
            <p class="footer-titulo-col">Síguenos</p>
            <div class="d-flex flex-column gap-2">
              <a href="https://x.com/fvrchat?lang=en" class="footer-red" aria-label="Twitter / X"><span class="footer-red-icono"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.57 7.51L23 22h-6.18l-4.84-6.33L6.44 22H3.32l7.03-8.03L3 2h6.33l4.37 5.77L18.9 2zm-1.09 18h1.81L5.84 3.85H3.77L17.81 20z"/></svg></span>Twitter / X</a>
              <a href="https://discord.gg/tgp6uTTGAf" class="footer-red" aria-label="Discord"><span class="footer-red-icono"><svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" style="overflow:visible"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg></span>Discord</a>
              <a href="https://www.instagram.com/forjadores.hispanos.de.vrchat/%20" class="footer-red" aria-label="Instagram"><span class="footer-red-icono"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg></span>Instagram</a>
              <a href="https://www.youtube.com/@forjadoreshispanosvrchat" class="footer-red" aria-label="YouTube"><span class="footer-red-icono"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.55-.45-5.27a1.6 1.6 0 0 0-1.13-1.13C19.7 5.15 12 5.15 12 5.15s-7.7 0-9.42.45A1.6 1.6 0 0 0 1.45 6.73C1 8.45 1 12 1 12s0 3.55.45 5.27a1.6 1.6 0 0 0 1.13 1.13C4.3 18.85 12 18.85 12 18.85s7.7 0 9.42-.45a1.6 1.6 0 0 0 1.13-1.13C23 15.55 23 12 23 12zm-13.2 3.45V8.55L16.2 12l-6.4 3.45z"/></svg></span>YouTube</a>
            </div>
          </div>
        </div>
        <hr class="footer-hr">
        <div class="row align-items-center footer-bottom">
          <div class="col-12 col-md-6">
            <p class="footer-copy">© 2026 Forjadores Hispanos VR · Creado por Noch</p>
          </div>
          <div class="col-12 col-md-6 text-md-end">
            <p class="footer-copy">Actualizado por HorchataDuck · Pancho0308 · Umbra</p>
          </div>
        </div>
      </div>
    </footer>
  `;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML estático controlado
  // pi-lens-ignore: no-inner-html-js
  document.getElementById("footer-container").innerHTML = footerHTML;
}

cargarFavicon();
cargarNavbar();
cargarFooter();

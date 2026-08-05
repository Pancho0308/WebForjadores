// ── NAVBAR ──
function cargarNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg" id="navbar-principal">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <img src="img/logo.png" alt="Logo Forjadores" width="40" height="40" class="logo-img">
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
            <li class="nav-item"><a class="nav-link" href="eventos.html">Eventos</a></li>
            <li class="nav-item"><a class="nav-link" href="que-es-forjaversario.html">Forjaversarios</a></li>
            <li class="nav-item"><a class="nav-link" href="redes.html">Redes</a></li>
            <li class="nav-item"><a class="btn btn-donar" href="#">Donar ♡</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  document.getElementById('navbar-container').innerHTML = navbarHTML;

  // Marca automáticamente el link activo según la página actual
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar-principal .nav-link').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === paginaActual) {
      link.classList.add('active');
    }
  });
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
              <li><a href="eventos.html">Eventos</a></li>
              <li><a href="#">VRCA</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <p class="footer-titulo-col">Comunidad</p>
            <ul class="footer-links">
              <li><a href="redes.html">Nuestras Redes</a></li>
              <li><a href="#">Colaboraciones</a></li>
              <li><a href="que-es-forjaversario.html">Forjaversarios</a></li>
              <li><a href="#">Donativos</a></li>
            </ul>
          </div>
          <div class="col-12 col-lg-3">
            <p class="footer-titulo-col">Síguenos</p>
            <div class="d-flex flex-column gap-2">
              <a href="#" class="footer-red"><span class="footer-red-icono">Tw</span>Twitter / X</a>
              <a href="#" class="footer-red"><span class="footer-red-icono">Dc</span>Discord</a>
              <a href="#" class="footer-red"><span class="footer-red-icono">Ig</span>Instagram</a>
              <a href="#" class="footer-red"><span class="footer-red-icono">Yt</span>YouTube</a>
            </div>
          </div>
        </div>
        <hr class="footer-hr">
        <div class="row align-items-center footer-bottom">
          <div class="col-12 col-md-6">
            <p class="footer-copy">© 2026 Forjadores Hispanos VR · Creado por Noch</p>
          </div>
          <div class="col-12 col-md-6 text-md-end">
            <p class="footer-copy">Actualizado por HorchataDuck · UranicTheWolf · Zyiranth</p>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('footer-container').innerHTML = footerHTML;
}

cargarNavbar();
cargarFooter();
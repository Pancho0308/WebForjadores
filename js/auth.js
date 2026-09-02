// ── CONFIGURACIÓN SUPABASE ──
// Reemplaza estos valores con los tuyos de supabase.com/dashboard
const SUPABASE_URL  = 'https://nnvoprqqqfwoglqmnbps.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_V8SARswtGsbtGZc9Fs3sLg_SCtjufXc';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── LOGIN CON DISCORD ──
async function loginConDiscord() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.origin + '/perfil.html'
    }
  });
  if (error) console.error('Error al iniciar sesión:', error.message);
}

// ── LOGOUT ──
async function logout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
  
}

// ── CARGAR PERFIL ──
async function cargarPerfil() {
  const { data: { session } } = await sb.auth.getSession();

  if (!session) {
    // No hay sesión — muestra el botón de login
    document.getElementById('perfil-login').style.display = 'flex';
    document.getElementById('perfil-usuario').style.display = 'none';
    return;
  }

  const user = session.user;
  const meta = user.user_metadata;

  // Muestra el perfil
  document.getElementById('perfil-login').style.display = 'none';
  document.getElementById('perfil-usuario').style.display = 'block';

  // Rellena los datos
  document.getElementById('perfil-nombre').textContent =
    meta.full_name || meta.name || 'Usuario';

  document.getElementById('perfil-avatar').src =
    meta.avatar_url || 'img/logo.png';

  document.getElementById('perfil-discord-id').textContent =
    meta.provider_id || '—';

  document.getElementById('perfil-fecha').textContent =
    new Date(user.created_at).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  // Guarda el perfil en la base de datos si es la primera vez
  await guardarPerfil(user, meta);
}

// ── GUARDAR PERFIL EN SUPABASE ──
async function guardarPerfil(user, meta) {
  const { error } = await sb.from('profiles').upsert({
    id:               user.id,
    discord_username: meta.full_name || meta.name,
    discord_avatar:   meta.avatar_url,
    discord_id:       meta.provider_id,
  }, { onConflict: 'id' });

  if (error) console.error('Error guardando perfil:', error.message);
}

// ── ACTUALIZAR NAVBAR según sesión ──
async function actualizarNavbarConSesion() {
  const { data: { session } } = await sb.auth.getSession();
  const btnIdioma = document.getElementById('btn-idioma');
  if (!btnIdioma) return;

  if (session) {
    const meta = session.user.user_metadata;
    const avatar = meta.avatar_url;
    const nombre = meta.full_name || meta.name || 'Perfil';

    // Inserta el avatar en el navbar
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';
    navItem.innerHTML = `
      <a href="perfil.html" class="nav-perfil-btn">
        <img src="${avatar}" alt="${nombre}" class="nav-avatar">
        <span>${nombre.split(' ')[0]}</span>
      </a>
    `;
    btnIdioma.closest('li').insertAdjacentElement('afterend', navItem);
  }
}

// ── EVENTOS ──
document.addEventListener('DOMContentLoaded', async function() {
  // Botón login
  const btnLogin = document.getElementById('btn-login-discord');
  if (btnLogin) btnLogin.addEventListener('click', loginConDiscord);

  // Botón logout
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  // Carga perfil si estamos en perfil.html
  if (document.getElementById('perfil-seccion')) {
    await cargarPerfil();
  }

  // Actualiza navbar en todas las páginas
  await actualizarNavbarConSesion();
});
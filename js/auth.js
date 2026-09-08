// ── CONFIGURACIÓN SUPABASE ──
// Reemplaza estos valores con los tuyos de supabase.com/dashboard
const SUPABASE_URL  = 'https://nnvoprqqqfwoglqmnbps.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_V8SARswtGsbtGZc9Fs3sLg_SCtjufXc';

let sb;

async function cargarSupabase() {
  if (!window.supabase) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = () => reject(new Error('No se pudo cargar Supabase'));
      document.head.appendChild(script);
    });
  }

  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── LOGIN CON DISCORD ──
async function loginConDiscord() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: new URL('perfil.html', window.location.href).href
    }
  });
  if (error) console.error('Error al iniciar sesión:', error.message);
}

// ── LOGOUT ──
async function logout() {
  await sb.auth.signOut();
  window.location.assign('index.html');
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
    meta.full_name || meta.name || (document.documentElement.lang === 'es' ? 'Usuario' : 'User');

  document.getElementById('perfil-avatar').src =
    meta.avatar_url || `${document.documentElement.lang === 'es' ? '../' : ''}img/logo.png`;

  document.getElementById('perfil-discord-id').textContent =
    meta.provider_id || '—';

  document.getElementById('perfil-fecha').textContent =
    new Date(user.created_at).toLocaleDateString(document.documentElement.lang === 'es' ? 'es-ES' : 'en-US', {
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
function actualizarNavbarConSesion(session) {
  const navLogin = document.getElementById('nav-login');
  if (!navLogin || !session) return;

  const meta = session.user.user_metadata;
  const avatar = meta.avatar_url;
  const nombre = meta.full_name || meta.name || (document.documentElement.lang === 'es' ? 'Perfil' : 'Profile');

  navLogin.classList.remove('nav-login-btn');
  navLogin.removeAttribute('data-i18n');
  const img = new Image();
  img.src = avatar;
  img.alt = nombre;
  img.className = 'nav-avatar';
  const span = document.createElement('span');
  span.textContent = nombre.split(' ')[0];
  navLogin.replaceChildren(img, span);
}

// ── EVENTOS ──
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await cargarSupabase();
  } catch (error) {
    console.error('Error inicializando Supabase:', error);
    return;
  }

  // Escucha la sesión antes de cargar el perfil para evitar mostrar el login
  sb.auth.onAuthStateChange((_event, session) => {
    actualizarNavbarConSesion(session);
  });

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

});
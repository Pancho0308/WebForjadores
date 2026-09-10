// ── CONFIGURACIÓN SUPABASE ──
const SUPABASE_URL = "https://nnvoprqqqfwoglqmnbps.supabase.co";
const SUPABASE_KEY = "sb_publishable_V8SARswtGsbtGZc9Fs3sLg_SCtjufXc";

let sb;

async function cargarSupabase() {
  if (!window.supabase) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = () => reject(new Error("No se pudo cargar Supabase"));
      document.head.appendChild(script);
    });
  }

  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── LOGIN OAUTH ──
async function loginConProveedor(provider) {
  const { error } = await sb.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: new URL("perfil.html", window.location.href).href,
    },
  });
  if (error) console.error("Error al iniciar sesión:", error.message);
}

function obtenerProveedor(user) {
  const id =
    user.app_metadata?.provider || user.identities?.[0]?.provider || "oauth";
  return {
    id,
    name: { google: "Google", discord: "Discord" }[id] || "OAuth",
  };
}

// ── LOGOUT ──
async function logout() {
  await sb.auth.signOut();
  window.location.assign("index.html");
}

// ── CARGAR PERFIL ──
async function cargarPerfil() {
  const {
    data: { session },
  } = await sb.auth.getSession();

  if (!session) {
    // No hay sesión — muestra el botón de login
    document.getElementById("perfil-login").style.display = "flex";
    document.getElementById("perfil-usuario").style.display = "none";
    return;
  }

  const user = session.user;
  const meta = user.user_metadata || {};
  const { id: provider, name: providerName } = obtenerProveedor(user);
  const identity = user.identities?.find((item) => item.provider === provider);

  // Muestra el perfil
  document.getElementById("perfil-login").style.display = "none";
  document.getElementById("perfil-usuario").style.display = "block";

  // Rellena los datos
  document.getElementById("perfil-nombre").textContent =
    meta.full_name ||
    meta.name ||
    (document.documentElement.lang === "es" ? "Usuario" : "User");

  const avatar =
    meta.avatar_url ||
    meta.picture ||
    `${document.documentElement.lang === "es" ? "../" : ""}img/logo.png`;
  const profileAvatar = document.getElementById("perfil-avatar");
  profileAvatar.referrerPolicy = "no-referrer";
  profileAvatar.src = avatar;

  document.getElementById("perfil-proveedor").textContent = providerName;
  document.getElementById("perfil-proveedor-id-label").textContent =
    `${providerName} ID`;
  document.getElementById("perfil-proveedor-id").textContent =
    meta.provider_id || meta.sub || identity?.identity_data?.sub || "—";

  document.getElementById("perfil-fecha").textContent = new Date(
    user.created_at,
  ).toLocaleDateString(
    document.documentElement.lang === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

// ── ACTUALIZAR NAVBAR según sesión ──
function actualizarNavbarConSesion(session) {
  const navLogin = document.getElementById("nav-login");
  if (!navLogin || !session) return;

  const meta = session.user.user_metadata || {};
  const { name: providerName } = obtenerProveedor(session.user);
  const avatar =
    meta.avatar_url ||
    meta.picture ||
    `${document.documentElement.lang === "es" ? "../" : ""}img/logo.png`;
  const nombre =
    meta.full_name ||
    meta.name ||
    (document.documentElement.lang === "es" ? "Perfil" : "Profile");

  navLogin.classList.remove("nav-login-btn");
  navLogin.removeAttribute("data-i18n");
  const img = new Image();
  img.referrerPolicy = "no-referrer";
  img.src = avatar;
  img.alt = nombre;
  img.className = "nav-avatar";
  const name = document.createElement("span");
  name.textContent = nombre.split(" ")[0];
  const provider = document.createElement("small");
  provider.className = "nav-auth-provider";
  provider.textContent = providerName;
  navLogin.replaceChildren(img, name, provider);
}

// ── EVENTOS ──
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await cargarSupabase();
  } catch (error) {
    console.error("Error inicializando Supabase:", error);
    return;
  }

  // Escucha la sesión antes de cargar el perfil para evitar mostrar el login
  sb.auth.onAuthStateChange((_event, session) => {
    actualizarNavbarConSesion(session);
  });

  // Botones de login
  const btnDiscord = document.getElementById("btn-login-discord");
  if (btnDiscord)
    btnDiscord.addEventListener("click", () => loginConProveedor("discord"));

  const btnGoogle = document.getElementById("btn-login-google");
  if (btnGoogle)
    btnGoogle.addEventListener("click", () => loginConProveedor("google"));
  // Botón logout
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) btnLogout.addEventListener("click", logout);

  // Carga perfil si estamos en perfil.html
  if (document.getElementById("perfil-seccion")) {
    await cargarPerfil();
  }
});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");

test("restaura la sesión y muestra el usuario en la navbar", async () => {
  let onReady;
  let hijosNavbar;
  const window = {};
  const session = {
    user: {
      user_metadata: { avatar_url: "avatar.png", full_name: "Ana Pérez" },
    },
  };
  const navLogin = {
    classList: { remove: () => {} },
    removeAttribute: () => {},
    replaceChildren: (...hijos) => {
      hijosNavbar = hijos;
    },
  };
  const client = {
    auth: {
      onAuthStateChange: (callback) => callback("INITIAL_SESSION", session),
    },
  };
  const document = {
    addEventListener: (_evento, callback) => {
      onReady = callback;
    },
    createElement: () => ({}),
    documentElement: { lang: "es" },
    getElementById: (id) => (id === "nav-login" ? navLogin : null),
    head: {
      appendChild: (script) => {
        window.supabase = { createClient: () => client };
        script.onload();
      },
    },
  };

  vm.runInNewContext(fs.readFileSync("js/auth.js", "utf8"), {
    console,
    document,
    Image: class {},
    window,
  });
  await onReady();

  assert.equal(hijosNavbar[0].src, "avatar.png");
  assert.equal(hijosNavbar[1].textContent, "Ana");
});

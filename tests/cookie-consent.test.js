const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync("js/main.js", "utf8").split(
  "// ── PLACEHOLDER IMÁGENES ROTAS ──",
)[0];

function boot(consent, lang = "es") {
  let onReady;
  const scripts = [];
  const banners = [];
  const buttons = [];
  const storage = new Map(
    consent === undefined ? [] : [["metricool-consent", consent]],
  );

  function createElement(tagName) {
    const element = {
      tagName,
      dataset: {},
      children: [],
      append(...children) {
        this.children.push(...children);
      },
      setAttribute(name, value) {
        this[name] = value;
      },
      addEventListener(_event, listener) {
        this.click = listener;
      },
      remove() {
        this.removed = true;
      },
    };
    if (tagName === "button") buttons.push(element);
    return element;
  }

  const document = {
    readyState: "loading",
    documentElement: { lang },
    createElement,
    head: { append: (script) => scripts.push(script) },
    body: { append: (banner) => banners.push(banner) },
    addEventListener: (_event, listener) => {
      onReady = listener;
    },
    querySelector(selector) {
      if (selector === "script[data-metricool]") return scripts[0] || null;
      if (selector === "#cookie-banner") return banners[0] || null;
      return null;
    },
  };

  const context = {
    document,
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
    window: {},
  };
  vm.runInNewContext(source, context);
  onReady();

  return { banners, buttons, context, scripts, storage };
}

test("Metricool remains blocked until consent is accepted", () => {
  const page = boot();
  assert.equal(page.banners.length, 1);
  assert.equal(page.scripts.length, 0);
  assert.deepEqual(
    page.buttons.map((button) => button.textContent),
    ["Rechazar", "Aceptar"],
  );

  page.buttons
    .find((button) => button.dataset.cookieChoice === "accepted")
    .click();
  assert.equal(page.storage.get("metricool-consent"), "accepted");
  assert.equal(page.banners[0].removed, true);
  assert.equal(page.scripts.length, 1);

  let tracked = false;
  page.context.window.beTracker = { t: () => (tracked = true) };
  page.scripts[0].onload();
  assert.equal(tracked, true);
});

test("rejecting consent persists the choice without loading Metricool", () => {
  const page = boot(undefined, "en");
  assert.deepEqual(
    page.buttons.map((button) => button.textContent),
    ["Reject", "Accept"],
  );
  page.buttons
    .find((button) => button.dataset.cookieChoice === "rejected")
    .click();
  assert.equal(page.storage.get("metricool-consent"), "rejected");
  assert.equal(page.scripts.length, 0);

  const revisit = boot("rejected", "en");
  assert.equal(revisit.banners.length, 0);
  assert.equal(revisit.scripts.length, 0);
});

test("stored acceptance loads Metricool without showing the banner", () => {
  const page = boot("accepted");
  assert.equal(page.banners.length, 0);
  assert.equal(page.scripts.length, 1);
});

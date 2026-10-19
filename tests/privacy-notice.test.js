const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

for (const [path, lang] of [
  ["aviso-de-privacidad.html", "en"],
  ["es/aviso-de-privacidad.html", "es"],
]) {
  test(`${path} exposes the notice as static, accessible content`, () => {
    const html = readFileSync(path, "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.equal((main.match(/<h1\b/g) || []).length, 1);
    assert.equal((main.match(/<h2\b/g) || []).length, 5);
    assert.doesNotMatch(main, /\bhidden\b|display:\s*none|<form\b|<script\b/);
    assert.match(main, /datetime="2026-10-16"/);
    assert.match(main, /href="mailto:forjadores\.hispanos\.vrchat@gmail\.com"/);
    assert.match(html, /id="footer-container"/);
    for (const [, id] of main.matchAll(/aria-labelledby="([^"]+)"/g)) {
      assert.ok(main.includes(`id="${id}"`), `Missing section heading: ${id}`);
    }
    for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(url)) continue;
      const assetPath = new URL(url, `https://example.com/${path}`).pathname.slice(1);
      assert.ok(existsSync(assetPath), `${path}: missing ${url}`);
    }
  });
}

test("Spanish page preserves every line of the supplied notice", () => {
  const normalize = (text) => text.replace(/\s+/g, " ").replace(/\s+([.,;:])/g, "$1").trim().toLowerCase();
  const html = readFileSync("es/aviso-de-privacidad.html", "utf8");
  const text = normalize(html.replace(/<[^>]*>/g, " "));
  const original = readFileSync("Aviso de privacidad Forjadores.txt", "utf8")
    .replace("Mexico, ciuda de mexico", "México, Ciudad de México");
  for (const line of original.split(/\r?\n/)) {
    const expected = normalize(line.replace(/^•\s*/, ""));
    if (expected) assert.ok(text.includes(expected), `Missing source text: ${line}`);
  }
});

test("Shared footer links to an existing notice without a session in both languages", () => {
  const source = readFileSync("js/componentes.js", "utf8");
  for (const prefix of ["/", "/es/"]) {
    const containers = {
      "navbar-container": {},
      "footer-container": {},
    };
    vm.runInNewContext(source, {
      window: { location: { pathname: `${prefix}index.html` } },
      document: {
        createElement: () => ({}),
        head: { appendChild() {} },
        getElementById: (id) => containers[id],
        querySelectorAll: () => [],
      },
    });
    const footer = containers["footer-container"].innerHTML;
    assert.match(footer, /<a href="aviso-de-privacidad\.html" class="btn btn-outline-light" data-i18n="footer-privacidad">/);
    assert.ok(existsSync(`.${prefix}aviso-de-privacidad.html`));
  }
  const translations = readFileSync("js/main.js", "utf8");
  assert.match(translations, /"footer-privacidad": "Aviso de privacidad"/);
  assert.match(translations, /"footer-privacidad": "Privacy notice"/);
});

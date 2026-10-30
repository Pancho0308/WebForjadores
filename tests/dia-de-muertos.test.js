const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const test = require("node:test");


test("Both event homepages keep the dates, closed registration notice, local assets and original content", () => {
  for (const [path, backup] of [
    ["index.html", "index.html.original"],
    ["es/index.html", "es-index.html.original"],
  ]) {
    const html = readFileSync(path, "utf8");
    const original = readFileSync(`respaldos/dia-de-muertos-2026/${backup}`, "utf8");
    assert.match(html, /class="evento-muertos"/);
    assert.match(html, /datetime="2026-11-01"/);
    assert.match(html, /datetime="2026-11-08"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/class="dm-card"/g) || []).length, 8);
    assert.doesNotMatch(html, /docs\.google\.com\/forms|<form\b|OPEN CALL FOR COMMUNITIES|CONVOCATORIA PARA COMUNIDADES/);
    assert.match(html, /REGISTRATION CLOSED|INSCRIPCIONES CERRADAS/);
    assert.ok(html.indexOf('id="invitacion"') < html.indexOf('id="galeria"'));
    assert.match(html, /dates and times not listed are to be confirmed|fechas y horas no indicadas están por confirmar/);
    assert.match(html, /css\/dia-de-muertos\.css/);
    assert.equal(
      html.slice(html.indexOf("<!-- GALERÍA -->"), html.indexOf("<!-- FOOTER -->")),
      original.slice(original.indexOf("<!-- GALERÍA -->"), original.indexOf("<!-- FOOTER -->")),
    );
    for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (!url || /^(https?:|#)/.test(url)) continue;
      const pathname = new URL(url, `https://example.com/${path}`).pathname;
      assert.ok(existsSync(resolve(`.${pathname}`)), `${path}: missing ${url}`);
    }
    for (const [, attributes] of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
      assert.match(attributes, /rel="noopener noreferrer"/);
    }
  }
});

test("Both homepages publish the activities, collectible sets and schedule caveats", () => {
  for (const path of ["index.html", "es/index.html"]) {
    const html = readFileSync(path, "utf8");
    const activities = html.slice(html.indexOf('id="actividades"'), html.indexOf('class="dm-community"'));
    for (const name of [
      "HorrorCon Handoff &amp; Opening Ceremony",
      "Journey to Mictlán",
      "Performance Nights",
      "Voices of Remembrance",
      "Night of Sharing &amp; Community Connections",
      "Daily Collectibles · The Cempasúchil Trail",
      "Noche de las Ánimas · DJ Afterparties",
      "The Flame of the Souls",
    ]) assert.ok(activities.includes(name), `${path}: missing ${name}`);
    assert.match(activities, /10:30 PM EST/);
    assert.match(activities, /November 2 · 7:00–10:00 PM EST|2 de noviembre · 7:00–10:00 PM EST/);
    assert.match(activities, /November 3, 4 &amp; 6|3, 4 y 6 de noviembre/);
    assert.match(activities, /November 7 · 7:00–10:00 PM EST|7 de noviembre · 7:00–10:00 PM EST/);
    assert.match(activities, /Date to be confirmed · 7:00–10:00 PM EST|Fecha por confirmar · 7:00–10:00 PM EST/);
    assert.match(activities, /Not every night will have a DJ|No habrá DJs necesariamente todas las noches/);
    assert.match(activities, /approximately every 30 minutes|aproximadamente cada 30 minutos/);
    const sets = [...activities.matchAll(/<li>([^<]+)<\/li>/g)].map((match) => match[1]);
    assert.equal(sets.length, 5);
    ["Veladora", "Cempasúchil", "Pan de Muerto", "Agua", "Papel Picado"].forEach((name, index) => {
      assert.match(sets[index], new RegExp(`^(November ${index + 1}|${index + 1} de noviembre): ${name}`));
    });
    assert.match(activities, /15 collectibles|15 coleccionables/);
  }
});

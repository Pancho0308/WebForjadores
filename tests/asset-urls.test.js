const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { readFileSync, readdirSync } = require("node:fs");
const test = require("node:test");

for (const directory of [".", "es"]) {
  for (const name of readdirSync(directory).filter((name) => name.endsWith(".html"))) {
    const file = `${directory}/${name}`;
    test(`${file} loads current CSS and JS independently of the page URL`, () => {
      const html = readFileSync(file, "utf8");
      const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
        .map((match) => match[1])
        .filter((url) => !url.startsWith("https://") && /\.(css|js)(?:\?|$)/.test(url));
      assert.ok(assets.length >= 4, "Missing shared CSS or scripts");
      for (const asset of assets) {
        assert.match(asset, /^\/(css|js)\//, `Use a root-relative URL: ${asset}`);
        const url = new URL(asset, "https://example.com");
        const content = Buffer.from(readFileSync(`.${url.pathname}`, "utf8").replace(/\r\n/g, "\n"));
        const version = createHash("sha1")
          .update(`blob ${content.length}\0`)
          .update(content)
          .digest("hex")
          .slice(0, 12);
        assert.equal(url.search, `?v=${version}`, `Update ${asset} after changing its contents`);
        for (const page of [file, file.replace(/\.html$/, ""), `${file.replace(/\.html$/, "")}/`, "es/missing/nested/page"]) {
          assert.equal(new URL(asset, `https://example.com/${page}`).pathname, url.pathname);
        }
      }
    });
  }
}

test("Apache redirects trailing slashes only for existing HTML pages", () => {
  const config = readFileSync(".htaccess", "utf8");
  const rule = [
    "RewriteCond %{REQUEST_FILENAME} !-d",
    "RewriteCond %{REQUEST_FILENAME} ^(.+)/$",
    "RewriteCond %1.html -f",
    "RewriteRule ^(.+)/$ /$1 [R=301,L,NE]",
  ].join("\n");
  assert.ok(config.includes(rule));
  assert.ok(config.indexOf(rule) < config.indexOf("RewriteRule ^(.+?)/?$ $1.html [L]"));
});

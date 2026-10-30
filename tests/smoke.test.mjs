import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "styles.css"), "utf8");
const js = readFileSync(resolve(root, "app.js"), "utf8");

test("los IDs HTML son únicos y los enlaces internos resuelven", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, "Hay identificadores duplicados");
  const idSet = new Set(ids);
  const anchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
  for (const anchor of anchors) assert.ok(idSet.has(anchor), `No existe #${anchor}`);
});

test("las imágenes locales existen y tienen formato WebP válido", () => {
  const srcs = [...html.matchAll(/\bsrc="(assets\/[^"]+)"/g)].map((match) => match[1]);
  assert.ok(srcs.length >= 4);
  for (const src of new Set(srcs)) {
    const path = resolve(root, src);
    assert.ok(existsSync(path), `Falta ${src}`);
    if (src.endsWith(".webp")) {
      const bytes = readFileSync(path);
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      assert.ok(statSync(path).size < 400_000, `${src} debe optimizarse`);
    }
  }
});

test("las cuatro categorías y el flujo honesto de WhatsApp están documentados", () => {
  for (const category of ["pastas", "fusion", "pizzas", "parrillas"]) {
    assert.ok(js.includes(`${category}: [`));
    assert.ok(html.includes(`data-category="${category}"`));
  }
  assert.ok(js.includes('whatsapp: "51902690387"'));
  assert.ok(html.includes("No se confirma ni se registra una reserva"));
  assert.ok(html.includes("sin precios publicados"));
});

test("hay soporte de móvil y reducción de movimiento", () => {
  assert.ok(css.includes("@media (max-width: 600px)"));
  assert.ok(css.includes("prefers-reduced-motion"));
  assert.ok(html.includes('name="viewport"'));
  assert.ok(html.includes('"@type": "Restaurant"'));
});

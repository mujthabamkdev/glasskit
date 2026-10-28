import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);

test('classic bundle registers both components without module imports and can be loaded twice', async () => {
  const source = await readFile(new URL('dist/liquid-glass.global.js', root), 'utf8');
  assert.doesNotMatch(source, /^\s*(import|export)\s/m);
  const registry = new Map();
  const context = { customElements: { get: (name) => registry.get(name), define: (name, type) => registry.set(name, type) } };
  runInNewContext(source, context); runInNewContext(source, context);
  assert.equal(registry.size, 2);
  assert.equal(typeof context.Glasskit.LiquidGlass, 'function');
  assert.equal(typeof context.Glasskit.LiquidRecorder, 'function');
  assert.equal(context.Glasskit.formatTime(18000), '00:18');
});

test('local-file demo uses classic scripts and all first-party resources exist', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.doesNotMatch(html, /<script[^>]*type="module"/);
  const assets = [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map((match) => match[1]);
  for (const asset of assets) await access(new URL(asset, root));
  for (const asset of ['assets/pebbles.svg', 'assets/midnight.svg', 'assets/porcelain.svg']) await access(new URL(asset, root));
  const demo = await readFile(new URL('demo/demo.js', root), 'utf8');
  assert.doesNotMatch(demo, /^import /m);
});

test('ES module and declaration outputs match their maintained source', async () => {
  assert.equal(await readFile(new URL('dist/liquid-glass.js', root), 'utf8'), await readFile(new URL('src/index.js', root), 'utf8'));
  assert.equal(await readFile(new URL('dist/liquid-glass.d.ts', root), 'utf8'), await readFile(new URL('src/index.d.ts', root), 'utf8'));
});

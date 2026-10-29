import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const layoutSource = html.slice(html.indexOf('function layoutCards()'), html.indexOf("for (const query of ['(min-width:640px)'"));

function card(name, ratio) {
  return {
    name,
    dataset: ratio ? { ratio } : {},
    classList: { contains: value => name === value }
  };
}

test('gallery pins postage and Visa in column two, Plasma and Portfolio in column three', () => {
  for (const width of [768, 1440]) {
    const cards = [card('card-live'), card('card-live-ui'), card('card-live-slider'), card('card-postage', '1/1'), card('card-visa', '4/3'), card('card-plasma', '1/1'), card('card-portfolio', '8/5'), ...Array.from({ length: 12 }, () => card('card', '4/3'))];
    const grid = { clientWidth: width, replaceChildren(...columns) { this.columns = columns; } };
    const context = {
      galleryCards: cards,
      grid,
      getComputedStyle: () => ({ paddingLeft: '24px' }),
      window: { matchMedia: query => ({ matches: width >= Number(query.match(/\d+/)[0]) }) },
      document: { createElement: () => ({ children: [], appendChild(child) { this.children.push(child); } }) }
    };
    runInNewContext(`${layoutSource}\nlayoutCards();`, context);
    assert.equal(grid.columns.length, width >= 900 ? 3 : 2);
    assert.equal(grid.columns[1].children[0], cards[3]);
    assert.equal(grid.columns[1].children[1], cards[4]);
    assert.equal(grid.columns[width >= 900 ? 2 : 1].children[width >= 900 ? 0 : 2], cards[5]);
    assert.equal(grid.columns[width >= 900 ? 2 : 1].children[width >= 900 ? 1 : 3], cards[6]);
    assert.deepEqual(grid.columns[0].children.slice(0, 3), cards.slice(0, 3));
    assert.equal(new Set(grid.columns.flatMap(column => column.children)).size, cards.length);

    context.window.matchMedia = () => ({ matches: false });
    runInNewContext('layoutCards();', context);
    assert.equal(grid.columns.length, 1);
    assert.deepEqual(grid.columns[0].children, cards);
  }
});

test('Portfolio listing includes web filters, the shared component, details and standalone download', async () => {
  const listing = html.slice(html.indexOf("portfolio.className = 'card card-portfolio'"));
  assert.match(listing, /portfolio\.dataset\.ratio = '8\/5'/);
  assert.match(html, /cat === 'all' \|\| cat === 'latest' \|\| cat === 'web'/);
  assert.match(html, /<portfolio-website-scene preview autoplay/);
  assert.match(html, /href="\/portfolio-website"/);
  await access(new URL('src/portfolio-website.js', root));
  const details = await readFile(new URL('portfolio-website.html', root), 'utf8');
  assert.match(details, /<portfolio-website-scene[^>]*data-preview interaction-only/);
  assert.doesNotMatch(details, /<portfolio-website-scene[^>]*\bautoplay\b/);
  assert.match(details, /<body class="scene-detail portfolio-detail">/);
  assert.match(details, /class="component-stage portfolio-stage"/);
  assert.match(details, /href="\.\/demo\/styles\.css"/);
  assert.match(details, /styling inspired by Cambree Bernkopf/);
  assert.match(details, /download="portfolio-website\.js"/);
  assert.match(details, /no orders or messages are sent/);
  for (const id of ['tuning-panel', 'restart-preview', 'refraction', 'blur', 'elasticity', 'glow', 'integration-code']) assert.ok(details.includes(`id="${id}"`));
  assert.doesNotMatch(details, /<video|media\.inspora\.design/);
});

test('Plasma listing links to matching component details with demo boundaries', async () => {
  assert.match(html, /<plasma-app-scene preview/);
  assert.match(html, /href="\/plasma-app"/);
  await access(new URL('src/plasma-app.js', root));
  const details = await readFile(new URL('plasma-app.html', root), 'utf8');
  assert.match(details, /<plasma-app-scene[^>]*data-preview/);
  assert.match(details, /<body class="scene-detail">/);
  assert.match(details, /href="\.\/demo\/styles\.css"/);
  assert.match(details, /styling inspired by Sergei Semenov/);
  assert.match(details, /download="plasma-app\.js"/);
  assert.match(details, /Demo only\. No money moves/);
  for (const id of ['tuning-panel', 'restart-preview', 'refraction', 'blur', 'elasticity', 'glow', 'integration-code']) assert.ok(details.includes(`id="${id}"`));
  assert.doesNotMatch(details, /<video|media\.inspora\.design/);
});

test('platinum Visa listing links to a matching component detail page without reference media', async () => {
  assert.match(html, /cat === 'all' \|\| cat === 'latest' \|\| cat === 'illustration'/);
  assert.match(html, /<platinum-visa-card-scene preview/);
  assert.match(html, /href="\/platinum-visa-card"/);
  await access(new URL('src/platinum-visa-card.js', root));
  const details = await readFile(new URL('platinum-visa-card.html', root), 'utf8');
  assert.match(details, /<platinum-visa-card-scene[^>]*data-preview/);
  assert.match(details, /<body class="scene-detail">/);
  assert.match(details, /href="\.\/demo\/styles\.css"/);
  assert.match(details, /styling inspired by Juliette/);
  assert.match(details, /download="platinum-visa-card\.js"/);
  for (const id of ['tuning-panel', 'restart-preview', 'refraction', 'blur', 'elasticity', 'glow', 'integration-code']) assert.ok(details.includes(`id="${id}"`));
  assert.doesNotMatch(details, /<video|media\.inspora\.design/);
});

test('postage listing and matching detail page use the same Web Component, not reference media', async () => {
  assert.match(html, /cat === 'all' \|\| cat === 'latest' \|\| cat === 'print'/);
  assert.match(html, /href="\/postage-stamps"/);
  await access(new URL('src/postage-stamps.js', root));
  const details = await readFile(new URL('postage-stamps.html', root), 'utf8');
  assert.match(html, /<postage-stamps-scene preview/);
  assert.match(details, /<postage-stamps-scene[^>]*data-preview/);
  assert.match(details, /<body class="scene-detail">/);
  assert.match(details, /href="\.\/demo\/styles\.css"/);
  assert.match(details, /Dhruv Gupta \/ Pixelup Labs/);
  assert.match(details, /https:\/\/www\.inspora\.design\/posts\/postage-stamps/);
  assert.match(details, /download="postage-stamps\.js"/);
  for (const id of ['tuning-panel', 'restart-preview', 'refraction', 'blur', 'elasticity', 'glow', 'integration-code']) assert.ok(details.includes(`id="${id}"`));
  assert.doesNotMatch(details + html, /<video|media\.inspora\.design|postage-stamps\.webp/);
});

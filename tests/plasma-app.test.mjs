import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/plasma-app.js', import.meta.url), 'utf8');

function fixture() {
  const registry = new Map();
  const frames = new Map();
  const timers = new Map();
  let frameId = 0;
  let now = 0;
  class Element {
    constructor() {
      this.attributes = new Map();
      this.properties = new Map();
      this.events = [];
      this.style = { setProperty: (name, value) => this.properties.set(name, value) };
    }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    hasAttribute(name) { return this.attributes.has(name); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); this.attributeChangedCallback?.(name); }
    dispatchEvent(event) { this.events.push(event); }
  }
  const context = {
    HTMLElement: Element,
    customElements: { get: name => registry.get(name), define: (name, type) => registry.set(name, type) },
    requestAnimationFrame: callback => { const id = ++frameId; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: (callback, delay) => { const id = ++frameId; timers.set(id, { callback, time: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    document: { hidden: false },
    performance: { now: () => now },
    CustomEvent: class { constructor(type, options) { this.type = type; Object.assign(this, options); } }
  };
  const load = () => runInNewContext(`(() => { ${source.replace(/^export /gm, '')} })();`, context);
  load();
  const scene = new (registry.get('plasma-app-scene'))();
  scene._status = {};
  scene._events = { abort() {} };
  scene._motion = { matches: false };
  scene.reset();
  function advance(time) {
    now = time;
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(now));
    for (const [id, timer] of [...timers]) {
      if (timer.time <= now) { timers.delete(id); timer.callback(); }
    }
  }
  return { scene, registry, load, frames, timers, advance };
}

test('Plasma module registers safely and uses no videos, remote artwork, or payment API', () => {
  const { registry, load } = fixture();
  load();
  assert.equal(registry.size, 1);
  assert.doesNotMatch(source, /^import |<video|<img|https?:\/\/|\bfetch\(/m);
});

test('demo deposits cycle bank, user, and invite sources with exact cent-based totals', () => {
  const { scene } = fixture();
  scene.setAttribute('static', '');
  assert.equal(scene.balance, 2450);
  assert.equal(scene.deposit(), true);
  assert.equal(scene.balance, 2550);
  scene.deposit();
  scene.deposit();
  assert.equal(scene.balance, 2675);
  assert.equal(scene.send(), true);
  assert.equal(scene.balance, 2625);
  assert.equal(scene._display, 262500);
  assert.equal(scene.events[0].detail.source, 'Northwind Bank');
  assert.equal(scene.events[2].detail.source, 'Invite bonus');
  assert.equal(scene.events[3].detail.amount, -50);
  assert.equal(scene.events[0].bubbles, true);
  assert.equal(scene.events[0].composed, true);
  assert.equal(scene._transactions[0].amount, -5000);
});

test('rapid deposits cancel stale counters and reset cancels pending updates', () => {
  const { scene, frames, advance } = fixture();
  scene.deposit();
  scene.deposit();
  assert.equal(frames.size, 1);
  advance(1800);
  assert.equal(scene._display, 265000);
  assert.equal(scene.balance, 2650);
  scene.deposit();
  scene.reset();
  assert.equal(frames.size, 0);
  advance(3600);
  assert.equal(scene.balance, 2450);
  assert.equal(scene._display, 245000);
  assert.equal(scene._depositIndex, 0);
  assert.equal(scene._transactions.length, 3);
});

function counter() {
  return {
    set innerHTML(value) { this.html = value; this.reels = [...value.matchAll(/class="reel"/g)].map(() => ({ style: {} })); },
    querySelectorAll() { return this.reels; },
    setAttribute(name, value) { this[name] = value; }
  };
}

test('number reels roll through carries, keep cents stable, and land on exact balances', () => {
  const { scene } = fixture();
  const amount = counter();
  scene._counters = scene._prepareCounter(amount, 245000, 255000);
  assert.equal(amount['aria-label'], '$2,550.00');
  assert.deepEqual(Array.from(scene._counters, reel => reel.distance), [0, 1, 10, 10, 0, 0]);
  scene._renderCounters(.5);
  assert.equal(amount.reels[1].style.transform, 'translateY(-0.5em)');
  assert.equal(amount.reels[2].style.transform, 'translateY(-5em)');
  assert.match(amount.reels[2].style.filter, /blur\(0\.065em\)/);
  scene._renderCounters(1);
  assert.equal(amount.reels[2].style.transform, 'translateY(-10em)');
  const outgoing = scene._prepareCounter(amount, 255000, 250000);
  assert.deepEqual(Array.from(outgoing, reel => reel.distance), [0, 0, 5, 10, 0, 0]);
  assert.match(amount.html, /<span>5<\/span><span>4<\/span><span>3<\/span><span>2<\/span><span>1<\/span><span>0<\/span>/);
  scene._prepareCounter(amount, 99999, 109999);
  assert.equal(amount['aria-label'], '$1,099.99');
});

test('Dynamic Island shows deposit, transfer and invite feedback then collapses', () => {
  const { scene, timers, advance } = fixture();
  const icon = {};
  const receipt = {};
  scene._island = { dataset: {}, style: { setProperty() {} }, querySelector: selector => selector === '.island-icon' ? icon : receipt };
  scene._islandAmount = counter();
  scene.deposit();
  assert.equal(scene._island.dataset.expanded, 'true');
  assert.equal(icon.textContent, '▦');
  assert.equal(receipt.textContent, 'Deposit received');
  assert.equal(scene._islandAmount['aria-label'], '$100.00');
  scene.deposit();
  assert.equal(icon.textContent, 'A');
  assert.equal(timers.size, 1);
  scene.deposit();
  assert.equal(receipt.textContent, 'Credits received');
  advance(2800);
  assert.equal(scene._island.dataset.expanded, 'false');
  scene.send();
  assert.equal(receipt.textContent, 'Transfer sent');
  scene.reset();
  assert.equal(scene._island.dataset.expanded, 'false');
  assert.equal(timers.size, 0);
});

test('autoplay runs only in visible motion-enabled previews and manual actions cancel it', () => {
  const { scene, timers, advance } = fixture();
  scene._visible = true;
  scene.setAttribute('autoplay', '');
  assert.equal(timers.size, 1);
  advance(1400);
  assert.equal(scene.balance, 2550);
  assert.equal(scene._manual, false);
  scene.deposit();
  assert.equal(scene.balance, 2650);
  assert.equal(timers.size, 0);
  scene.reset();
  assert.equal(timers.size, 1);
  scene._visible = false;
  scene._syncAutoplay();
  assert.equal(timers.size, 0);
  scene._visible = true;
  scene._motion.matches = true;
  scene._syncAutoplay();
  assert.equal(timers.size, 0);
  scene._motion.matches = false;
  scene._syncAutoplay();
  assert.equal(timers.size, 1);
  scene.disconnectedCallback();
  assert.equal(timers.size, 0);
});

test('automatic preview cycles all three deposits and resets before replaying', () => {
  const { scene, advance } = fixture();
  scene._visible = true;
  scene.setAttribute('autoplay', '');
  advance(1400);
  assert.equal(scene.balance, 2550);
  advance(4800);
  advance(6200);
  assert.equal(scene.balance, 2650);
  advance(9600);
  advance(11000);
  assert.equal(scene.balance, 2675);
  assert.equal(scene.events[2].detail.source, 'Invite bonus');
  advance(14400);
  advance(15800);
  assert.equal(scene.balance, 2450);
  assert.equal(scene._depositIndex, 0);
  advance(17200);
  assert.equal(scene.balance, 2550);
});

test('balance and material settings clamp invalid values and prevent overdrafts', () => {
  const { scene } = fixture();
  scene.setAttribute('balance', '-1');
  assert.equal(scene.balance, 0);
  assert.equal(scene.send(), false);
  assert.equal(scene.events.length, 0);
  scene.setAttribute('balance', 'NaN');
  assert.equal(scene.balance, 2450);
  scene.setAttribute('balance', '1000000');
  assert.equal(scene.balance, 999999.99);
  assert.equal(scene.deposit(), false);
  scene.setAttribute('refraction', '1000');
  assert.equal(scene.properties.get('--groove-opacity'), .75);
  scene.setAttribute('blur', '-2');
  assert.equal(scene.properties.get('--nav-frost'), '0px');
  scene.setAttribute('glow', '');
  assert.equal(scene.properties.get('--accent-saturation'), 1);
});

test('reduced motion finishes instantly and disconnect releases animation work', () => {
  const { scene, frames } = fixture();
  scene._motion.matches = true;
  scene.deposit();
  assert.equal(frames.size, 0);
  assert.equal(scene._display, 255000);
  scene._motion.matches = false;
  scene.deposit();
  assert.equal(frames.size, 1);
  let aborted = false;
  scene._events = { abort() { aborted = true; } };
  scene.disconnectedCallback();
  assert.equal(aborted, true);
  assert.equal(frames.size, 0);
  assert.equal(scene._display, 265000);
  assert.equal(scene.deposit(), false);
});

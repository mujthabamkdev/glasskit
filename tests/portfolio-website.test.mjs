import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/portfolio-website.js', import.meta.url), 'utf8');

function fixture() {
  const registry = new Map();
  const timers = new Map();
  const animations = [];
  const frames = new Map();
  let now = 0;
  let id = 0;
  function node() {
    const properties = new Map();
    return { dataset: {}, properties, style: { setProperty: (key, value) => properties.set(key, value) },
      setAttribute(key, value) { this[key] = value; }, focus() { this.focused = true; }, isConnected: true };
  }
  class Element {
    constructor() { this.attributes = new Map(); this.events = []; const base = node(); this.properties = base.properties; this.style = base.style; }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    hasAttribute(key) { return this.attributes.has(key); }
    setAttribute(key, value) { this.attributes.set(key, String(value)); if (this.constructor.observedAttributes.includes(key)) this.attributeChangedCallback(key); }
    removeAttribute(key) { this.attributes.delete(key); }
    toggleAttribute(key, on) { if (on) this.attributes.set(key, ''); else this.attributes.delete(key); }
    dispatchEvent(event) { this.events.push(event); }
  }
  const context = {
    HTMLElement: Element,
    customElements: { get: key => registry.get(key), define: (key, type) => registry.set(key, type) },
    setTimeout(callback, delay) { const key = ++id; timers.set(key, { callback, time: now + delay }); return key; },
    clearTimeout: key => timers.delete(key),
    performance: { now: () => now },
    requestAnimationFrame(callback) { const key = ++id;frames.set(key, callback);return key; },
    cancelAnimationFrame: key => frames.delete(key),
    getComputedStyle: fabric => ({ transform: fabric.transform || 'none' }),
    document: { hidden: false },
    CustomEvent: class { constructor(type, options) { this.type = type; Object.assign(this, options); } }
  };
  const load = () => runInNewContext(`(() => { ${source.replace(/^export /gm, '')} globalThis.clothTest = { clothMesh, PortfolioCloth }; })();`, context);
  load();
  const scene = new (registry.get('portfolio-website-scene'))();
  scene._events = { abort() { this.aborted = true; } };
  scene._motion = { matches: false };
  const close = node();
  const count = node();
  const name = node();
  const heading = node();
  const description = node();
  const extra = node();
  scene._details = { ...node(), querySelector: key => ({ '[data-close]': close, '.detail-count': count, '.detail-name': name })[key] };
  scene._panel = { ...node(), querySelector: key => ({ h2: heading, '[data-description]': description, '[data-extra]': extra })[key] };
  scene._site = { ...node(), querySelector: () => node() };
  scene._label = node();
  scene._brand = node();
  scene._status = node();
  scene._buttons = Array.from({ length: 10 }, () => {
    const fabrics = Array.from({ length: 2 }, () => ({ animate(keyframes, options) {
      const animation = { keyframes, options, target: this, finished: new Promise(() => {}), cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    } }));
    return { ...node(), querySelectorAll: () => fabrics };
  });
  scene.shadowRoot = { querySelector: () => node() };
  scene.reset();
  function advance(time) {
    now = time;
    for (const [key, timer] of [...timers]) if (timer.time <= now) { timers.delete(key); timer.callback(); }
  }
  function frame(time) {
    now = time;
    for (const [key, callback] of [...frames]) { frames.delete(key);callback(time); }
  }
  return { scene, registry, load, timers, advance, animations, context, count, name, heading, description, close, frames, frame };
}

test('Portfolio safely registers one dependency-free module with ten local garments', () => {
  const { registry, load, scene } = fixture();
  load();
  assert.equal(registry.size, 1);
  assert.equal(scene.itemCount, 10);
  assert.doesNotMatch(source.replaceAll('http://www.w3.org/2000/svg', ''), /^import |<video|<img|https?:\/\/|\bfetch\(/m);
  assert.match(source, /garment-back/);
  assert.match(source, /@keyframes ticker/);
  assert.match(source, /@media\(prefers-reduced-motion:reduce\)\{\*,\*::before,\*::after/);
});

test('all ten garments open with matching captions, semantic state and composed events', () => {
  const { scene, count, name } = fixture();
  for (let index = 0; index < 10; index++) {
    assert.equal(scene.open(index), true);
    assert.equal(scene.selectedIndex, index);
    assert.equal(scene.isOpen, true);
    assert.equal(count.textContent, `${String(index + 1).padStart(2, '0')} / 10`);
    assert.equal(name.textContent, scene.events.at(-1).detail.name);
    assert.equal(scene._buttons[index]['aria-pressed'], 'true');
    assert.ok(scene._buttons.every(button => button.inert));
    assert.equal(scene._details.hidden, false);
    assert.equal(scene._site.role, 'dialog');
    const event = scene.events.at(-1);
    assert.equal(event.bubbles, true);
    assert.equal(event.composed, true);
  }
  scene.close();
  assert.equal(scene.selectedIndex, -1);
  assert.equal(scene.isOpen, false);
  assert.equal(scene._details.hidden, true);
  assert.ok(scene._buttons.every(button => !button.inert));
  assert.equal(scene._buttons[9].focused, true);
  assert.equal(scene.events.at(-1).detail.name, null);
});

test('navigation wraps, rejects invalid indexes and does not duplicate selection events', () => {
  const { scene } = fixture();
  assert.equal(scene.previous(), true);
  assert.equal(scene.selectedIndex, 9);
  scene.next();
  assert.equal(scene.selectedIndex, 0);
  const events = scene.events.length;
  scene.select(0);
  assert.equal(scene.events.length, events);
  for (const index of [-2, 10, 1.5, '2', NaN, Infinity]) {
    assert.equal(scene.select(index), false);
    assert.equal(scene.open(index), false);
    assert.equal(scene.selectedIndex, 0);
  }
  scene.open();
  assert.equal(scene.select(-1), false);
  scene.previous();
  assert.equal(scene.selectedIndex, 9);
  assert.equal(scene.isOpen, true);
});

test('hover displacement and real sway are replaced safely on rapid navigation', () => {
  const { scene, animations } = fixture();
  scene.select(4);
  assert.match(scene._buttons[3].properties.get('--offset'), /\* -/);
  assert.match(scene._buttons[5].properties.get('--offset'), /\* 0\./);
  assert.match(scene._buttons[4].properties.get('--offset'), /\* 0\)/);
  const old = [...scene._animations];
  assert.ok(old.length >= 10);
  assert.notEqual(old[0].keyframes[1].transform, old[0].keyframes[0].transform);
  scene.select(8);
  assert.ok(old.every(animation => animation.cancelled));
  assert.ok(scene._animations.size <= 20);
  scene.reset();
  assert.equal(scene._animations.size, 0);
  assert.ok(animations.every(animation => animation.cancelled));
  assert.equal(scene.selectedIndex, -1);
});

test('material settings clamp/default and labels are assigned as safe text', () => {
  const { scene } = fixture();
  scene._syncMaterial();
  assert.equal(scene.properties.get('--separation'), '4.8cqw');
  assert.equal(scene.properties.get('--duration'), '1.45s');
  scene.setAttribute('refraction', '-3');
  assert.equal(scene.properties.get('--separation'), '0cqw');
  scene.setAttribute('refraction', 'Infinity');
  assert.equal(scene.properties.get('--separation'), '4.8cqw');
  scene.setAttribute('blur', '100');
  assert.equal(scene.properties.get('--rack-blur'), '15px');
  scene.setAttribute('elasticity', '');
  assert.equal(scene.properties.get('--duration'), '1.45s');
  scene.setAttribute('glow', 'NaN');
  assert.equal(scene.properties.get('--print-saturation'), 1);
  scene.setAttribute('label', '<img src=x onerror=alert(1)>');
  assert.equal(scene._brand.textContent, '<img src=x onerror=alert(1)>');
  scene.reset();
  assert.equal(scene.getAttribute('blur'), '100');
});

test('information opened from the viewer returns to the viewer and restores focus', () => {
  const { scene, heading, description } = fixture();
  scene.open(6);
  const focus = { focus() { this.focused = true; } };
  scene._infoFocus = focus;
  scene._infoReturnView = 'detail';
  scene._setView('availability');
  assert.equal(heading.textContent, 'The collection.');
  assert.equal(description.textContent, 'Made This Flowers Tee');
  assert.equal(scene._panel.hidden, false);
  scene.close();
  assert.equal(scene.isOpen, true);
  assert.equal(scene.selectedIndex, 6);
  assert.equal(focus.focused, true);
  scene.close();
  assert.equal(scene.isOpen, false);
});

test('complete autoplay choreography browses, opens, switches, closes and loops', () => {
  const { scene, timers, advance } = fixture();
  scene._visible = true;
  scene.setAttribute('autoplay', '');
  const expected = [1, 2, 4, 5, 6, 6, 5, 4, 2, -1, 8, 1, -1, 1];
  expected.forEach((index, step) => {
    advance((step + 1) * 1500);
    assert.equal(scene.selectedIndex, index);
    assert.equal(scene.isOpen, step >= 5 && step <= 8);
    assert.equal(timers.size, 1);
  });
  scene.next();
  assert.equal(timers.size, 0);
  scene.reset();
  assert.equal(timers.size, 1);
  assert.equal(scene.selectedIndex, -1);
});

test('visibility, static, zero motion, reduced motion and disconnect stop playback work', () => {
  const { scene, timers, context } = fixture();
  scene._visible = true;
  scene.setAttribute('autoplay', '');
  assert.equal(timers.size, 1);
  context.document.hidden = true;
  scene._syncPlayback();
  assert.equal(timers.size, 0);
  assert.equal(scene.hasAttribute('data-paused'), true);
  context.document.hidden = false;
  scene._syncPlayback();
  assert.equal(timers.size, 1);
  scene.select(5);
  scene.setAttribute('elasticity', '0');
  assert.equal(scene._animations.size, 0);
  assert.equal(scene.hasAttribute('data-still'), true);
  scene.open(6);
  assert.equal(scene.isOpen, true);
  assert.equal(scene._animations.size, 0);
  scene.setAttribute('elasticity', '1');
  scene._motion.matches = true;
  scene._syncMaterial();
  scene.reset();
  assert.equal(timers.size, 0);
  scene._motion.matches = false;
  scene.setAttribute('static', '');
  scene.reset();
  assert.equal(timers.size, 0);
  scene.attributes.delete('static');
  scene._syncMaterial();
  scene.reset();
  assert.equal(timers.size, 1);
  const events = scene._events;
  scene._observer = { disconnect() { this.disconnected = true; } };
  scene.disconnectedCallback();
  assert.equal(timers.size, 0);
  assert.equal(events.aborted, true);
  assert.equal(scene._observer.disconnected, true);
  assert.equal(scene.hasAttribute('data-paused'), true);
});

test('two portfolio instances retain independent selection and playback state', () => {
  const one = fixture().scene;
  const two = fixture().scene;
  one.open(9);
  two.select(3);
  one.reset();
  assert.equal(one.selectedIndex, -1);
  assert.equal(two.selectedIndex, 3);
  assert.equal(two.isOpen, false);
});

test('interaction-only scenes stay idle even with autoplay and after reset', () => {
  const { scene, timers, advance } = fixture();
  scene._visible = true;
  scene.setAttribute('autoplay', '');
  assert.equal(timers.size, 1);
  scene.setAttribute('interaction-only', '');
  assert.equal(timers.size, 0);
  scene.reset();
  advance(30000);
  assert.equal(scene.selectedIndex, -1);
  assert.equal(scene.isOpen, false);
  assert.equal(timers.size, 0);
  scene.select(6);
  assert.ok(scene._animations.size > 0);
  scene.open(6);
  assert.equal(scene.isOpen, true);
  assert.match(source, /:host\(\[interaction-only\]\) \.ticker-track\{animation:none\}/);
});

test('interrupted fabric sway starts from the visible pose, including distant settling garments', () => {
  const { scene } = fixture();
  scene.select(3);
  const fabric = scene._buttons[3].querySelectorAll()[0];
  fabric.transform = 'matrix(0.9998, 0.017, -0.017, 0.9998, 0, 0)';
  scene.select(9);
  const replacement = [...scene._animations].find(animation => animation.target === fabric);
  assert.equal(replacement.keyframes[0].transform, fabric.transform);
  assert.equal(replacement.keyframes.at(-1).transform, 'rotate(0deg)');
  assert.equal(replacement.options.easing, 'cubic-bezier(.4,0,.2,1)');
  assert.equal(replacement.options.duration, 1700);
  fabric.transform = 'matrix(0.9999, -0.01, 0.01, 0.9999, 0, 0)';
  scene.select(8);
  const distant = [...scene._animations].find(animation => animation.target === fabric);
  assert.equal(distant.keyframes[0].transform, fabric.transform);
  assert.equal(distant.keyframes[1].transform, 'rotate(0deg)');
});

test('garment meshes contain curved front/back panels, side volume, and distinct open sleeves', () => {
  const { context } = fixture();
  const positions = type => {
    const mesh = context.clothTest.clothMesh(type);
    assert.equal(mesh.length % 27, 0);
    assert.ok(mesh.every(Number.isFinite));
    const vertices = [];
    for (let i = 0; i < mesh.length; i += 9) {
      assert.ok(Math.hypot(mesh[i + 3], mesh[i + 4], mesh[i + 5]) > 0);
      vertices.push(Array.from(mesh.slice(i, i + 3)));
    }
    return vertices;
  };
  const tee = positions('tee'), long = positions('long');
  assert.ok(tee.some(([x, y, z]) => x > 110 && x < 130 && y > 100 && z > 16));
  assert.ok(tee.some(([x, y, z]) => x > 110 && x < 130 && y > 100 && z < -16));
  assert.ok(tee.some(([x, , z]) => x < 35 && Math.abs(z) > 5));
  assert.ok(long.some(([x, y]) => x < 50 && y > 250));
  assert.ok(!tee.some(([x, y]) => x < 50 && y > 200));
  // No triangle caps the hem across the front/back middle: it stays hollow.
  for (let i = 0; i < tee.length; i += 3) {
    const triangle = tee.slice(i, i + 3);
    if (triangle.every(([x, y]) => x > 85 && x < 155 && y > 260)) {
      assert.ok(triangle.every(([, , z]) => z > 0) || triangle.every(([, , z]) => z < 0));
    }
  }
  assert.match(source, /float free=max\(hem,sleeve\)/);
  assert.match(source, /p\.z\+=u_cloth\.y\*free\*ripple/);
});

test('collar is a rounded hollow binding and sleeves have flattened curved drape', () => {
  const { context } = fixture();
  const mesh = context.clothTest.clothMesh('long');
  const binding = [], sleeve = [];
  for (let i = 0; i < mesh.length; i += 9) {
    const position = Array.from(mesh.slice(i, i + 3));
    if (mesh[i + 8] === -1) binding.push(position);
    if (position[0] < 58 && position[1] > 125 && position[1] < 235) sleeve.push(position);
  }
  assert.ok(binding.length > 1000, 'collar must be real rounded geometry');
  assert.ok(binding.some(([x, y, z]) => x > 110 && x < 130 && y > 64 && z > 14));
  assert.ok(binding.some(([x, y, z]) => x > 110 && x < 130 && y < 60 && z < -14));
  assert.ok(binding.every(([, , z]) => Math.abs(z) <= 18), 'binding stays thin, not cylindrical neck stock');
  assert.ok(binding.every(([x, , z]) => Math.abs(x - 120) > 28 || Math.abs(z) > 7), 'no cap fills the neckline');
  assert.ok(sleeve.length > 100);
  assert.ok(sleeve.every(([, , z]) => Math.abs(z) < 13), 'hanging sleeve is flattened, not a rigid round pipe');
  const upper = sleeve.filter(([, y]) => y > 125 && y < 145).map(([x]) => x);
  const elbow = sleeve.filter(([, y]) => y > 185 && y < 205).map(([x]) => x);
  const lower = sleeve.filter(([, y]) => y > 210 && y < 230).map(([x]) => x);
  assert.ok(Math.min(...elbow) < Math.min(...upper) - 1 && Math.min(...elbow) < Math.min(...lower) - .5,
    'silhouette drapes outward at the elbow, then inward toward the cuff rather than tapering linearly');
});

test('hover easing accelerates gently and renderer follows the full slower transition', () => {
  const { scene } = fixture();
  let wakeDuration = 0;
  scene._cloth = { wake(seconds) { wakeDuration = seconds; }, pause() {} };
  scene._syncMaterial();
  assert.equal(scene.properties.get('--duration'), '1.45s');
  assert.ok(wakeDuration > 1.45);
  scene.setAttribute('elasticity', '2');
  assert.equal(scene.properties.get('--duration'), '2.9s');
  assert.ok(wakeDuration > 2.9);
  assert.match(source, /transition-timing-function:cubic-bezier\(\.4,0,\.22,1\)/);
});

function clothFixture() {
  const f = fixture();
  f.scene._visible = true;
  const cloth = Object.create(f.context.clothTest.PortfolioCloth.prototype);
  Object.assign(cloth, {
    scene: f.scene, ready: true, disposed: false,
    states: Array.from({ length: 10 }, () => ({ bend: 0, velocity: 0, flutter: 0, flutterVelocity: 0 })),
    draw() { this.draws = (this.draws || 0) + 1; }
  });
  f.scene._cloth = cloth;
  return { ...f, cloth };
}

test('3D cloth retargets springs without snapping and stops drawing after settling', () => {
  const { scene, cloth, frame, frames } = clothFixture();
  scene.select(4);
  assert.equal(scene._animations.size, 0, 'WebGL must not also animate hidden SVG fabric');
  assert.equal(frames.size, 1);
  frame(16);frame(32);frame(48);
  const bend = cloth.states[4].bend;
  assert.notEqual(bend, 0);
  assert.notEqual(cloth.states[4].flutter, 0);
  assert.equal(cloth.states[9].bend, 0);
  scene.select(5);
  assert.equal(cloth.states[4].bend, bend, 'retarget must preserve the current cloth pose');
  assert.equal(frames.size, 1);
  for (let now = 64; now <= 8000; now += 16) frame(now);
  assert.equal(frames.size, 0);
  assert.equal(cloth.frame, 0);
  assert.ok(cloth.states.every(state => Object.values(state).every(value => value === 0)));
  const draws = cloth.draws;
  frame(16000);
  assert.equal(cloth.draws, draws, 'manual details have no idle render loop');
});

test('rapid pointer impulses stay bounded instead of whipping sleeves', () => {
  const { cloth, frames } = clothFixture();
  for (let i = 0; i < 200; i++) cloth.nudge(4, 100);
  assert.equal(frames.size, 1);
  assert.ok(cloth.states.every(state => Math.abs(state.velocity) <= 66 && Math.abs(state.flutterVelocity) <= 48));
  assert.equal(cloth.states[9].velocity, 0);
});

test('cloth reset, motion disabling, and visibility leave no stale frame work', () => {
  const { scene, cloth, frame, frames, context } = clothFixture();
  scene.select(3);frame(16);
  scene.reset();
  assert.ok(cloth.states.every(state => state.bend === 0 && state.flutter === 0));
  frame(32);
  assert.equal(frames.size, 1, 'reset still draws the smooth CSS return to the rack');
  frame(1600);
  assert.equal(frames.size, 0);
  scene.select(4);frame(1616);
  scene.setAttribute('static', '');frame(1632);
  assert.equal(frames.size, 0);
  assert.ok(cloth.states.every(state => state.bend === 0 && state.velocity === 0));
  scene.open(5);
  frame(1648);
  assert.equal(scene.isOpen, true);
  assert.equal(frames.size, 0);
  scene.attributes.delete('static');scene._syncMaterial();scene.select(6);
  scene._visible = false;scene._syncPlayback();
  assert.equal(frames.size, 0);
  cloth.nudge(6, 20);
  assert.equal(frames.size, 0, 'offscreen impulses must not schedule rendering');
  scene._visible = true;context.document.hidden = true;scene._syncPlayback();
  assert.equal(frames.size, 0);
});

test('WebGL failure preserves SVG fallback and disposal releases every graphics resource once', () => {
  const { scene, cloth, context, frames } = clothFixture();
  let removed = 0;
  context.document.createElement = () => ({ setAttribute() {}, getContext: () => null, remove() { removed++; } });
  scene._site.appendChild = () => {};
  const unavailable = new context.clothTest.PortfolioCloth(scene);
  assert.equal(unavailable.disposed, true);
  assert.equal(scene.hasAttribute('data-cloth-renderer'), false);
  assert.equal(removed, 1);
  const deleted = [];
  cloth.gl = Object.fromEntries(['Buffer', 'Texture', 'Program', 'Shader'].map(type => [`delete${type}`, value => deleted.push([type, value])]));
  cloth.meshes = new Map([['tee', { buffer: 1 }], ['long', { buffer: 2 }]]);
  cloth.textures = [3, 4];cloth.program = 5;cloth.shaders = [6];
  cloth.canvas = { remove() { removed++; } };
  cloth.resize = { disconnect() { deleted.push(['Observer', 7]); } };
  scene.setAttribute('data-cloth-renderer', 'webgl');
  cloth.wake();
  assert.equal(frames.size, 1);
  scene.disconnectedCallback();cloth.dispose();
  assert.equal(frames.size, 0);
  assert.equal(removed, 2);
  assert.equal(deleted.length, 7);
  assert.equal(scene.hasAttribute('data-cloth-renderer'), false);
  assert.equal(scene._cloth, null);
});

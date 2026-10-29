import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/postage-stamps.js', import.meta.url), 'utf8');

function fixture() {
  const registry = new Map();
  class Element {
    constructor() {
      this.attributes = new Map();
      this.properties = new Map();
      this.events = [];
      this.style = { setProperty: (name, value) => this.properties.set(name, value) };
    }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    hasAttribute(name) { return this.attributes.has(name); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); this.attributeChangedCallback?.(); }
    dispatchEvent(event) { this.events.push(event); }
  }
  const context = {
    HTMLElement: Element,
    customElements: { get: name => registry.get(name), define: (name, type) => registry.set(name, type) },
    cancelAnimationFrame: () => {},
    CustomEvent: class { constructor(type, options) { this.type = type; Object.assign(this, options); } }
  };
  const load = () => runInNewContext(`(() => { ${source.replace(/^export /gm, '')} })();`, context);
  load();
  return { scene: new (registry.get('postage-stamps-scene'))(), registry, load };
}

test('postage scene is standalone and registers safely when loaded twice', () => {
  const { registry, load } = fixture();
  load();
  assert.equal(registry.size, 1);
  assert.doesNotMatch(source, /^import |<video|<img|https?:\/\//m);
});

test('appearance attributes use safe defaults and clamp invalid values', () => {
  const { scene } = fixture();
  scene._syncMaterial();
  assert.equal(scene.properties.get('--spread'), 1);
  assert.equal(scene.properties.get('--paper-softness'), '0px');
  assert.equal(scene.properties.get('--ink-saturation'), 1);
  scene.setAttribute('refraction', '999');
  assert.equal(scene.properties.get('--spread'), 100 / 36);
  scene.setAttribute('blur', '-4');
  assert.equal(scene.properties.get('--paper-softness'), '0px');
  scene.setAttribute('glow', 'NaN');
  assert.equal(scene.properties.get('--ink-saturation'), 1);
  scene.setAttribute('refraction', '');
  assert.equal(scene.properties.get('--spread'), 1);
  scene.setAttribute('static', '');
  assert.equal(scene.properties.get('--pointer-x'), '0deg');
});

test('custom stamp label is text, not HTML', () => {
  const { scene } = fixture();
  const label = {};
  scene.shadowRoot = { querySelector: () => label };
  scene.setAttribute('label', '<b>My brand</b>');
  assert.equal(label.textContent, '<b>My brand</b>');
});

test('stamp selection and reset expose accessible state and composed events', () => {
  const { scene } = fixture();
  scene._buttons = Array.from({ length: 3 }, () => ({ setAttribute(name, value) { this[name] = value; } }));
  scene._select(2);
  assert.deepEqual(scene._buttons.map(button => button['aria-pressed']), ['false', 'false', 'true']);
  assert.equal(scene.events[0].detail.index, 2);
  assert.equal(scene.events[0].bubbles, true);
  assert.equal(scene.events[0].composed, true);
  scene.reset();
  assert.ok(scene._buttons.every(button => button['aria-pressed'] === 'false'));
  assert.equal(scene.events.at(-1).detail.index, -1);
  assert.equal(scene.properties.get('--pointer-y'), '0deg');
});

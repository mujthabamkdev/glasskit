import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/platinum-visa-card.js', import.meta.url), 'utf8');

function fixture() {
  const registry = new Map();
  const cancelled = [];
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
    toggleAttribute(name, force) {
      if (force) this.attributes.set(name, ''); else this.attributes.delete(name);
      this.attributeChangedCallback?.();
    }
    dispatchEvent(event) { this.events.push(event); }
  }
  const context = {
    HTMLElement: Element,
    customElements: { get: name => registry.get(name), define: (name, type) => registry.set(name, type) },
    cancelAnimationFrame: id => cancelled.push(id),
    CustomEvent: class { constructor(type, options) { this.type = type; Object.assign(this, options); } }
  };
  const load = () => runInNewContext(`(() => { ${source.replace(/^export /gm, '')} })();`, context);
  load();
  return { scene: new (registry.get('platinum-visa-card-scene'))(), registry, load, cancelled };
}

test('platinum card module registers safely and renders six real layers without remote assets', () => {
  const { registry, load } = fixture();
  load();
  assert.equal(registry.size, 1);
  assert.equal([...source.matchAll(/<span class="layer /g)].length, 6);
  assert.doesNotMatch(source, /^import |<video|<img|https?:\/\//m);
});

test('platinum material settings clamp invalid values and static resets pointer effects', () => {
  const { scene } = fixture();
  scene._syncMaterial();
  assert.equal(scene.properties.get('--coat-frost'), '0px');
  assert.equal(scene.properties.get('--layer-gap'), `${1.6 + 36 * .045}cqw`);
  scene.setAttribute('refraction', '1000');
  assert.equal(scene.properties.get('--layer-gap'), `${1.6 + 100 * .045}cqw`);
  scene.setAttribute('blur', '-5');
  assert.equal(scene.properties.get('--coat-frost'), '0px');
  scene.setAttribute('glow', 'NaN');
  assert.equal(scene.properties.get('--sheen'), .7 * .7);
  scene.setAttribute('static', '');
  assert.equal(scene.properties.get('--pitch'), '0deg');
  assert.equal(scene.properties.get('--sheen-x'), '50%');
});

test('toggle and reset synchronize expanded state, accessible labels, and composed events', () => {
  const { scene } = fixture();
  const hint = {};
  const holder = {};
  scene.shadowRoot = { querySelector: selector => selector === '.hint' ? hint : holder };
  scene._button = { dataset: {}, setAttribute(name, value) { this[name] = value; } };
  scene.toggle();
  assert.equal(scene.hasAttribute('expanded'), true);
  assert.equal(scene._button['aria-pressed'], 'true');
  assert.equal(scene._button['aria-label'], 'Collapse platinum card layers');
  assert.equal(scene._button.dataset.expanded, 'true');
  assert.equal(scene.events[0].detail.expanded, true);
  assert.equal(scene.events[0].bubbles, true);
  assert.equal(scene.events[0].composed, true);
  scene.reset();
  assert.equal(scene.hasAttribute('expanded'), false);
  assert.equal(scene._button['aria-pressed'], 'false');
  assert.equal(scene.events.at(-1).detail.expanded, false);
  scene.reset();
  assert.equal(scene.events.length, 2);
});

test('cardholder customization is plain text and disconnect cancels queued pointer work', () => {
  const { scene, cancelled } = fixture();
  const holder = {};
  scene.shadowRoot = { querySelector: () => holder };
  scene.setAttribute('cardholder', '<b>My name</b>');
  assert.equal(holder.textContent, '<b>My name</b>');
  let aborted = false;
  scene._events = { abort() { aborted = true; } };
  scene._frame = 42;
  scene.disconnectedCallback();
  assert.equal(aborted, true);
  assert.ok(cancelled.includes(42));
  assert.equal(scene._frame, 0);
  assert.equal(scene._events, null);
});

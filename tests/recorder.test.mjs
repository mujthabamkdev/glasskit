import test from 'node:test';
import assert from 'node:assert/strict';

// A small DOM boundary stub, not a renderer. Native recording APIs are mocked so
// capture lifetime and permission races can be exercised without a microphone.
class Part extends EventTarget {
  constructor() { super(); this.attributes = new Map(); this.style = { setProperty() {} }; this.hidden = false; this.textContent = ''; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  pause() {} load() {} click() { this.clicked = true; }
}
class Shadow {
  constructor() { this.parts = new Map(); }
  querySelector(name) {
    if (!this.parts.has(name)) {
      const part = new Part();
      if (name === '.outline') {
        const paths = [new Part(), new Part(), new Part(), new Part()];
        part.querySelectorAll = () => paths;
      }
      this.parts.set(name, part);
    }
    return this.parts.get(name);
  }
}
globalThis.HTMLElement = class extends EventTarget {
  constructor() { super(); this.attributes = new Map(); this.dataset = {}; this.isConnected = false; }
  attachShadow() { this.shadowRoot = new Shadow(); return this.shadowRoot; }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  hasAttribute(name) { return this.attributes.has(name); }
  setAttribute(name, value) {
    const oldValue = this.getAttribute(name); this.attributes.set(name, String(value));
    if (this.constructor.observedAttributes.includes(name)) this.attributeChangedCallback(name, oldValue, String(value));
  }
  removeAttribute(name) {
    const oldValue = this.getAttribute(name); this.attributes.delete(name);
    if (oldValue !== null && this.constructor.observedAttributes.includes(name)) this.attributeChangedCallback(name, oldValue, null);
  }
};
globalThis.ResizeObserver = class { observe() {} disconnect() {} };
globalThis.isSecureContext = true;
const { LiquidRecorder, LiquidGlass, formatTime } = await import('../src/index.js');

class Track extends EventTarget { stop() { this.stops = (this.stops || 0) + 1; } }
function stream() { const track = new Track(); return { track, getTracks: () => [track] }; }
class RecorderMock {
  static instances = [];
  static supported = 'audio/webm;codecs=opus';
  static isTypeSupported(type) { return type === this.supported; }
  constructor(capture, options) { this.stream = capture; this.mimeType = options?.mimeType || 'audio/webm'; this.state = 'inactive'; RecorderMock.instances.push(this); }
  start() { this.state = 'recording'; }
  stop() {
    this.state = 'inactive';
    queueMicrotask(() => {
      this.ondataavailable?.({ data: new Blob(['captured-audio'], { type: this.mimeType }) });
      this.onstop?.();
    });
  }
}
globalThis.MediaRecorder = RecorderMock;
function media(getUserMedia) {
  Object.defineProperty(globalThis, 'navigator', { value: { mediaDevices: { getUserMedia } }, configurable: true });
}
function mount() { const element = new LiquidRecorder(); element.isConnected = true; element.connectedCallback(); return element; }
const flush = () => new Promise((resolve) => setImmediate(resolve));

test('timer is stable at minute/hour boundaries', () => {
  assert.equal(formatTime(59999), '00:59');
  assert.equal(formatTime(60000), '01:00');
  assert.equal(formatTime(3600000), '01:00:00');
  assert.equal(formatTime(-40), '00:00');
});

test('connecting never requests microphone access; demo records no audio', async () => {
  let requests = 0; media(async () => { requests++; return stream(); });
  const element = mount(); assert.equal(requests, 0);
  element.setAttribute('demo', '');
  await element.start(); assert.equal(element.state, 'recording');
  let detail; element.addEventListener('record-stop', (event) => { detail = event.detail; });
  element.stop();
  assert.equal(element.state, 'recorded'); assert.equal(requests, 0);
  assert.equal(detail.demo, true); assert.equal(detail.blob, null); assert.equal(detail.url, null);
  element.reset();
});

test('real stop captures a blob, releases tracks, exposes playback and download', async () => {
  const capture = stream(); media(async () => capture);
  const element = mount(); let detail;
  element.addEventListener('record-stop', (event) => { detail = event.detail; });
  await element.start(); assert.equal(element.state, 'recording');
  element.stop(); assert.equal(element.state, 'processing'); await flush();
  assert.equal(element.state, 'recorded'); assert.equal(capture.track.stops, 1);
  assert.ok(detail.blob instanceof Blob); assert.ok(detail.blob.size > 0);
  assert.equal(detail.mimeType, 'audio/webm;codecs=opus'); assert.match(detail.url, /^blob:/);
  assert.equal(element.shadowRoot.querySelector('.result').hidden, false);
  assert.equal(element.shadowRoot.querySelector('.download').download, 'recording.webm');
  assert.equal(await (await fetch(detail.url)).text(), 'captured-audio');
  element.download(); assert.equal(element.shadowRoot.querySelector('.download').clicked, true);
  element.reset(); await assert.rejects(fetch(detail.url));
});

test('MP4 audio negotiates an M4A download and supports filename updates', async () => {
  RecorderMock.supported = 'audio/mp4'; media(async () => stream());
  const element = mount(); element.setAttribute('download-name', 'voice.webm');
  await element.start(); element.stop(); await flush();
  assert.equal(element.blob.type, 'audio/mp4');
  assert.equal(element.shadowRoot.querySelector('.download').download, 'voice.m4a');
  element.setAttribute('download-name', 'new-take');
  assert.equal(element.shadowRoot.querySelector('.download').download, 'new-take.m4a');
  element.reset(); RecorderMock.supported = 'audio/webm;codecs=opus';
});

test('reset during permission request releases a subsequently granted stream', async () => {
  let grant; const capture = stream(); media(() => new Promise((resolve) => { grant = resolve; }));
  const element = mount(); const pending = element.start();
  assert.equal(element.state, 'requesting'); element.reset(); grant(capture); await pending;
  assert.equal(element.state, 'idle'); assert.equal(capture.track.stops, 1); assert.equal(element.blob, null);
});

test('double start causes only one microphone request', async () => {
  let grant, requests = 0; media(() => { requests++; return new Promise((resolve) => { grant = resolve; }); });
  const element = mount(); const pending = element.start(); await element.start();
  assert.equal(requests, 1); grant(stream()); await pending; element.reset();
});

test('permission denial is recoverable and emits a readable composed event', async () => {
  media(async () => { throw new DOMException('Permission denied', 'NotAllowedError'); });
  const element = mount(); let event;
  element.addEventListener('record-error', (value) => { event = value; });
  await element.start(); assert.equal(element.state, 'idle');
  assert.match(event.detail.message, /Microphone access was denied/);
  assert.equal(event.bubbles, true); assert.equal(event.composed, true);
  media(async () => stream()); await element.start(); assert.equal(element.state, 'recording'); element.reset();
});

test('removing an active element releases capture without a stale result', async () => {
  const capture = stream(); media(async () => capture);
  const element = mount(); await element.start();
  element.isConnected = false; element.disconnectedCallback(); await flush();
  assert.equal(capture.track.stops, 1); assert.equal(element.state, 'idle'); assert.equal(element.recordingUrl, null);
});

test('disabling an active capture releases the microphone', async () => {
  const capture = stream(); media(async () => capture);
  const element = mount(); await element.start(); element.setAttribute('disabled', ''); await flush();
  assert.equal(capture.track.stops, 1); assert.equal(element.state, 'idle');
  assert.equal(element.shadowRoot.querySelector('.action').disabled, true);
  await element.start(); assert.equal(element.state, 'idle');
});

test('external microphone ending finalizes the recording', async () => {
  const capture = stream(); media(async () => capture);
  const element = mount(); await element.start(); capture.track.dispatchEvent(new Event('ended')); await flush();
  assert.equal(element.state, 'recorded'); assert.ok(element.blob.size > 0); element.reset();
});

test('insecure context fails clearly without requesting a microphone', async () => {
  let requests = 0; media(async () => { requests++; return stream(); });
  globalThis.isSecureContext = false; const element = mount(); await element.start();
  assert.equal(requests, 0); assert.match(element.shadowRoot.querySelector('.message').textContent, /HTTPS/);
  globalThis.isSecureContext = true;
});

test('liquid contour changes locally under pointer force while dimensions stay stable', () => {
  const glass = new LiquidGlass(); glass._geometry = { width: 560, height: 158, radius: 79 };
  glass._drawShape(); const path = glass.shadowRoot.querySelector('.outline').querySelectorAll()[0];
  const original = path.getAttribute('d');
  glass._fluid = { x: 280, y: 0, amplitude: -12, velocity: 0 }; glass._drawShape();
  assert.notEqual(path.getAttribute('d'), original);
  assert.equal(glass.shadowRoot.querySelector('.outline').getAttribute('width'), '584');
  assert.equal(glass.shadowRoot.querySelector('.outline').getAttribute('height'), '182');
  assert.match(glass.shadowRoot.querySelector('.backdrop').style.clipPath, /^path\("M/);
  glass._fluid.amplitude = 0; glass._drawShape(); assert.equal(path.getAttribute('d'), original);
});

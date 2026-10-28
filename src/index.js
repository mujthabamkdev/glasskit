/** Glasskit — self-contained, dependency-free Web Components. */
const HTMLElementBase = globalThis.HTMLElement || class {};
const SVG_NS = 'http://www.w3.org/2000/svg';
let filterCounter = 0;

export function formatTime(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(seconds / 60);
  const pad = (value) => String(value).padStart(2, '0');
  return minutes >= 60
    ? `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:${pad(seconds % 60)}`
    : `${pad(minutes)}:${pad(seconds % 60)}`;
}

function numberAttribute(element, name, fallback, min, max) {
  const raw = element.getAttribute(name);
  const value = raw === null || raw.trim() === '' ? fallback : Number(raw);
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : fallback));
}

const surfaceStyles = `
  :host {
    display: inline-block; position: relative; border-radius: var(--glass-radius, 28px);
    color: var(--glass-color, inherit); vertical-align: middle;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .surface {
    position: relative; width: 100%; height: 100%; border-radius: inherit;
    box-shadow: var(--glass-shadow, 0 18px 48px -18px rgb(4 16 40 / .5));
    isolation: isolate;
  }
  .backdrop {
    position: absolute; inset: -12px; z-index: -2; border-radius: inherit;
    background: var(--glass-tint, rgb(228 239 255 / var(--glass-opacity, .12)));
    -webkit-backdrop-filter: blur(var(--glass-blur, 5px)) saturate(var(--glass-saturation, 1.55));
    backdrop-filter: blur(var(--glass-blur, 5px)) saturate(var(--glass-saturation, 1.55));
  }
  .light {
    position: absolute; inset: -12px; border-radius: inherit; z-index: -1; pointer-events: none;
    background: var(--glass-light, linear-gradient(140deg, rgb(255 255 255 / .18), transparent 36%, rgb(255 255 255 / .02) 60%, rgb(255 255 255 / .1)));
    opacity: calc(1 - .3 * var(--_liquid-depth, 0));
  }
  .glint {
    position: absolute; inset: -12px; z-index: -1; pointer-events: none;
    background: radial-gradient(ellipse 100px 45px at var(--pointer-x, 25%) var(--pointer-y, 0%), rgb(255 255 255 / var(--glint-opacity, 0)), transparent 85%);
  }
  .depth {
    position: absolute; inset: -12px; z-index: -1; pointer-events: none;
    background: var(--glass-depth, linear-gradient(180deg, rgb(6 30 72 / .2), transparent 30%, transparent 70%, rgb(151 204 255 / .17)));
  }
  .outline { position: absolute; left: -12px; top: -12px; overflow: visible; pointer-events: none; opacity: var(--glass-rim-opacity, .95); }
  .outline path { fill: none; vector-effect: non-scaling-stroke; }
  .outline .outline-clip { fill: #fff; }
  .surface-rim { opacity: calc(1 - var(--_liquid-depth, 0)); }
  .meniscus, .liquid-rim { opacity: var(--_liquid-depth, 0); }
  .meniscus-body { filter: blur(3px); }
  .meniscus-caustic { filter: blur(1.8px); }
  .meniscus-sheen { filter: blur(.7px); }
  .rim { display: none;
  }
  .rim {
    position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; pointer-events: none;
    background: linear-gradient(155deg, rgb(255 255 255 / .9) 2%, rgb(220 235 255 / .28) 24%, rgb(161 204 255 / .72) 40%, rgb(255 222 186 / .5) 65%, rgb(255 255 255 / .55) 82%, rgb(160 191 255 / .4));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    opacity: var(--glass-rim-opacity, .95);
  }
  .content { position: relative; border-radius: inherit; }
  :host([appearance="dark"]) {
    --glass-tint: rgb(8 18 38 / .22); --glass-color: #fff;
  }
  @media (prefers-reduced-transparency: reduce) {
    .backdrop { background: var(--glass-solid, #e8eef7); backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    :host([appearance="dark"]) { --glass-solid: #162338; }
  }
  @media (forced-colors: active) {
    .surface { border: 1px solid CanvasText; }
    .backdrop { background: Canvas; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    .light, .rim, .glint, .depth, .outline { display: none; }
  }
`;

/** A rounded surface; arbitrary slotted HTML stays in the host document. */
export class LiquidGlass extends HTMLElementBase {
  static get observedAttributes() { return ['blur', 'refraction', 'radius', 'elasticity', 'static', 'style', 'appearance']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._filterId = `glasskit-refraction-${++filterCounter}`;
    this.shadowRoot.innerHTML = `<style>${surfaceStyles}</style>
      <div class="surface" part="surface">
        <div class="backdrop" part="backdrop"></div><div class="depth"></div><div class="light"></div><div class="glint"></div>
        <div class="content" part="content"><slot></slot></div>
        <svg class="outline" aria-hidden="true">
          <defs>
            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#c7e0ff" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset=".7" stop-color="#ddc8a7" stop-opacity=".5"/><stop offset="1" stop-color="#e6f3ff" stop-opacity=".8"/></linearGradient>
            <linearGradient id="liquid-depth" x1=".1" y1="0" x2=".85" y2="1"><stop stop-color="#081c2c" stop-opacity=".72"/><stop offset=".28" stop-color="#132e41" stop-opacity=".42"/><stop offset=".52" stop-color="#19364b" stop-opacity=".08"/><stop offset=".8" stop-color="#d9edeb" stop-opacity=".38"/><stop offset="1" stop-color="#fbefd4" stop-opacity=".62"/></linearGradient>
            <linearGradient id="liquid-caustic" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#eff9ff" stop-opacity=".14"/><stop offset=".42" stop-color="#dbe9ec" stop-opacity=".02"/><stop offset=".68" stop-color="#cae0e8" stop-opacity=".16"/><stop offset="1" stop-color="#ffecd0" stop-opacity=".72"/></linearGradient>
            <linearGradient id="liquid-rim" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffdf5" stop-opacity=".96"/><stop offset=".2" stop-color="#dbe8e9" stop-opacity=".5"/><stop offset=".43" stop-color="#8aadb9" stop-opacity=".16"/><stop offset=".64" stop-color="#e2ded3" stop-opacity=".42"/><stop offset=".84" stop-color="#fff9e9" stop-opacity=".88"/><stop offset="1" stop-color="#cce5e9" stop-opacity=".75"/></linearGradient>
            <clipPath id="${this._filterId}-clip"><path class="outline-clip"/></clipPath>
          </defs>
          <g class="meniscus" clip-path="url(#${this._filterId}-clip)">
            <path class="meniscus-body" stroke="url(#liquid-depth)" stroke-width="28"/>
            <path stroke="#071c2a" stroke-opacity=".22" stroke-width="7"/>
            <path class="meniscus-caustic" stroke="url(#liquid-caustic)" stroke-width="4"/>
            <path class="meniscus-sheen" stroke="url(#liquid-rim)" stroke-opacity=".55" stroke-width="3"/>
          </g>
          <g class="surface-rim">
            <path class="outline-shadow" stroke="#061d48" stroke-opacity=".4" stroke-width="5"/><path class="outline-soft" stroke="#b8d5ff" stroke-opacity=".26" stroke-width="7"/><path class="outline-blue" stroke="#438dff" stroke-opacity=".65" stroke-width="1.7" transform="translate(1 1.2)"/><path class="outline-gold" stroke="#ffdfa9" stroke-opacity=".65" stroke-width="1.1" transform="translate(-1 -1.2)"/><path class="outline-main" stroke="url(#rim)" stroke-width="1.2"/>
          </g>
          <g class="liquid-rim">
            <path stroke="#102d3a" stroke-opacity=".46" stroke-width="2.4"/>
            <path stroke="url(#liquid-rim)" stroke-opacity=".35" stroke-width="3"/>
            <path stroke="url(#liquid-rim)" stroke-width="1.15" transform="translate(-.25 -.4)"/>
          </g>
        </svg>
      </div>`;
    this._backdrop = this.shadowRoot.querySelector('.backdrop');
    this._resizeObserver = new ResizeObserver(() => this.refresh());
    this._fluid = { x: 0, y: 0, amplitude: 0, velocity: 0 };
    this._target = { x: 0, y: 0, amplitude: 0 };
    this.addEventListener('pointermove', (event) => this._onPointer(event));
    this.addEventListener('pointerleave', () => { this._target.amplitude = 0; this._lastPointer = null; this._startMotion(); });
  }

  connectedCallback() {
    this._resizeObserver.observe(this);
    this.refresh();
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect();
    cancelAnimationFrame(this._frame);
    cancelAnimationFrame(this._motionFrame);
    this._motionFrame = null;
    this._svg?.remove();
    this._svg = null;
    this._signature = null;
    this._fluid.amplitude = 0; this._fluid.velocity = 0; this._target.amplitude = 0;
    this._lastPointer = null;
  }

  attributeChangedCallback(name) {
    if (name === 'static' && this.hasAttribute('static')) {
      this._target.amplitude = 0;
      this._startMotion();
    }
    if (this.isConnected) this.refresh();
  }

  /** Refresh after a stylesheet/theme change that does not resize the surface. */
  refresh() {
    cancelAnimationFrame(this._frame);
    this._frame = requestAnimationFrame(() => this._updateFilter());
  }

  _updateFilter() {
    const style = getComputedStyle(this);
    const cssNumber = (name, fallback) => { const value = parseFloat(style.getPropertyValue(name)); return Number.isFinite(value) ? value : fallback; };
    const blur = numberAttribute(this, 'blur', cssNumber('--glass-blur', 5), 0, 40);
    const strength = numberAttribute(this, 'refraction', cssNumber('--glass-refraction', 36), 0, 100);
    const radius = numberAttribute(this, 'radius', cssNumber('--glass-radius', 28), 0, 10000);
    if (this.hasAttribute('radius')) this.shadowRoot.querySelector('.surface').style.borderRadius = `${radius}px`;
    else this.shadowRoot.querySelector('.surface').style.borderRadius = '';
    const saturation = style.getPropertyValue('--glass-saturation').trim() || '1.55';
    const fallback = `blur(${blur}px) saturate(${saturation})`;
    this._backdrop.style.webkitBackdropFilter = fallback;
    // Chromium currently supports SVG filters on backdrop-filter; other engines use CSS blur.
    const enhanced = /Chrom(e|ium)\//.test(navigator.userAgent) && CSS.supports('backdrop-filter', 'url("#x")');
    const { width, height } = this.getBoundingClientRect();
    // Build depth as the recorder spreads, leaving its resting circle's material intact.
    const spread = height ? Math.min(1, Math.max(0, (width / height - 1) / 1.8)) : 0;
    const thickness = Math.min(1, Math.max(0, cssNumber('--glass-thickness', 0))) * spread;
    this._geometry = { width, height, radius: Math.min(radius, width / 2, height / 2), thickness };
    this.shadowRoot.querySelector('.surface').style.setProperty('--_liquid-depth', String(thickness));
    this._drawShape();
    this.dataset.renderer = enhanced && strength > 0 ? 'refraction' : 'blur';
    if (!enhanced || strength === 0 || width === 0 || height === 0) {
      this._backdrop.style.backdropFilter = fallback;
      this._svg?.remove();
      this._svg = null;
      this._signature = null;
      return;
    }
    if (!this._svg) {
      this._svg = document.createElementNS(SVG_NS, 'svg');
      this._svg.setAttribute('aria-hidden', 'true');
      this._svg.setAttribute('width', '0');
      this._svg.setAttribute('height', '0');
      this._svg.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
      const filter = document.createElementNS(SVG_NS, 'filter');
      filter.id = this._filterId;
      filter.setAttribute('x', '0%'); filter.setAttribute('y', '0%');
      filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      this._map = document.createElementNS(SVG_NS, 'feImage');
      this._map.setAttribute('result', 'map'); this._map.setAttribute('preserveAspectRatio', 'none');
      this._displacement = document.createElementNS(SVG_NS, 'feDisplacementMap');
      this._displacement.setAttribute('in', 'SourceGraphic'); this._displacement.setAttribute('in2', 'map');
      this._displacement.setAttribute('xChannelSelector', 'R'); this._displacement.setAttribute('yChannelSelector', 'G');
      filter.append(this._map, this._displacement); this._svg.append(filter);
      (document.body || document.documentElement).append(this._svg);
    }
    const signature = `${Math.round(width)}:${Math.round(height)}:${radius}:${thickness.toFixed(3)}`;
    if (signature !== this._signature) {
      this._map.setAttribute('href', this._createMap(width + 24, height + 24, radius + 12));
      this._signature = signature;
    }
    this._displacement.setAttribute('scale', String(strength));
    this._backdrop.style.backdropFilter = `url("#${this._filterId}") ${fallback}`;
  }

  _onPointer(event) {
    if (event.pointerType === 'touch' || this.hasAttribute('static') || matchMedia('(prefers-reduced-motion: reduce)').matches || !this._points?.length) return;
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const now = performance.now();
    const speed = this._lastPointer ? Math.hypot(x - this._lastPointer.x, y - this._lastPointer.y) / Math.max(8, now - this._lastPointer.time) : .3;
    const closest = this._points.reduce((best, point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      return distance < best.distance ? { ...point, distance } : best;
    }, { distance: Infinity });
    const elasticity = numberAttribute(this, 'elasticity', 1, 0, 2);
    const reach = Math.min(110, this._geometry.height * .65);
    this._target = { x: closest.x, y: closest.y, amplitude: Math.min(13, (5 + speed * 9) * elasticity) * Math.max(0, 1 - closest.distance / reach) };
    if (!this._lastPointer) { this._fluid.x = closest.x; this._fluid.y = closest.y; }
    this._lastPointer = { x, y, time: now };
    this._startMotion();
  }

  _startMotion() {
    if (this._motionFrame || !this.isConnected || !this._geometry) return;
    let lastTime;
    const animate = (now) => {
      const elapsed = Math.min(32, Math.max(1, lastTime === undefined ? 1000 / 60 : now - lastTime));
      const step = elapsed / (1000 / 60);
      lastTime = now;
      const fluid = this._fluid;
      const follow = 1 - Math.exp(-elapsed / 95);
      fluid.x += (this._target.x - fluid.x) * follow;
      fluid.y += (this._target.y - fluid.y) * follow;
      // A passing pointer creates a swell that drains away, rather than holding a stretched rim.
      this._target.amplitude *= Math.exp(-elapsed / 180);
      fluid.velocity = (fluid.velocity + (this._target.amplitude - fluid.amplitude) * .045 * step) * Math.pow(.68, step);
      fluid.amplitude += fluid.velocity * step;
      this._drawShape();
      const glint = this.shadowRoot.querySelector('.glint');
      glint.style.setProperty('--pointer-x', `${fluid.x + 12}px`);
      glint.style.setProperty('--pointer-y', `${fluid.y + 12}px`);
      glint.style.setProperty('--glint-opacity', String(Math.min(.27, Math.abs(fluid.amplitude) / 45)));
      // The contour runs at display rate; regenerate the lens texture at most 20 times/sec.
      if (this._svg && (!this._lastMapTime || now - this._lastMapTime > 50)) {
        const { width, height, radius } = this._geometry;
        this._map.setAttribute('href', this._createMap(width + 24, height + 24, radius + 12));
        this._lastMapTime = now;
      }
      const settled = this._target.amplitude < .015 && Math.abs(fluid.velocity) < .015 && Math.abs(fluid.amplitude) < .015 && Math.abs(this._target.x - fluid.x) + Math.abs(this._target.y - fluid.y) < .3;
      if (settled) {
        fluid.amplitude = 0; fluid.velocity = 0; this._target.amplitude = 0;
        glint.style.setProperty('--glint-opacity', '0');
        this._drawShape(); this._motionFrame = null;
        if (this._svg) {
          const { width, height, radius } = this._geometry;
          this._map.setAttribute('href', this._createMap(width + 24, height + 24, radius + 12));
        }
      } else this._motionFrame = requestAnimationFrame(animate);
    };
    this._motionFrame = requestAnimationFrame(animate);
  }

  _edgePull(x, y) {
    if (Math.abs(this._fluid.amplitude) < .001) return 0;
    const spread = Math.min(124, Math.max(64, this._geometry.height * .72));
    const distance = ((x - this._fluid.x) ** 2 + (y - this._fluid.y) ** 2) / (spread * spread);
    // The broad return draws from neighboring liquid instead of stretching a narrow edge.
    return this._fluid.amplitude * 1.4 * (Math.exp(-distance) - .5 * Math.exp(-distance / 4));
  }

  _drawShape() {
    const { width: w, height: h, radius: r } = this._geometry;
    if (!w || !h) return;
    const points = [];
    const line = (x1, y1, x2, y2, nx, ny) => {
      const length = Math.hypot(x2 - x1, y2 - y1);
      if (length < .01) return;
      const steps = Math.max(2, Math.ceil(length / 12));
      for (let i = 0; i < steps; i++) points.push({ x: x1 + (x2 - x1) * i / steps, y: y1 + (y2 - y1) * i / steps, nx, ny });
    };
    const arc = (cx, cy, angle) => {
      for (let i = 0; i < 16; i++) {
        const a = (angle + i / 16 * 90) * Math.PI / 180;
        points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) });
      }
    };
    line(r, 0, w - r, 0, 0, -1); arc(w - r, r, -90);
    line(w, r, w, h - r, 1, 0); arc(w - r, h - r, 0);
    line(w - r, h, r, h, 0, 1); arc(r, h - r, 90);
    line(0, h - r, 0, r, -1, 0); arc(r, r, 180);
    this._points = points;
    const contour = points.map((point) => {
      const pull = this._edgePull(point.x, point.y);
      return { ...point, x: point.x + point.nx * pull + 12, y: point.y + point.ny * pull + 12 };
    });
    const pathAtInset = (inset) => {
      const vertices = contour.map((point) => ({ x: point.x - point.nx * inset, y: point.y - point.ny * inset }));
      const coordinates = (point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
      if (r < 2) return `M${vertices.map(coordinates).join('L')}Z`;
      const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      return `M${coordinates(midpoint(vertices.at(-1), vertices[0]))}${vertices.map((point, index) => `Q${coordinates(point)} ${coordinates(midpoint(point, vertices[(index + 1) % vertices.length]))}`).join('')}Z`;
    };
    const path = pathAtInset(0);
    for (const name of ['.backdrop', '.depth', '.light', '.glint']) this.shadowRoot.querySelector(name).style.clipPath = `path("${path}")`;
    const outline = this.shadowRoot.querySelector('.outline');
    outline.setAttribute('width', w + 24); outline.setAttribute('height', h + 24);
    outline.setAttribute('viewBox', `0 0 ${w + 24} ${h + 24}`);
    outline.querySelectorAll('path').forEach((element) => element.setAttribute('d', path));
    outline.querySelector('.meniscus-caustic').setAttribute('d', pathAtInset(Math.min(8, r * .2)));
    outline.querySelector('.meniscus-sheen').setAttribute('d', pathAtInset(Math.min(2, r * .1)));
  }

  _createMap(width, height, requestedRadius) {
    const canvas = document.createElement('canvas');
    const ratio = Math.min(1, 320 / width, 180 / height);
    canvas.width = Math.max(2, Math.round(width * ratio));
    canvas.height = Math.max(2, Math.round(height * ratio));
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(canvas.width, canvas.height);
    const radius = Math.max(1, Math.min(requestedRadius, width / 2, height / 2));
    const rim = Math.min(radius, height * .38, 44);
    const thickness = this._geometry.thickness;
    const liquidRim = Math.min(Math.max(12, radius - 12), (height - 24) * .32, 52);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const px = (x + .5) / ratio - width / 2;
        const py = (y + .5) / ratio - height / 2;
        const qx = Math.abs(px) - (width / 2 - radius);
        const qy = Math.abs(py) - (height / 2 - radius);
        const dx = Math.max(qx, 0), dy = Math.max(qy, 0);
        const length = Math.hypot(dx, dy);
        const signedDistance = -(length + Math.min(Math.max(qx, qy), 0) - radius);
        let nx = 0, ny = 0;
        if (length > 0) { nx = Math.sign(px) * dx / length; ny = Math.sign(py) * dy / length; }
        else if (qx > qy) nx = Math.sign(px);
        else ny = Math.sign(py);
        // Use the same displaced boundary for the optical shoulder and its visible outline.
        const edgeDistance = signedDistance - 12;
        const pull = this._edgePull((x + .5) / ratio - 12 + nx * edgeDistance, (y + .5) / ratio - 12 + ny * edgeDistance);
        const distance = Math.max(0, signedDistance + pull);
        const baseBend = Math.pow(Math.max(0, 1 - distance / rim), 2);
        const liquidBend = Math.pow(Math.max(0, 1 - Math.max(0, edgeDistance + pull) / liquidRim), 1.65);
        const bend = baseBend * (1 - thickness) + liquidBend * thickness;
        const offset = (y * canvas.width + x) * 4;
        pixels.data[offset] = 128 - nx * bend * 126;
        pixels.data[offset + 1] = 128 - ny * bend * 126;
        pixels.data[offset + 2] = 128;
        pixels.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas.toDataURL();
  }
}

const mic = `<svg viewBox="0 0 32 40" fill="none" aria-hidden="true"><rect class="mic-fill" x="11" y="2" width="10" height="23" rx="5" stroke="currentColor" stroke-width="2.5"/><path d="M5 19v3a11 11 0 0 0 22 0v-3M16 33v5M10 38h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const recorderStyles = `
  :host {
    display: block; width: 560px; max-width: 100%; color: var(--recorder-color, #fff);
    font-family: var(--recorder-font, Inter, ui-sans-serif, system-ui, -apple-system, sans-serif);
    --glass-radius: 999px;
    --_height: var(--recorder-height, 158px); --_button: var(--recorder-button-size, 106px);
    --_side: 28px; --_mic-left: 40px;
  }
  * { box-sizing: border-box; }
  liquid-glass {
    display: block; width: var(--_height); max-width: 100%; margin-inline: auto;
    --glass-opacity: .075; --glass-saturation: 1.8; --glass-thickness: 1;
    transition: width 1.05s cubic-bezier(.22, .72, .2, 1);
  }
  :host([data-expanded="true"]) liquid-glass { width: 100%; }
  :host([data-expanded="false"]) liquid-glass {
    --glass-tint: rgb(7 19 46 / .35);
    --glass-light: radial-gradient(ellipse at 50% 115%, rgb(117 170 235 / .28), transparent 60%), linear-gradient(145deg, rgb(255 255 255 / .16), transparent 50%);
  }
  .controls { min-height: var(--_height); width: 100%; position: relative; }
  .microphone { width: 34px; position: absolute; left: var(--_mic-left); top: 50%; transform: translateY(-50%); }
  .microphone svg { width: 100%; display: block; filter: drop-shadow(0 1px 6px rgb(0 0 0 / .12)); }
  .mic-fill { fill: rgb(255 255 255 / .12); transition: fill .25s; }
  :host([data-state="recording"]) .mic-fill { fill: var(--recorder-accent, #ff504f); }
  .readout { position: absolute; left: 84px; right: calc(var(--_button) + var(--_side) + 8px); top: 50%; transform: translateY(-50%); text-align: center; padding-top: 7px; }
  .microphone, .readout { opacity: 0; visibility: hidden; transition: opacity .2s, visibility .2s; pointer-events: none; }
  :host([data-expanded="true"]) .microphone, :host([data-expanded="true"]) .readout { opacity: 1; visibility: visible; transition-delay: .23s; }
  .time { font-size: clamp(38px, 7vw, var(--recorder-time-size, 64px)); line-height: 1.1; font-weight: 300; letter-spacing: -2px; font-variant-numeric: tabular-nums; }
  .status { margin: 6px 0 0; font-size: 10px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
  .action {
    position: absolute; right: calc(50% - var(--_button) / 2); top: 50%; transform: translateY(-50%);
    width: var(--_button); height: var(--_button);
    display: grid; place-items: center; border: 1px solid rgb(255 255 255 / .65); border-radius: 50%; color: inherit;
    background: radial-gradient(circle at 23% 40%, rgb(255 255 255 / .65), transparent 4%), radial-gradient(ellipse at 45% 30%, rgb(128 158 211 / .65), rgb(67 105 165 / .5) 65%, rgb(166 193 230 / .62));
    box-shadow: inset 0 2px 5px rgb(255 255 255 / .42), inset 0 -3px 7px rgb(236 230 182 / .45), inset 0 0 16px rgb(8 28 70 / .2), 0 0 0 1px rgb(29 67 129 / .6), 0 5px 14px rgb(0 14 40 / .2);
    -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
    cursor: pointer; transition: right 1.05s cubic-bezier(.22, .72, .2, 1), transform .2s, background .2s;
  }
  :host([data-expanded="true"]) .action { right: var(--_side); }
  .action:hover { transform: translateY(-50%) scale(1.04); background-color: rgb(255 255 255 / .1); }
  .action:active { transform: translateY(-50%) scale(.94); }
  .action:focus-visible { outline: 3px solid var(--recorder-focus, #fff); outline-offset: 5px; }
  .action:disabled { cursor: wait; opacity: .55; transform: translateY(-50%); }
  .shape { width: 36px; height: 36px; border-radius: 10px; background: #f5f8ff; transition: background .25s; box-shadow: 0 2px 10px rgb(255 255 255 / .12); }
  :host([data-state="recording"]) .shape { background: var(--recorder-accent, #ff4e4a); box-shadow: 0 2px 14px rgb(255 70 70 / .25); }
  :host([data-state="requesting"]) .shape, :host([data-state="processing"]) .shape { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgb(255 255 255 / .3); border-top-color: #fff; background: transparent; animation: spin .8s linear infinite; box-shadow: none; }
  .message { text-align: center; font-size: 12px; line-height: 1.6; margin: 12px 10px 0; }
  .result { margin-top: 18px; padding: 18px; border-radius: 22px; background: rgb(8 21 45 / .65); border: 1px solid rgb(255 255 255 / .2); }
  audio { width: 100%; height: 36px; display: block; }
  .result-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; font-size: 11px; }
  .download { color: #fff; text-decoration: none; padding: 8px 12px; border: 1px solid rgb(255 255 255 / .3); border-radius: 999px; }
  .download:hover { background: rgb(255 255 255 / .12); }
  .download:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  [hidden] { display: none !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 480px) {
    :host { --_height: var(--recorder-height, 116px); --_button: var(--recorder-button-size, 76px); --_side: 18px; --_mic-left: 25px; }
    .microphone { width: 26px; } .readout { left: 60px; }
    .shape { width: 29px; height: 29px; border-radius: 8px; } .time { font-size: 42px; } .status { font-size: 8px; }
  }
  @media (prefers-reduced-motion: reduce) { liquid-glass, .action, .shape, .mic-fill, .microphone, .readout { transition: none; transition-delay: 0s !important; } .shape { animation: none !important; } }
  @media (forced-colors: active) { .action { border-color: ButtonText; background: ButtonFace; } .shape { background: ButtonText !important; } }
`;

/** Local-only MediaRecorder UI. Microphone access occurs only when start() is called. */
export class LiquidRecorder extends HTMLElementBase {
  static get observedAttributes() { return ['demo', 'disabled', 'blur', 'refraction', 'radius', 'elasticity', 'static', 'appearance', 'download-name']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${recorderStyles}</style><liquid-glass part="glass"><div class="controls" part="controls"><div class="microphone">${mic}</div><div class="readout"><div class="time" role="timer" aria-label="Elapsed recording time" part="timer">00:00</div><p class="status">Ready to record</p></div><button class="action" part="button" type="button" aria-label="Start recording"><span class="shape"></span></button></div></liquid-glass><p class="message" role="status" hidden></p><div class="result" part="result" hidden><audio controls aria-label="Recorded audio"></audio><div class="result-footer"><span class="file-info"></span><a class="download">Download audio ↗</a></div></div>`;
    this._button = this.shadowRoot.querySelector('.action');
    this._timer = this.shadowRoot.querySelector('.time');
    this._status = this.shadowRoot.querySelector('.status');
    this._message = this.shadowRoot.querySelector('.message');
    this._result = this.shadowRoot.querySelector('.result');
    this._audio = this.shadowRoot.querySelector('audio');
    this._link = this.shadowRoot.querySelector('.download');
    this._state = 'idle'; this._elapsed = 0; this._generation = 0; this._blob = null; this._url = null;
    this._button.addEventListener('click', () => this._state === 'recording' ? this.stop() : this.start());
  }

  get state() { return this._state; }
  get duration() { return this._elapsed / 1000; }
  get blob() { return this._blob; }
  get recordingUrl() { return this._url; }

  connectedCallback() { this._syncAttributes(); this._render(); }
  disconnectedCallback() { this.reset(); }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'demo' && this._state !== 'idle') this.reset();
    if (name === 'disabled' && newValue !== null && this._state !== 'idle') this.reset();
    if (this.isConnected) { this._syncAttributes(); this._render(); }
  }

  _syncAttributes() {
    const glass = this.shadowRoot.querySelector('liquid-glass');
    for (const name of ['blur', 'refraction', 'radius', 'elasticity', 'static', 'appearance']) {
      if (this.hasAttribute(name)) glass.setAttribute(name, this.getAttribute(name));
      else glass.removeAttribute(name);
    }
    this._updateDownload();
  }

  async start() {
    if (!this.isConnected || this.hasAttribute('disabled') || ['recording', 'requesting', 'processing'].includes(this._state)) return;
    this.reset();
    const generation = ++this._generation;
    if (this.hasAttribute('demo')) {
      this._beginTiming();
      this._emit('record-start', { demo: true });
      return;
    }
    if (!globalThis.isSecureContext || !navigator.mediaDevices?.getUserMedia || !globalThis.MediaRecorder) {
      this._fail(new Error('Audio recording needs HTTPS (or localhost) and a browser with MediaRecorder support.'));
      return;
    }
    this._state = 'requesting'; this._render();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (generation !== this._generation || !this.isConnected) { stream.getTracks().forEach((track) => track.stop()); return; }
      this._stream = stream;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/webm'].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      this._recorder = recorder;
      this._chunks = [];
      recorder.ondataavailable = ({ data }) => { if (generation === this._generation && data.size) this._chunks.push(data); };
      recorder.onerror = (event) => { if (generation === this._generation) this._fail(event.error || new Error('The audio recorder stopped unexpectedly.')); };
      recorder.onstop = () => {
        if (generation !== this._generation) return;
        this._freezeTiming(); this._releaseStream();
        this._blob = new Blob(this._chunks, { type: recorder.mimeType || this._chunks[0]?.type || 'audio/webm' });
        this._chunks = []; this._recorder = null;
        if (!this._blob.size) { this._fail(new Error('No audio was captured. Try recording for a little longer.')); return; }
        this._url = URL.createObjectURL(this._blob);
        this._audio.src = this._url;
        this._state = 'recorded'; this._updateDownload(); this._render();
        this._emit('record-stop', { blob: this._blob, url: this._url, duration: this.duration, mimeType: this._blob.type, demo: false });
      };
      stream.getTracks().forEach((track) => track.addEventListener('ended', () => { if (generation === this._generation && this._state === 'recording') this.stop(); }, { once: true }));
      recorder.start();
      this._beginTiming();
      this._emit('record-start', { demo: false });
    } catch (error) {
      if (generation === this._generation) this._fail(error);
    }
  }

  stop() {
    if (this._state === 'requesting') { this.reset(); return; }
    if (this._state !== 'recording') return;
    this._freezeTiming();
    if (this.hasAttribute('demo')) {
      this._state = 'recorded'; this._render();
      this._showMessage('Preview finished. Enable your microphone to capture real audio.');
      this._emit('record-stop', { blob: null, url: null, duration: this.duration, mimeType: null, demo: true });
    } else {
      this._state = 'processing'; this._render();
      if (this._recorder?.state !== 'inactive') this._recorder.stop();
    }
  }

  reset() {
    ++this._generation;
    clearInterval(this._interval); this._interval = null;
    if (this._recorder) {
      this._recorder.ondataavailable = null; this._recorder.onstop = null; this._recorder.onerror = null;
      if (this._recorder.state !== 'inactive') this._recorder.stop();
      this._recorder = null;
    }
    this._releaseStream();
    this._audio.pause(); this._audio.removeAttribute('src'); this._audio.load();
    if (this._url) URL.revokeObjectURL(this._url);
    this._url = null; this._blob = null; this._chunks = []; this._elapsed = 0;
    this._state = 'idle'; this._message.hidden = true; this._link.removeAttribute('href'); this._render();
  }

  download() { if (this._url) this._link.click(); }

  _beginTiming() {
    this._startedAt = performance.now(); this._state = 'recording'; this._render();
    this._interval = setInterval(() => {
      this._elapsed = performance.now() - this._startedAt;
      this._timer.textContent = formatTime(this._elapsed);
    }, 200);
  }

  _freezeTiming() {
    if (this._interval !== null && this._interval !== undefined) this._elapsed = performance.now() - this._startedAt;
    clearInterval(this._interval); this._interval = null;
  }

  _releaseStream() { this._stream?.getTracks().forEach((track) => track.stop()); this._stream = null; }

  _updateDownload() {
    if (!this._url) return;
    const type = this._blob.type;
    const extension = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
    const name = (this.getAttribute('download-name') || 'recording').replace(/\.(webm|m4a|mp4|ogg)$/i, '');
    this._link.href = this._url; this._link.download = `${name}.${extension}`;
    this.shadowRoot.querySelector('.file-info').textContent = `${formatTime(this._elapsed)} · ${(this._blob.size / 1024).toFixed(1)} KB · ${extension.toUpperCase()}`;
  }

  _fail(error) {
    this.reset();
    const messages = {
      NotAllowedError: 'Microphone access was denied. Allow it in your browser’s site settings, then try again.',
      NotFoundError: 'No microphone was found. Connect one and try again.',
      NotReadableError: 'The microphone is unavailable. Close other apps using it, then try again.'
    };
    this._showMessage(messages[error.name] || error.message || 'Recording failed. Please try again.');
    this._emit('record-error', { error, message: this._message.textContent });
  }

  _showMessage(text) { this._message.textContent = text; this._message.hidden = false; }
  _emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }

  _render() {
    this.dataset.state = this._state;
    this.dataset.expanded = ['requesting', 'recording', 'processing'].includes(this._state) ? 'true' : 'false';
    const recording = this._state === 'recording';
    this._button.disabled = this.hasAttribute('disabled') || ['requesting', 'processing'].includes(this._state);
    this._button.setAttribute('aria-label', recording ? 'Stop recording' : this._state === 'requesting' ? 'Waiting for microphone permission' : this._state === 'processing' ? 'Finishing recording' : this._state === 'recorded' ? 'Record again' : 'Start recording');
    const labels = { idle: 'Ready to record', requesting: 'Waiting for permission', recording: this.hasAttribute('demo') ? 'Demo recording' : 'Recording', processing: 'Finishing recording', recorded: 'Ready for another take' };
    this._status.textContent = labels[this._state];
    this._timer.textContent = formatTime(this._elapsed);
    this._result.hidden = !this._url;
  }
}

export function registerLiquidGlass() {
  if (!globalThis.customElements) return;
  if (!customElements.get('liquid-glass')) customElements.define('liquid-glass', LiquidGlass);
  if (!customElements.get('liquid-recorder')) customElements.define('liquid-recorder', LiquidRecorder);
}

registerLiquidGlass();

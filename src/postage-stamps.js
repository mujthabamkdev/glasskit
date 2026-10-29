const styles = `
  :host{display:block;width:100%;--stamp-blue:#164a86;--stamp-background:#f7f7f7;--stamp-paper:#fff}
  *{box-sizing:border-box}
  .scene{position:relative;width:100%;aspect-ratio:1;overflow:hidden;container-type:inline-size;background:var(--stamp-background);font-family:Inter,system-ui,sans-serif;isolation:isolate}
  .document{position:absolute;pointer-events:none;color:#344046;font:1.12cqw/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;filter:blur(var(--paper-softness,0px));box-shadow:0 .3cqw .5cqw #15263808}
  .chat{left:57%;top:-4%;width:49%;padding:4cqw 2.5cqw 5cqw;background:#dcebf0;transform:rotate(4deg);clip-path:polygon(0 0,100% 0,100% 97%,88% 92%,80% 99%,68% 94%,59% 97%,49% 90%,40% 94%,29% 85%,19% 86%,12% 74%,0 70%)}
  .chat-row{display:grid;grid-template-columns:3cqw 10cqw 1fr;gap:1.2cqw;padding:1cqw 0;border-bottom:1px solid #7997a02b}.chat-row strong{font-size:1cqw}.file{padding:.6cqw 1cqw;margin:.7cqw 0;border:1px solid #77969f40;background:#ffffff25}
  .chart{left:-4%;top:17%;width:30%;height:15%;background:repeating-linear-gradient(to bottom,transparent 0 2.9cqw,#c8cdd1 3cqw 3.1cqw)}
  .bar{display:block;height:2.7cqw;margin-bottom:.9cqw;background:repeating-linear-gradient(90deg,#999c9c 0 1.6cqw,#c9cdcd 1.6cqw 3.2cqw)}.bar:nth-child(1){width:67%}.bar:nth-child(2){width:91%;margin-left:5%;background:repeating-linear-gradient(90deg,#0799d0 0 1.6cqw,#42b5dd 1.6cqw 3.2cqw)}.bar:nth-child(3){width:61%;background:repeating-linear-gradient(90deg,#0e9caa 0 1.6cqw,#57c8cb 1.6cqw 3.2cqw)}.bar:nth-child(4){width:91%;background:repeating-linear-gradient(90deg,#aaa 0 1.6cqw,#d1d1d1 1.6cqw 3.2cqw,#159dcc 3.2cqw 5cqw,#49b8e0 5cqw 6.6cqw)}
  .email{left:5%;top:84%;width:46%;min-height:23%;padding:1.6cqw 1.8cqw;background:#f4f0d4;transform:rotate(2deg);clip-path:polygon(0 0,100% 0,99% 77%,96% 100%,4% 100%,3% 87%,0 80%)}.email p{margin:0 0 1.4cqw}.email footer{border-top:1px solid #98916d;padding-top:1cqw}
  .sheet{left:80%;top:70%;width:37%;padding:1.3cqw;background:#f0eccf;transform:rotate(-4deg);clip-path:polygon(0 0,100% 0,100% 100%,14% 98%,0 92%)}.sheet strong{font-size:1.2cqw}.sheet table{width:100%;border-collapse:collapse;font-size:.88cqw}.sheet td{border:1px solid #7f7c642e;padding:.3cqw .55cqw;text-align:right}.sheet td:first-child{text-align:left}
  .stack{position:absolute;inset:0;perspective:100cqw;transform:rotateX(var(--pointer-y,0deg)) rotateY(var(--pointer-x,0deg));transition:transform .18s ease-out;transform-style:preserve-3d}
  .stamp{position:absolute;display:block;width:29%;height:39%;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;touch-action:pan-y;filter:drop-shadow(0 .2cqw .15cqw #15263822) drop-shadow(0 1.4cqw 1.5cqw #15263816);transform:translate(var(--shift-x),var(--shift-y)) rotate(var(--angle));transition:transform .45s cubic-bezier(.2,.75,.2,1),filter .3s;z-index:var(--layer)}
  .stamp.dark{left:25%;top:40%;--shift-x:calc(var(--spread,1)*-1.4cqw);--shift-y:calc(var(--spread,1)*1.6cqw);--angle:calc(var(--spread,1)*-17deg);--layer:1}
  .stamp.paper{left:36%;top:28%;--shift-x:0cqw;--shift-y:0cqw;--angle:calc(var(--spread,1)*-3deg);--layer:2}
  .stamp.blue{left:48%;top:26%;--shift-x:calc(var(--spread,1)*1.1cqw);--shift-y:calc(var(--spread,1)*-.4cqw);--angle:calc(var(--spread,1)*7deg);--layer:3}
  .stamp-paper{display:block;position:relative;width:100%;height:100%;padding:1.6cqw;background:var(--stamp-paper);mask:linear-gradient(#000,#000) center/calc(100% - 1.6cqw) calc(100% - 1.6cqw) no-repeat,radial-gradient(.8cqw at .8cqw .8cqw,#0000 98%,#000) -.8cqw -.8cqw/2.4cqw 2.4cqw;box-shadow:inset 0 0 .7cqw #8f94934d}
  .print{display:block;position:relative;width:100%;height:100%;overflow:hidden;padding:1.6cqw;color:#fff;background:#111;box-shadow:inset 0 0 0 1px #00000010}
  .paper .print{color:#191c20;background:linear-gradient(120deg,#f7f7f4,#e8e9e4)}
  .blue .print{background:radial-gradient(ellipse at 90% 100%,#5799ba 0,transparent 60%),linear-gradient(145deg,#12284d,var(--stamp-blue));filter:saturate(var(--ink-saturation,1))}
  .print::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.16;background:repeating-radial-gradient(circle at 20% 80%,#ffffff6b 0 .05cqw,transparent .07cqw .25cqw);mix-blend-mode:soft-light}
  .stamp-title{position:relative;z-index:1;display:block;font:3.3cqw/1 Georgia,serif;letter-spacing:-.15cqw}.paper .stamp-title{font-size:2.75cqw;line-height:1.08;margin-top:4cqw;max-width:17cqw}
  .serial{display:block;font:.7cqw/1.3 ui-monospace,monospace;opacity:.65}.denomination{position:absolute;right:1.5cqw;top:1.9cqw;font:.65cqw/1.2 ui-monospace,monospace;text-align:right}.issue{position:absolute;bottom:1.5cqw;left:1.6cqw;font:.64cqw/1 ui-monospace,monospace;opacity:.7}.blue .issue{right:1.6cqw;left:auto}.foil{position:absolute;left:0;top:17%;width:100%;height:84%}.dark .foil{left:8%;top:4%;width:30%;height:23%}.spectrum{position:absolute;bottom:0;left:0;right:0;height:1.4cqw;background:repeating-linear-gradient(100deg,#89a5b7 0 1cqw,#e6e1a2 1cqw 2cqw,#bed5c8 2cqw 3cqw,#787ca5 3cqw 4cqw)}
  .postmark{position:absolute;left:3cqw;bottom:5.5cqw;width:13cqw;height:13cqw;border:1px solid #343a4733;border-radius:50%;display:grid;place-items:center;transform:rotate(-24deg);font:.7cqw ui-monospace,monospace;text-align:center;color:#343a4777}.postmark::after{content:'';position:absolute;inset:1cqw;border:1px solid #343a4722;border-radius:50%}
  .stamp[aria-pressed=true]{z-index:4;transform:translate(var(--shift-x),calc(var(--shift-y) - 5cqw)) rotate(0deg) scale(1.08);filter:drop-shadow(0 2cqw 2.8cqw #15263838)}
  .stamp:focus-visible{outline:.4cqw solid #3184ce;outline-offset:1.2cqw;border-radius:.4cqw}
  .hint{position:absolute;left:0;right:0;bottom:2.8%;text-align:center;color:#626d77;font:1.25cqw/1.4 Inter,system-ui,sans-serif;pointer-events:none;background:var(--stamp-background);width:max-content;max-width:94%;padding:.5cqw 1.3cqw;margin:0 auto;border-radius:1cqw}
  :host([preview]) .hint{display:none}
  @media(hover:hover){:host(:not([static])) .stamp:hover{z-index:5;transform:translate(var(--shift-x),calc(var(--shift-y) - 3cqw)) rotate(0deg) scale(1.06)}}
  @media(prefers-reduced-motion:reduce){.stack,.stamp{transition:none}.stack{transform:none}:host(:not([static])) .stamp:hover{transform:translate(var(--shift-x),var(--shift-y)) rotate(var(--angle))}}
`;

function foil(dark = false) {
  const id = dark ? 'foil-dark' : 'foil-blue';
  const paths = Array.from({ length: 17 }, (_, index) => {
    const x = 25 + index * 6;
    return `<path d="M${x - 25} 335 C${x - 15} 183 ${x + 27} 65 ${x + 95} 37 C${x + 24} 82 ${x + 21} 231 ${x + 9} 337" fill="none" stroke="url(#${id})" stroke-width="${index % 3 === 0 ? 3 : 1.5}"/>`;
  }).join('');
  return `<svg class="foil" viewBox="0 0 260 360" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="${dark ? '#fff' : '#b7ccd0'}"/><stop offset=".35" stop-color="${dark ? '#fff' : '#e1e3c6'}"/><stop offset=".65" stop-color="${dark ? '#fff' : '#82abc0'}"/><stop offset="1" stop-color="${dark ? '#fff' : '#4a719b'}"/></linearGradient></defs>${paths}</svg>`;
}

const markup = `
  <div class="scene" part="scene">
    <div class="document chart" aria-hidden="true"><i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"></i></div>
    <div class="document chat" aria-hidden="true"><div class="chat-row"><span>09:12</span><strong>Priya Kumar</strong><div>I've added the latest forecast.<div class="file">▧ Headcount_Assumptions.xlsx<br>892 KB</div></div></div><div class="chat-row"><span>09:14</span><strong>Daniel Costa</strong><span>Looks good. Let's flag the vendor contract dependency.</span></div><div class="chat-row"><span>09:15</span><strong>Priya Kumar</strong><span>Agreed. I'll add a note in the risk log.</span></div></div>
    <div class="document email" aria-hidden="true"><p>The deck includes updated forecasts, resource plans, and milestones.<br>Let me know if you have any questions or want to discuss.</p><p>Thanks,<br>Alex Chen<br>Senior Product Manager<br>Northwind Co.</p><footer>Attachments (2)</footer></div>
    <div class="document sheet" aria-hidden="true"><strong>Customer Orders Report</strong><br>Q1 overview / 2026<table><tbody><tr><td>Customer</td><td>Region</td><td>Total</td></tr><tr><td>Northwind</td><td>EU</td><td>18,420</td></tr><tr><td>Acme Co.</td><td>US</td><td>24,180</td></tr><tr><td>Contoso</td><td>APAC</td><td>12,600</td></tr><tr><td>Fabrikam</td><td>EU</td><td>31,240</td></tr><tr><td>Total</td><td></td><td>86,440</td></tr></tbody></table></div>
    <div class="stack">
      <button class="stamp dark" part="stamp" type="button" aria-label="Select black foil stamp" aria-pressed="false"><span class="stamp-paper"><span class="print">${foil(true)}<span class="issue">ISSUED / 003</span><span class="spectrum"></span></span></span></button>
      <button class="stamp paper" part="stamp" type="button" aria-label="Select paper privacy stamp" aria-pressed="false"><span class="stamp-paper"><span class="print"><span class="serial">GL / 2026—003</span><span class="stamp-title">Your ideas.<br>Yours to keep.</span><span class="postmark">GLASSKIT<br>POST OFFICE<br>2026</span><span class="issue">PRINTED ON THE WEB</span></span></span></button>
      <button class="stamp blue" part="stamp" type="button" aria-label="Select blue ribbon stamp" aria-pressed="false"><span class="stamp-paper"><span class="print"><span class="stamp-title" data-label>Glasskit</span><span class="denomination">POSTAGE<br>003</span>${foil()}<span class="issue">EST. 2026</span></span></span></button>
    </div>
    <p class="hint">Select a stamp. Move your pointer to tilt the paper.</p>
  </div>
`;

export class PostageStampsScene extends HTMLElement {
  static get observedAttributes() { return ['refraction', 'blur', 'elasticity', 'glow', 'label', 'static']; }

  constructor() {
    super();
    this._selected = -1;
    this._frame = 0;
  }

  attributeChangedCallback() { this._syncMaterial(); }

  _number(name, fallback, min, max) {
    const value = this.getAttribute(name);
    const number = value === null || value.trim() === '' ? fallback : Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  }

  _syncMaterial() {
    this.style.setProperty('--spread', this._number('refraction', 36, 0, 100) / 36);
    this.style.setProperty('--paper-softness', `${this._number('blur', 0, 0, 24) / 10}px`);
    this.style.setProperty('--ink-saturation', this._number('glow', 70, 0, 100) / 70);
    if (this.shadowRoot) this.shadowRoot.querySelector('[data-label]').textContent = this.getAttribute('label') || 'Glasskit';
    if (this.hasAttribute('static') || this._number('elasticity', 1, 0, 2) === 0) this._stopTilt();
  }

  connectedCallback() {
    if (this._events) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).innerHTML = `<style>${styles}</style>${markup}`;
    this._buttons = [...this.shadowRoot.querySelectorAll('.stamp')];
    this._scene = this.shadowRoot.querySelector('.scene');
    this._events = new AbortController();
    const options = { signal: this._events.signal };
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    this._motion.addEventListener('change', () => this._stopTilt(), options);
    this._buttons.forEach((button, index) => {
      button.addEventListener('click', () => this._select(this._selected === index ? -1 : index), options);
      button.addEventListener('keydown', event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null;
        if (next !== null) { event.preventDefault(); this._select(next); this._buttons[next].focus(); }
        if (event.key === 'Escape') this.reset();
      }, options);
    });
    this._scene.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || this.hasAttribute('static') || this._motion.matches) return;
      const rect = this._scene.getBoundingClientRect();
      const strength = this._number('elasticity', 1, 0, 2) * 5;
      this._pointer = { x: ((event.clientX - rect.left) / rect.width - .5) * strength, y: -((event.clientY - rect.top) / rect.height - .5) * strength };
      if (!this._frame) this._frame = requestAnimationFrame(() => {
        this._frame = 0;
        this.style.setProperty('--pointer-x', `${this._pointer.x}deg`);
        this.style.setProperty('--pointer-y', `${this._pointer.y}deg`);
      });
    }, options);
    this._scene.addEventListener('pointerleave', () => this._stopTilt(), options);
    this._scene.addEventListener('pointercancel', () => this._stopTilt(), options);
    this._syncMaterial();
  }

  _select(index) {
    this._selected = index;
    this._buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    this.dispatchEvent(new CustomEvent('stamp-select', { detail: { index }, bubbles: true, composed: true }));
  }

  _stopTilt() {
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    this.style.setProperty('--pointer-x', '0deg');
    this.style.setProperty('--pointer-y', '0deg');
  }

  reset() {
    this._stopTilt();
    if (this._buttons) this._select(-1);
  }

  disconnectedCallback() {
    this._events?.abort();
    this._events = null;
    this._stopTilt();
  }
}

if (!customElements.get('postage-stamps-scene')) customElements.define('postage-stamps-scene', PostageStampsScene);

const styles = `
  :host{display:block;width:100%;--visa-background:#f7f7f8;--visa-ink:#62636a;--visa-metal:#c7c8cc}
  *{box-sizing:border-box}
  .scene{position:relative;width:100%;aspect-ratio:4/3;container-type:inline-size;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#fff,transparent 65%),var(--visa-background);font-family:Inter,system-ui,sans-serif;perspective:150cqw;isolation:isolate}
  .assembly{position:absolute;left:50%;top:50%;width:64%;aspect-ratio:85.6/54;padding:0;border:0;border-radius:3.3cqw;background:none;color:var(--visa-ink);text-align:left;cursor:pointer;touch-action:pan-y;transform-style:preserve-3d;transform:translate(-50%,-50%) rotateX(var(--pitch,0deg)) rotateY(var(--yaw,0deg));transition:transform .85s cubic-bezier(.2,.7,.2,1);-webkit-tap-highlight-color:transparent}
  .assembly[data-expanded=true]{transform:translate(-50%,-38%) rotateX(calc(54deg + var(--pitch,0deg))) rotateY(var(--yaw,0deg)) rotateZ(-25deg)}
  .assembly:focus-visible{outline:.4cqw solid #477fbb;outline-offset:2cqw}
  .layer{position:absolute;inset:0;display:block;border-radius:inherit;transform:translateZ(calc(var(--level)*.04cqw));transition:transform .85s cubic-bezier(.2,.7,.2,1),opacity .85s,border-color .85s;pointer-events:none;backface-visibility:hidden}
  .assembly[data-expanded=true] .layer{transform:translateZ(calc(var(--level)*var(--layer-gap,3.22cqw)))}
  .substrate{--level:0;background:linear-gradient(140deg,#d6d7db,var(--visa-metal));box-shadow:0 .4cqw 0 #a3a4a9,0 .65cqw .25cqw #696b741f,0 2cqw 3cqw #33343b0e;border:1px solid #9b9da533}
  .brushed{--level:1;overflow:hidden;border:1px solid #b9bac055;background:linear-gradient(105deg,#babcc2,#f1f1f3 45%,#c3c4c9 73%,#dadbe0);box-shadow:inset 0 0 1cqw #ffffff59}
  .brushed::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#75777e1f 0 .06cqw,#ffffff59 .07cqw .16cqw,transparent .18cqw .35cqw),repeating-linear-gradient(.5deg,transparent 0 .41cqw,#686a731a .43cqw .5cqw);opacity:.8}
  .brushed::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 10%,rgb(255 255 255 / var(--sheen,.49)) 44%,transparent 70%);background-size:150% 100%;background-position:var(--sheen-x,50%) center;transition:background-position .18s ease-out}
  .assembly[data-expanded=true] .brushed{opacity:.82}
  .laminate{--level:2;background:linear-gradient(120deg,#fff2,#e8ecf52e);border:1px solid #ffffff70;backdrop-filter:blur(var(--coat-frost,0px));box-shadow:inset 0 0 .6cqw #fff3}
  .assembly[data-expanded=true] .laminate{background:linear-gradient(120deg,#ffffff16,#dbe3f11c);border-color:#d5d8df66}
  .electronics{--level:3}
  .chip{position:absolute;left:6%;top:43%;width:10%;height:12%;border-radius:.9cqw;border:1px solid #b09b55;overflow:hidden;background:linear-gradient(125deg,#f3e3ab,#c6ab62 60%,#ebd58c);box-shadow:inset 0 .2cqw .25cqw #fff5,0 .1cqw .15cqw #31333812}
  .chip::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 27%,#a58e54 28% 29%,transparent 30% 69%,#a58e54 70% 71%,transparent 72%),linear-gradient(0deg,transparent 32%,#a58e54 33% 34%,transparent 35% 64%,#a58e54 65% 66%,transparent 67%)}
  .contactless{position:absolute;left:19%;top:44%;width:4%;height:10%;color:#777980}.contactless path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
  .personalization{--level:4;text-shadow:.06cqw .09cqw #ffffffb3,-.04cqw -.04cqw #38394140}
  .number{position:absolute;left:6%;right:6%;top:62%;display:flex;justify-content:space-between;font:2.5cqw/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.38cqw;font-weight:500}
  .expiry{position:absolute;left:6%;bottom:16%;font:1.3cqw/1.1 Inter,system-ui,sans-serif}.cardholder{position:absolute;left:6%;right:24%;bottom:8%;font:1.7cqw/1.1 Inter,system-ui,sans-serif;font-weight:500;letter-spacing:.17cqw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}
  .branding{--level:5;text-shadow:.06cqw .09cqw #ffffffb3,-.04cqw -.04cqw #38394140}
  .tier{position:absolute;left:6%;top:9%;font:1.8cqw/1 Inter,system-ui,sans-serif;letter-spacing:.45cqw;font-weight:600}.emblem{position:absolute;right:6%;top:8%;width:6%;aspect-ratio:1;fill:currentColor}
  .visa{position:absolute;right:6%;bottom:6%;font:bold italic 4.5cqw/1 Arial,sans-serif;letter-spacing:-.25cqw}
  .assembly[data-expanded=true] .electronics,.assembly[data-expanded=true] .personalization,.assembly[data-expanded=true] .branding{border:1px solid #d1d4dc3b;background:#ffffff08}
  .hint{position:absolute;left:0;right:0;bottom:4%;margin:0;text-align:center;font:1.5cqw/1.4 Inter,system-ui,sans-serif;color:#737781;pointer-events:none}
  :host([preview]) .hint{display:none}
  @media(prefers-reduced-motion:reduce){.assembly,.layer,.brushed::after{transition:none}.assembly{transform:translate(-50%,-50%)}.assembly[data-expanded=true]{transform:translate(-50%,-38%) rotateX(54deg) rotateZ(-25deg)}}
`;

const markup = `
  <div class="scene" part="scene">
    <button class="assembly" part="card" type="button" aria-label="Expand platinum card layers" aria-pressed="false" data-expanded="false">
      <span class="layer substrate" part="layer" aria-hidden="true"></span>
      <span class="layer brushed" part="layer" aria-hidden="true"></span>
      <span class="layer laminate" part="layer" aria-hidden="true"></span>
      <span class="layer electronics" part="layer" aria-hidden="true"><span class="chip"></span><svg class="contactless" viewBox="0 0 25 35"><path d="M3 13q5 5 0 10M8 9q9 9 0 18M13 5q13 13 0 26M18 1q17 17 0 34"/></svg></span>
      <span class="layer personalization" part="layer" aria-hidden="true"><span class="number"><span>4242</span><span>4242</span><span>4242</span><span>4242</span></span><span class="expiry">12/29</span><span class="cardholder" data-cardholder>Alex Morgan</span></span>
      <span class="layer branding" part="layer" aria-hidden="true"><span class="tier">PLATINUM</span><svg class="emblem" viewBox="0 0 32 32"><path d="M16 2c3 0 3 5 5 6s6-2 8 1-3 5-3 7 5 4 3 7-6 0-8 1-2 6-5 6-3-5-5-6-6 2-8-1 3-5 3-7-5-4-3-7 6 0 8-1 2-6 5-6Zm0 9a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg><span class="visa">VISA</span></span>
    </button>
    <p class="hint">Select the card to reveal its six layers.</p>
  </div>
`;

export class PlatinumVisaCardScene extends HTMLElement {
  static get observedAttributes() { return ['refraction', 'blur', 'elasticity', 'glow', 'cardholder', 'expanded', 'static']; }

  constructor() { super(); this._frame = 0; }

  attributeChangedCallback() { this._syncMaterial(); this._syncExpanded(); }

  _number(name, fallback, min, max) {
    const value = this.getAttribute(name);
    const number = value === null || value.trim() === '' ? fallback : Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  }

  _syncMaterial() {
    this.style.setProperty('--layer-gap', `${1.6 + this._number('refraction', 36, 0, 100) * .045}cqw`);
    this.style.setProperty('--coat-frost', `${this._number('blur', 0, 0, 24)}px`);
    this.style.setProperty('--sheen', this._number('glow', 70, 0, 100) / 100 * .7);
    if (this.shadowRoot) this.shadowRoot.querySelector('[data-cardholder]').textContent = this.getAttribute('cardholder') || 'Alex Morgan';
    if (this.hasAttribute('static') || this._number('elasticity', 1, 0, 2) === 0) this._stopTilt();
  }

  _syncExpanded() {
    if (!this._button) return;
    const expanded = this.hasAttribute('expanded');
    this._button.dataset.expanded = String(expanded);
    this._button.setAttribute('aria-pressed', String(expanded));
    this._button.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} platinum card layers`);
    this.shadowRoot.querySelector('.hint').textContent = expanded ? 'Six layers. Select again to bring them together.' : 'Select the card to reveal its six layers.';
  }

  connectedCallback() {
    if (this._events) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).innerHTML = `<style>${styles}</style>${markup}`;
    this._button = this.shadowRoot.querySelector('.assembly');
    this._scene = this.shadowRoot.querySelector('.scene');
    this._events = new AbortController();
    const options = { signal: this._events.signal };
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    this._motion.addEventListener('change', () => this._stopTilt(), options);
    this._button.addEventListener('click', () => this.toggle(), options);
    this._button.addEventListener('keydown', event => { if (event.key === 'Escape') this.reset(); }, options);
    this._scene.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || this.hasAttribute('static') || this._motion.matches || this._number('elasticity', 1, 0, 2) === 0) return;
      const rect = this._scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      const strength = this._number('elasticity', 1, 0, 2) * 12;
      this._pointer = { pitch: -y * strength, yaw: x * strength, sheen: (x + .5) * 100 };
      if (!this._frame) this._frame = requestAnimationFrame(() => {
        this._frame = 0;
        this.style.setProperty('--pitch', `${this._pointer.pitch}deg`);
        this.style.setProperty('--yaw', `${this._pointer.yaw}deg`);
        this.style.setProperty('--sheen-x', `${this._pointer.sheen}%`);
      });
    }, options);
    this._scene.addEventListener('pointerleave', () => this._stopTilt(), options);
    this._scene.addEventListener('pointercancel', () => this._stopTilt(), options);
    this._syncMaterial();
    this._syncExpanded();
  }

  _setExpanded(expanded) {
    if (this.hasAttribute('expanded') === expanded) return;
    this.toggleAttribute('expanded', expanded);
    this.dispatchEvent(new CustomEvent('card-toggle', { detail: { expanded }, bubbles: true, composed: true }));
  }

  toggle() { this._setExpanded(!this.hasAttribute('expanded')); }

  _stopTilt() {
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    this.style.setProperty('--pitch', '0deg');
    this.style.setProperty('--yaw', '0deg');
    this.style.setProperty('--sheen-x', '50%');
  }

  reset() { this._stopTilt(); this._setExpanded(false); }

  disconnectedCallback() { this._events?.abort(); this._events = null; this._stopTilt(); }
}

if (!customElements.get('platinum-visa-card-scene')) customElements.define('platinum-visa-card-scene', PlatinumVisaCardScene);

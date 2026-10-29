const styles = `
  :host{display:block;width:100%;--plasma-background:#f5f5f5;--plasma-accent:#0acb31;--plasma-metal:#b8b8b8}
  *{box-sizing:border-box}
  .scene{position:relative;width:100%;aspect-ratio:1;overflow:hidden;container-type:inline-size;background:var(--plasma-background);font-family:Inter,Arial,system-ui,sans-serif;color:#080808}
  .phone{position:absolute;left:30%;top:8%;width:40%;height:84%;padding:.55cqw;border-radius:7.2cqw;background:#090909;box-shadow:0 0 0 .18cqw #858585,inset 0 0 0 .22cqw #666,0 .3cqw .5cqw #0002}
  .screen{position:relative;width:100%;height:100%;overflow:hidden;border-radius:6.6cqw;background:#f1f1f1}
  button{font:inherit;cursor:pointer;color:inherit;border:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}button:focus-visible{outline:.3cqw solid #178349;outline-offset:.4cqw}
  .status-bar{position:absolute;left:5.5cqw;right:3.5cqw;top:2.2cqw;display:flex;justify-content:space-between;align-items:center;font-size:1.6cqw;font-weight:500}.status-icons{display:flex;align-items:center;gap:.6cqw}.status-icons svg{width:1.9cqw;height:1.8cqw}.battery{display:block;width:2.3cqw;height:1.1cqw;border-radius:.25cqw;background:#000;box-shadow:.2cqw 0 0 -.05cqw #555}
  .island{position:absolute;z-index:3;left:50%;top:1.6cqw;transform:translateX(-50%);width:8.5cqw;height:3.2cqw;overflow:hidden;border-radius:999px;background:#000;color:#fff;pointer-events:none;transition:width .65s cubic-bezier(.22,1.12,.36,1),height .65s cubic-bezier(.22,1.12,.36,1),border-radius .65s,box-shadow .65s}.island[data-expanded=true]{width:calc(100% - 2cqw);height:26.4cqw;border-radius:5cqw;box-shadow:0 1.3cqw 2.5cqw #0002}.island::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 130%,var(--deposit-glow,#00639b),transparent 65%);opacity:0;transition:opacity .5s}.island[data-expanded=true]::before{opacity:1}.island-content{position:absolute;left:50%;top:6.5cqw;transform:translate(-50%,-3cqw) scale(.8);width:32cqw;text-align:center;opacity:0;filter:blur(.4cqw);transition:opacity .2s,transform .5s cubic-bezier(.22,1,.36,1),filter .4s}.island[data-expanded=true] .island-content{opacity:1;transform:translate(-50%,0) scale(1);filter:none;transition-delay:.15s}.island-icon{display:grid;place-items:center;width:5cqw;height:5cqw;margin:0 auto 1.6cqw;border-radius:50%;background:var(--deposit-color,#d9eefb);color:var(--deposit-ink,#1684b9);font-size:2.5cqw}.island-label{margin:0 0 .9cqw;font-size:1.65cqw;color:#b4b8bd}.island-amount{justify-content:center;font-size:3.8cqw;font-weight:550;letter-spacing:-.15cqw;line-height:1;height:4.4cqw}.island-receipt{margin:1.2cqw 0 0;font-size:1.55cqw;color:#c4ced6}.island-receipt::before{content:'✓';display:inline-grid;place-items:center;width:1.6cqw;height:1.6cqw;margin-right:.6cqw;background:#fff;border-radius:50%;color:#18232e;font-size:1.1cqw}
  .avatar{position:absolute;top:7.6cqw;left:2.5cqw;width:4.1cqw;aspect-ratio:1;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#eee,#d5d5d5);box-shadow:inset .2cqw .2cqw .5cqw #fff;font-size:1.7cqw}
  .wallet{padding:14cqw 2.4cqw 0;text-align:center}.label{margin:0 0 .7cqw;font-size:1.65cqw;color:#747474}.number-counter{display:inline-flex;align-items:flex-start;line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap}.balance-value{display:flex;justify-content:center;height:4.4cqw;font-size:3.8cqw;font-weight:550;letter-spacing:-.15cqw}.digit{display:inline-block;overflow:hidden;height:1em;width:.61em}.reel{display:flex;flex-direction:column}.reel>span{height:1em;line-height:1;flex-shrink:0}.punctuation{line-height:1}
  .savings{display:inline-flex;align-items:center;gap:.65cqw;margin:1.6cqw 0 3.7cqw;padding:.8cqw 1.2cqw;border-radius:999px;background:#e9e9e9;color:#747474;font-size:1.4cqw}.ring{width:1.7cqw;height:1.7cqw;border:.32cqw solid var(--plasma-accent);border-top-color:#d1d1d1;border-radius:50%;filter:saturate(var(--accent-saturation,1))}.chevrons{font-size:1.4cqw;line-height:1;color:#8b8b8b}
  .actions{display:flex;gap:1.1cqw}.actions button{height:5cqw;border-radius:999px;flex:1;font-size:1.55cqw;background:#fafafa}.actions .add{color:#fff;background:linear-gradient(#171717,#3c3c3c);box-shadow:0 .4cqw .8cqw #0002}
  .metal-card{position:relative;overflow:hidden;height:20.2cqw;margin:2.1cqw 0 2.2cqw;padding:1.5cqw;border-radius:1.6cqw;text-align:left;background:radial-gradient(ellipse at 49% 30%,#efefef,transparent 65%),linear-gradient(115deg,#a7a7a7,var(--plasma-metal));box-shadow:inset 0 0 .3cqw #fff5}.card-heading{display:flex;align-items:center;gap:.5cqw;font-size:2cqw;font-weight:400;letter-spacing:-.08cqw}.logo{width:2.1cqw;height:2.1cqw}.card-heading::after{content:'';height:1px;flex:1;background:rgb(86 86 86 / var(--groove-opacity,.36));box-shadow:0 1px #ffffff80;margin-left:.8cqw}.grooves{height:11.2cqw;margin-top:1.2cqw;background:repeating-linear-gradient(to bottom,transparent 0 2.6cqw,rgb(86 86 86 / var(--groove-opacity,.36)) 2.65cqw calc(2.65cqw + 1px),#ffffff75 calc(2.65cqw + 1px) calc(2.65cqw + 2px),transparent calc(2.65cqw + 2px) 3.05cqw)}.card-footer{position:absolute;left:1.5cqw;right:1.5cqw;bottom:1.5cqw;display:flex;align-items:center;justify-content:space-between;font-size:1.5cqw}.card-footer>span{display:flex;align-items:center;gap:.6cqw}.active-dot{width:.65cqw;aspect-ratio:1;border-radius:50%;background:var(--plasma-accent);filter:saturate(var(--accent-saturation,1))}
  .activity{height:21cqw;overflow:hidden;padding:.8cqw 1.3cqw;background:#fafafa;border-radius:2.2cqw;text-align:left}.transaction{display:grid;grid-template-columns:3.6cqw minmax(0,1fr) auto;align-items:center;gap:1cqw;min-height:6.8cqw}.transaction.new{animation:deposit-in .35s ease-out}.merchant-icon{width:3.6cqw;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-size:1.6cqw;font-weight:500;background:var(--icon-bg,#e3e3e3);color:var(--icon-ink,#333)}.merchant{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:1.4cqw}.transaction small{display:block;margin-top:.4cqw;color:#858585;font-size:1.15cqw}.amount{font-size:1.4cqw;white-space:nowrap}.positive{color:var(--plasma-accent);filter:saturate(var(--accent-saturation,1))}.cashback{color:#6a57e9;font-size:1.1cqw;text-align:right;margin-top:.4cqw}.activity-heading{margin:1cqw .5cqw 1.1cqw;font-size:1.5cqw;font-weight:500}
  .navigation{position:absolute;left:2.4cqw;right:2.4cqw;bottom:2.1cqw;display:flex;align-items:center;padding:.2cqw 0;border-radius:999px;background:#f7f7f7b3;backdrop-filter:blur(var(--nav-frost,0px));box-shadow:0 -1cqw 2cqw 1cqw #f1f1f1aa}.navigation button{display:grid;justify-items:center;gap:.55cqw;width:33.333%;height:5.9cqw;border-radius:999px;background:none;color:#999;font-size:1.1cqw}.navigation button[aria-selected=true]{background:#fff9;color:#080808}.navigation svg{width:1.9cqw;height:1.9cqw;fill:currentColor}.hint{position:absolute;left:0;right:0;bottom:2.5%;margin:0;text-align:center;color:#7b7b7b;font-size:1.3cqw;pointer-events:none}:host([preview]) .hint{display:none}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
  @keyframes deposit-in{from{opacity:0;transform:translateY(-1.5cqw)}to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){.island,.island::before,.island-content{transition:none}.transaction.new{animation:none}}
  :host([static]) .island,:host([static]) .island::before,:host([static]) .island-content{transition:none}:host([static]) .transaction.new{animation:none}
`;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const money = value => currency.format(value / 100);
const initialTransactions = [
  { name: 'Skyline Air', note: 'Sep 22', amount: -87640, icon: 'S', color: '#8b0048', ink: '#fff', cashback: '+$87.64' },
  { name: 'Studio Store', note: 'Sep 21', amount: -680, icon: '↗', color: '#ededed', cashback: '+$0.68' },
  { name: 'Coffee shop', note: 'Sep 20', amount: -450, icon: 'C', color: '#f4ddd0' }
];
const deposits = [
  { name: 'Northwind Bank', note: 'Demo deposit · 1:35 PM', amount: 10000, icon: '▦', color: '#d9eefb', ink: '#1684b9' },
  { name: '@alexmorgan', note: 'Demo transfer · 1:35 PM', amount: 10000, icon: 'A', color: '#f5d8e3' },
  { name: 'Invite bonus', note: 'Demo reward · 1:35 PM', amount: 2500, icon: '✦', color: '#ddf2d9', ink: '#378446' }
];
const earnTransactions = [
  { name: 'Savings yield', note: 'Monthly demo earnings', amount: 1840, icon: '↗', color: '#ddf2d9' },
  { name: 'Cashback payout', note: 'From your purchases', amount: 8832, icon: '✦', color: '#e6e2fa' }
];
const rewardTransactions = [
  { name: 'Invite a friend', note: '$25 demo invite bonus', amount: 2500, icon: 'A', color: '#f5d8e3' },
  { name: 'Travel cashback', note: '10% back in this demo', amount: 8764, icon: 'S', color: '#e6e2fa' }
];
const spokes = Array.from({ length: 28 }, (_, i) => `<path d="M16 3q9 3 10 10" transform="rotate(${i * 360 / 28} 16 16)"/>`).join('');
const markup = `
  <div class="scene" part="scene"><div class="phone" part="phone"><div class="screen">
    <div class="status-bar" aria-hidden="true"><span>13:35</span><span class="status-icons"><span>••••</span><svg viewBox="0 0 20 20" fill="none"><path d="M2 7q8-7 16 0M5 10q5-4 10 0M8 13q2-2 4 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="16" r="1.2" fill="currentColor"/></svg><i class="battery"></i></span></div><div class="island" data-expanded="false" aria-hidden="true" part="dynamic-island"><div class="island-content"><span class="island-icon"></span><p class="island-label">Spendable</p><div class="island-amount number-counter"></div><p class="island-receipt">Deposit received</p></div></div><span class="avatar" aria-hidden="true">A</span>
    <div class="wallet"><p class="label">Spendable</p><div class="balance-value number-counter" role="img" aria-label="Demo spendable balance" part="balance"></div><div class="savings"><span class="ring" aria-hidden="true"></span><span class="savings-value number-counter" role="img"></span><span class="chevrons" aria-hidden="true">⌃</span></div>
      <div class="actions"><button class="add" type="button" aria-label="Add demo funds">Add funds</button><button class="send" type="button" aria-label="Send demo funds">Send</button></div>
      <div class="metal-card" part="wallet-card"><div class="card-heading"><svg class="logo" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width=".7">${spokes}</svg><span>Plasma</span></div><div class="grooves" aria-hidden="true"></div><div class="card-footer"><span><span class="card-amount number-counter" role="img"></span><i class="active-dot" aria-hidden="true"></i></span><span>•••• 2048 <span aria-hidden="true">›</span></span></div></div>
      <div class="activity" id="activity" role="tabpanel" aria-labelledby="home-tab" part="activity"></div>
    </div>
    <div class="navigation" role="tablist" aria-label="Demo wallet navigation"><button id="home-tab" data-tab="home" type="button" role="tab" aria-selected="true" aria-controls="activity"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-8 9 8v11H3Z"/></svg>Home</button><button id="earn-tab" data-tab="earn" type="button" role="tab" aria-selected="false" aria-controls="activity" tabindex="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h5v8H3Zm7-5h5v13h-5Zm7-5h5v18h-5Z"/></svg>Earn</button><button id="rewards-tab" data-tab="rewards" type="button" role="tab" aria-selected="false" aria-controls="activity" tabindex="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 1v10H1A11 11 0 0 1 11 1Zm2 0a11 11 0 0 1 10 10H13ZM1 13h10v10A11 11 0 0 1 1 13Zm12 0h10a11 11 0 0 1-10 10Z"/></svg>Rewards</button></div>
    <span class="sr-only" role="status" aria-live="polite"></span>
  </div></div><p class="hint">Demo wallet. Add funds to preview a deposit.</p></div>
`;

export class PlasmaAppScene extends HTMLElement {
  static get observedAttributes() { return ['balance', 'refraction', 'blur', 'elasticity', 'glow', 'static', 'autoplay']; }
  constructor() { super(); this._frame = 0; }

  _number(name, fallback, min, max) {
    const value = this.getAttribute(name);
    const number = value === null || value.trim() === '' ? fallback : Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  }
  _initialBalance() { return Math.round(this._number('balance', 2450, 0, 999999.99) * 100); }
  get balance() { return (this._balance ?? this._initialBalance()) / 100; }

  attributeChangedCallback(name) {
    if (name === 'balance' && this._events) this.reset();
    this._syncMaterial();
    if (name === 'autoplay') this._manual = false;
    this._syncAutoplay();
  }
  _syncMaterial() {
    this.style.setProperty('--groove-opacity', .15 + this._number('refraction', 36, 0, 100) / 100 * .6);
    this.style.setProperty('--nav-frost', `${this._number('blur', 0, 0, 24)}px`);
    this.style.setProperty('--accent-saturation', this._number('glow', 70, 0, 100) / 70);
    if (this.hasAttribute('static') || this._number('elasticity', 1, 0, 2) === 0) this._finishBalance();
  }

  connectedCallback() {
    if (this._events) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).innerHTML = `<style>${styles}</style>${markup}`;
    this._amount = this.shadowRoot.querySelector('.balance-value');
    this._savings = this.shadowRoot.querySelector('.savings-value');
    this._cardAmount = this.shadowRoot.querySelector('.card-amount');
    this._activity = this.shadowRoot.querySelector('.activity');
    this._status = this.shadowRoot.querySelector('[role=status]');
    this._island = this.shadowRoot.querySelector('.island');
    this._islandAmount = this.shadowRoot.querySelector('.island-amount');
    this._tabs = [...this.shadowRoot.querySelectorAll('[data-tab]')];
    this._events = new AbortController();
    const options = { signal: this._events.signal };
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    this._motion.addEventListener('change', () => { if (this._motion.matches) this._finishBalance(); this._syncAutoplay(); }, options);
    this.shadowRoot.querySelector('.add').addEventListener('click', () => this.deposit(), options);
    this.shadowRoot.querySelector('.send').addEventListener('click', () => this.send(), options);
    this._tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { this._takeControl(); this._setTab(tab.dataset.tab); }, options);
      tab.addEventListener('keydown', event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null;
        if (next !== null) { event.preventDefault(); this._takeControl(); this._setTab(this._tabs[next].dataset.tab); this._tabs[next].focus(); }
      }, options);
    });
    if (this._balance === undefined) this.reset();
    else { this._display = this._balance; this._renderBalance(); this._setTab(this._tab); }
    this._syncMaterial();
    this._observer = new IntersectionObserver(entries => { this._visible = entries[0].isIntersecting; this._syncAutoplay(); });
    this._observer.observe(this);
    document.addEventListener('visibilitychange', () => this._syncAutoplay(), options);
  }

  _prepareCounter(element, from, to) {
    if (!element) return [];
    const formatted = money(to);
    let place = formatted.replace(/\D/g, '').length - 1;
    const reels = [];
    element.innerHTML = [...formatted].map(char => {
      if (!/\d/.test(char)) return `<span class="punctuation" aria-hidden="true">${char}</span>`;
      const power = 10 ** place--;
      const start = Math.floor(from / power) % 10;
      const end = Number(char);
      const difference = power < 100 && from % 100 === to % 100 ? 0 : Math.floor(to / power) - Math.floor(from / power);
      const direction = Math.sign(difference);
      const distance = Math.abs(difference) < 10 ? Math.abs(difference) : 10 + ((end - start) * direction + 10) % 10;
      reels.push({ distance });
      return `<span class="digit" aria-hidden="true"><span class="reel">${Array.from({ length: distance + 1 }, (_, i) => `<span>${(start + i * direction + 20) % 10}</span>`).join('')}</span></span>`;
    }).join('');
    element.setAttribute('aria-label', money(to));
    [...element.querySelectorAll('.reel')].forEach((reel, i) => { reels[i].element = reel; });
    return reels;
  }
  _renderCounters(progress) {
    for (const { element, distance } of this._counters || []) {
      element.style.transform = `translateY(${-distance * progress}em)`;
      element.style.filter = distance ? `blur(${Math.sin(Math.PI * progress) * .065}em)` : 'none';
    }
  }
  _renderBalance(from = this._display, to = this._display) {
    this._counters = [
      ...this._prepareCounter(this._amount, from, to),
      ...this._prepareCounter(this._savings, from + 1037500, to + 1037500),
      ...this._prepareCounter(this._cardAmount, from, to)
    ];
    this._amount?.setAttribute('aria-label', `Demo spendable balance ${money(this._balance)}`);
    this._renderCounters(from === to ? 1 : 0);
  }

  _showIsland(amount, entry) {
    if (!this._island) return;
    clearTimeout(this._islandTimer);
    this._island.style.setProperty('--deposit-color', entry.color);
    this._island.style.setProperty('--deposit-ink', entry.ink || '#333');
    this._island.style.setProperty('--deposit-glow', entry.name === '@alexmorgan' ? '#87546a' : '#00639b');
    this._island.querySelector('.island-icon').textContent = entry.icon;
    this._island.querySelector('.island-receipt').textContent = amount < 0 ? 'Transfer sent' : entry.name === 'Invite bonus' ? 'Credits received' : 'Deposit received';
    this._islandValue = Math.abs(amount);
    this._counters.push(...this._prepareCounter(this._islandAmount, 0, this._islandValue));
    this._island.dataset.expanded = 'true';
    this._islandTimer = setTimeout(() => this._hideIsland(), Math.max(2800, this._number('elasticity', 1, 0, 2) * 1800 + 600));
  }
  _hideIsland() {
    clearTimeout(this._islandTimer);
    this._islandTimer = 0;
    if (this._island) this._island.dataset.expanded = 'false';
  }

  _takeControl() { this._manual = true; this._stopAutoplay(); }
  _stopAutoplay() { clearTimeout(this._autoplayTimer); this._autoplayTimer = 0; }
  _syncAutoplay() {
    const allowed = this._events && this.hasAttribute('autoplay') && !this._manual && this._visible && !document.hidden && !this.hasAttribute('static') && !this._motion.matches && this._number('elasticity', 1, 0, 2) > 0;
    if (!allowed) { this._stopAutoplay(); return; }
    if (this._autoplayTimer) return;
    this._autoplayTimer = setTimeout(() => {
      this._autoplayTimer = 0;
      if (this._playStep === 3) { this.reset(); return; }
      const entry = deposits[this._depositIndex % deposits.length];
      if (this._change(entry.amount, entry)) { this._depositIndex++; this._playStep = (this._playStep || 0) + 1; }
      else { this._takeControl(); return; }
      this._autoplayTimer = setTimeout(() => { this._autoplayTimer = 0; this._syncAutoplay(); }, 3400);
    }, 1400);
  }

  _setTab(tab) {
    this._tab = tab;
    this._tabs?.forEach(button => {
      const active = button.dataset.tab === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    this._renderActivity();
  }
  _renderActivity() {
    if (!this._activity) return;
    const entries = this._tab === 'earn' ? earnTransactions : this._tab === 'rewards' ? rewardTransactions : this._transactions;
    this._activity.setAttribute('aria-labelledby', `${this._tab}-tab`);
    this._activity.innerHTML = (this._tab === 'home' ? '' : `<h2 class="activity-heading">${this._tab === 'earn' ? 'Demo earnings' : 'Demo rewards'}</h2>`) + entries.map(entry => `<div class="transaction${entry.fresh ? ' new' : ''}"><span class="merchant-icon" aria-hidden="true" style="--icon-bg:${entry.color};--icon-ink:${entry.ink || '#333'}">${entry.icon}</span><span><span class="merchant">${entry.name}</span><small>${entry.note}</small></span><span><span class="amount${entry.amount > 0 ? ' positive' : ''}">${entry.amount > 0 ? '+' : '-'}${money(Math.abs(entry.amount))}</span>${entry.cashback ? `<span class="cashback">${entry.cashback}</span>` : ''}</span></div>`).join('');
  }

  deposit() {
    if (!this._events) return false;
    this._takeControl();
    const entry = deposits[this._depositIndex % deposits.length];
    if (!this._change(entry.amount, entry)) return false;
    this._depositIndex++;
    return true;
  }
  send() {
    if (!this._events) return false;
    this._takeControl();
    return this._change(-5000, { name: 'Alex Morgan', note: 'Demo send · 1:35 PM', icon: 'A', color: '#e3e3e3' });
  }

  _change(amount, entry) {
    if (this._balance + amount < 0 || this._balance + amount > 99999999) {
      this._status.textContent = 'Demo balance is outside the allowed range. No funds were moved.';
      return false;
    }
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    const from = this._display;
    this._balance += amount;
    this._transactions = [{ ...entry, amount, fresh: true }, ...this._transactions.map(item => ({ ...item, fresh: false }))].slice(0, 5);
    this._setTab('home');
    this._renderBalance(from, this._balance);
    this._showIsland(amount, entry);
    this._status.textContent = `${entry.name}: ${amount > 0 ? 'added' : 'sent'} ${money(Math.abs(amount))}. Demo balance ${money(this._balance)}.`;
    this.dispatchEvent(new CustomEvent('balance-change', { detail: { balance: this.balance, amount: amount / 100, source: entry.name }, bubbles: true, composed: true }));
    const duration = this._number('elasticity', 1, 0, 2) * 1800;
    if (!duration || this.hasAttribute('static') || this._motion.matches) { this._finishBalance(); return true; }
    const start = performance.now();
    const target = this._balance;
    const tick = now => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - (1 - progress) ** 3;
      this._display = Math.round(from + (target - from) * eased);
      this._renderCounters(eased);
      this._frame = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    this._frame = requestAnimationFrame(tick);
    return true;
  }

  _finishBalance() {
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    if (this._balance !== undefined) { this._display = this._balance; this._renderBalance(); }
    if (this._islandValue !== undefined) this._prepareCounter(this._islandAmount, this._islandValue, this._islandValue);
  }
  reset() {
    this._stopAutoplay();
    this._hideIsland();
    cancelAnimationFrame(this._frame);
    this._frame = 0;
    this._balance = this._initialBalance();
    this._display = this._balance;
    this._depositIndex = 0;
    this._playStep = 0;
    this._manual = false;
    this._transactions = initialTransactions.map(entry => ({ ...entry }));
    this._renderBalance();
    this._setTab('home');
    if (this._status) this._status.textContent = '';
    this._syncAutoplay();
  }
  disconnectedCallback() {
    this._events?.abort();
    this._events = null;
    this._observer?.disconnect();
    this._visible = false;
    this._stopAutoplay();
    this._hideIsland();
    this._finishBalance();
  }
}

if (!customElements.get('plasma-app-scene')) customElements.define('plasma-app-scene', PlasmaAppScene);

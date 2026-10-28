(() => {
  const recorder = document.querySelector('#hero-recorder');
  const hero = document.querySelector('.hero');
  const modeLabel = document.querySelector('#mode-label');
  const previewNote = document.querySelector('#preview-note');
  const micButton = document.querySelector('#enable-mic');
  const restartButton = document.querySelector('#restart-preview');

  if (!recorder) return;

  const bloom = (amount) => `radial-gradient(ellipse at 32% 110%,rgb(255 174 96 / ${amount}),transparent 47%),radial-gradient(ellipse at 58% 110%,rgb(233 130 255 / ${amount * .85}),transparent 45%),radial-gradient(ellipse at 83% 115%,rgb(100 182 255 / ${amount}),transparent 50%),linear-gradient(160deg,rgb(255 255 255 / .2),transparent 43%)`;

  micButton.addEventListener('click', async () => {
    if (recorder.hasAttribute('demo')) recorder.removeAttribute('demo');
    modeLabel.textContent = 'MICROPHONE MODE';
    previewNote.textContent = 'Audio stays in this browser. Nothing is uploaded.';
    await recorder.start();
  });
  recorder.addEventListener('record-start', ({ detail }) => {
    if (!detail.demo) { micButton.querySelector('span').textContent = 'Microphone is recording'; micButton.disabled = true; }
  });
  recorder.addEventListener('record-stop', ({ detail }) => {
    if (!detail.demo) { micButton.querySelector('span').textContent = 'Record another take'; micButton.disabled = false; }
  });
  recorder.addEventListener('record-error', () => {
    micButton.querySelector('span').textContent = 'Try your microphone'; micButton.disabled = false;
  });
  restartButton.addEventListener('click', () => {
    recorder.reset(); recorder.setAttribute('demo', '');
    modeLabel.textContent = 'LIVE PREVIEW'; previewNote.textContent = 'A visual preview. Your microphone is off.';
    micButton.querySelector('span').textContent = 'Try your microphone'; micButton.disabled = false;
  });

  document.querySelectorAll('.scene-thumb').forEach((button) => button.addEventListener('click', () => {
    hero.dataset.scene = button.dataset.scene;
    document.querySelectorAll('.scene-thumb').forEach((item) => {
      const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active));
    });
  }));

  const tuningPanel = document.querySelector('#tuning-panel');
  const tuneButton = document.querySelector('#tune-button');
  function toggleTuning(open) {
    tuningPanel.hidden = !open; tuneButton.setAttribute('aria-expanded', String(open));
    if (open) {
      const renderer = recorder.shadowRoot.querySelector('liquid-glass').dataset.renderer;
      document.querySelector('#renderer-note').textContent = renderer === 'refraction' ? 'EDGE REFRACTION + BACKDROP BLUR' : 'COMPATIBLE BACKDROP BLUR';
      document.querySelector('#refraction').focus();
    } else tuneButton.focus();
  }
  tuneButton.addEventListener('click', () => toggleTuning(tuningPanel.hidden));
  document.querySelector('#close-tuning').addEventListener('click', () => toggleTuning(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !tuningPanel.hidden) toggleTuning(false); });
  for (const name of ['refraction', 'blur', 'elasticity', 'glow']) {
    const input = document.querySelector(`#${name}`);
    input.addEventListener('input', () => {
      document.querySelector(`#${name}-value`).value = input.value;
      if (name === 'glow') recorder.style.setProperty('--glass-light', bloom(Number(input.value) / 100));
      else recorder.setAttribute(name, input.value);
    });
  }
  document.querySelector('#reset-tuning').addEventListener('click', () => {
    for (const [name, value] of Object.entries({ refraction: 64, blur: 2, elasticity: 1.35, glow: 70 })) {
      const input = document.querySelector(`#${name}`); input.value = value; input.dispatchEvent(new Event('input'));
    }
  });

  document.querySelector('#like-button').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const pressed = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(pressed));
    button.querySelector('span').textContent = pressed ? 'A little love for glass' : 'Made to feel good';
  });
  document.querySelector('#shuffle-surface').addEventListener('click', () => document.querySelector('.surface-showcase').classList.toggle('alternate'));

  const snippets = {
    html: `<script type="module" src="/liquid-glass.js"></script>\n\n<!-- A surface for your own content -->\n<liquid-glass radius="24" blur="5">\n  <div style="padding: 24px">Hello, glass.</div>\n</liquid-glass>\n\n<!-- A complete audio recorder -->\n<liquid-recorder></liquid-recorder>`,
    react: `import './liquid-glass.js';\n\nexport default function App() {\n  return (\n    <>\n      <liquid-glass radius="24" blur="5">\n        <div style={{ padding: 24 }}>Hello, glass.</div>\n      </liquid-glass>\n      <liquid-recorder />\n    </>\n  );\n}`,
    vue: `<script setup>\nimport './liquid-glass.js';\n</script>\n\n<template>\n  <liquid-glass radius="24" blur="5">\n    <div style="padding: 24px">Hello, glass.</div>\n  </liquid-glass>\n  <liquid-recorder />\n</template>\n<!-- Configure isCustomElement; see the guide. -->`
  };
  let language = 'html';
  function renderCode(next) {
    language = next;
    document.querySelector('#integration-code').textContent = snippets[language];
    document.querySelectorAll('[data-language]').forEach((tab) => {
      const active = tab.dataset.language === language;
      tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
    });
    document.querySelector('#code-panel').setAttribute('aria-labelledby', `${language}-tab`);
  }
  const tabs = [...document.querySelectorAll('[data-language]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderCode(tab.dataset.language));
    tab.addEventListener('keydown', (event) => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next !== null) { event.preventDefault(); tabs[next].focus(); renderCode(tabs[next].dataset.language); }
    });
  });
  document.querySelector('#copy-code').addEventListener('click', async () => {
    const button = document.querySelector('#copy-code');
    try {
      await navigator.clipboard.writeText(snippets[language]);
      button.textContent = 'Copied ✓'; document.querySelector('#copy-status').textContent = 'Integration code copied.';
      setTimeout(() => { button.innerHTML = 'Copy <span>⧉</span>'; }, 1800);
    } catch {
      document.querySelector('#copy-status').textContent = 'Clipboard is unavailable. Select the code and copy it manually.';
      button.textContent = 'Select code';
      const selection = getSelection(); const range = document.createRange();
      range.selectNodeContents(document.querySelector('#integration-code')); selection.removeAllRanges(); selection.addRange(range);
    }
  });
  renderCode('html');
})();

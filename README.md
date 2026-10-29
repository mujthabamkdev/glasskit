# Glasskit

Dependency-free liquid glass Web Components, inspired by the supplied Liquid Glass Recorder screenshots. This is an independent implementation with original artwork; it does not contain the reference site's commercial source or assets.

## Preview

Open `index.html` directly in a modern browser. The demo uses ordinary deferred scripts, so its visual preview works over `file://` without a build tool or local server. All artwork is local.

For actual microphone recording, serve over HTTPS or localhost:

```sh
npm run dev
# http://127.0.0.1:4173
```

The hero starts as a circular glass control in clearly labeled **demo mode**. Its white square turns red and the circle stretches into a capsule when clicked. This preview does not request microphone access or record audio. Click **Try your microphone** to start real recording. Press the red square to stop; the control contracts and playback/download appear. The app never uploads audio.

## Add to any website

Copy `dist/liquid-glass.global.js` to your site, then use a classic script. This also works when opening a local HTML file directly:

```html
<script defer src="/liquid-glass.global.js"></script>

<liquid-glass radius="28" blur="4" refraction="50" elasticity="1.3">
  <div style="padding: 24px">Your content goes here.</div>
</liquid-glass>

<liquid-recorder download-name="my-recording"></liquid-recorder>
```

Alternatively, use the ES module on a served website:

```html
<script type="module" src="/liquid-glass.js"></script>
<liquid-recorder></liquid-recorder>
```

Both scripts register `<liquid-glass>` and `<liquid-recorder>` automatically. Choose one script format; do not load both. The component works against the actual content behind it: give it an image, gradient, or other visible backdrop. Content passed to `<liquid-glass>` stays in the light DOM; component styles stay in Shadow DOM.

### React

```jsx
// Use in a client-side entry point. For Next.js, import from a "use client" module.
import './liquid-glass.js';

export function GlassCard() {
  return (
    <liquid-glass radius="24" elasticity="1.3">
      <div style={{ padding: 24 }}>Hello, glass.</div>
    </liquid-glass>
  );
}
```

For React + TypeScript, add your framework's custom-element JSX declarations for these two tags. The included `.d.ts` file types the DOM elements and events; it does not alter React's JSX namespace.

### Vue

Tell Vue these tags are custom elements. With Vite:

```js
// vite.config.js
import vue from '@vitejs/plugin-vue';
export default {
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['liquid-glass', 'liquid-recorder'].includes(tag)
      }
    }
  })]
};
```

Then import `liquid-glass.js` in your client entry and use either tag in your template. Static HTML, Svelte, and CMS templates can use the classic script directly. No framework adapter is required.

## Attributes

Both elements accept:

| Attribute | Default | Purpose |
| --- | --- | --- |
| `blur` | `5` | Backdrop blur in pixels, from 0 to 40. |
| `refraction` | `36` | Edge lens displacement, from 0 to 100. Set 0 for CSS blur only. |
| `radius` | `28` / capsule for recorder | Corner radius in pixels. |
| `elasticity` | `1` | Pointer-driven water deformation, from 0 to 2. |
| `static` | absent | Disables pointer deformation. |
| `appearance` | light | Set `dark` for a darker surface. |

Recorder-only attributes:

| Attribute | Purpose |
| --- | --- |
| `demo` | Simulates elapsed time; captures no audio and produces no download. |
| `disabled` | Disables controls. Adding it cancels and releases any active capture. |
| `download-name` | Download filename without extension. The appropriate extension is added. |

Water deformation follows the pointer near the edge, bends the lens texture, and settles with a damped spring. The text and controls stay stable. Touch drags create a local swell without blocking page scroll. Reduced-motion preferences disable it.

## Style with CSS

```css
liquid-glass {
  --glass-radius: 28px;
  --glass-blur: 4px;
  --glass-refraction: 50;
  --glass-saturation: 1.6;
  --glass-opacity: .12;
  --glass-tint: rgb(230 244 255 / .16);
  --glass-light: linear-gradient(145deg, #ffffff33, transparent 60%);
  --glass-rim-opacity: .9;
  --glass-color: #fff;
  --glass-shadow: 0 20px 50px -15px #11234466;
}

liquid-recorder {
  width: 560px;
  --recorder-accent: #ff504f;
  --recorder-color: #fff;
  --recorder-height: 158px;
  --recorder-time-size: 64px;
  --recorder-button-size: 106px;
}
```

Explicit attributes override corresponding CSS variables. Call a glass surface's `refresh()` after changing stylesheet rules that affect its blur, radius, or refraction without a resize. Recorder glass is exposed as `recorder.shadowRoot.querySelector('liquid-glass')`.

CSS parts: the surface exposes `surface`, `backdrop`, and `content`; the recorder exposes `glass`, `controls`, `timer`, `button`, and `result`.

## Recorder API and events

```js
const recorder = document.querySelector('liquid-recorder');

// Call from an explicit user gesture, such as a button click.
await recorder.start();
recorder.stop();
recorder.download();
recorder.reset();

recorder.addEventListener('record-stop', (event) => {
  const { blob, url, duration, mimeType, demo } = event.detail;
  if (!demo) console.log({ blob, url, duration, mimeType });
});

recorder.addEventListener('record-error', (event) => {
  console.error(event.detail.message);
});
```

- `state`: `idle`, `requesting`, `recording`, `processing`, or `recorded`.
- `duration`: elapsed seconds.
- `blob`: captured audio, or `null`.
- `recordingUrl`: temporary object URL, or `null`.
- `record-start`: `{ demo }`.
- `record-stop`: `{ blob, url, duration, mimeType, demo }`.
- `record-error`: `{ error, message }`.

Events bubble and cross Shadow DOM boundaries. In demo mode, `record-stop` returns null audio fields. Real MIME type is negotiated with the browser: WebM/Opus, MP4 audio, or Ogg/Opus. Download extensions follow the captured format.

Starting a new recording, resetting, or removing the element releases microphone tracks and revokes its object URL. Keep the `blob` if you need to retain the recording. Resetting during a pending permission request also releases a stream if the request subsequently resolves.

## Compatibility and boundaries

- Modern browsers with Custom Elements, Shadow DOM, ResizeObserver, and CSS `clip-path: path()`.
- Chromium gets an SVG displacement lens with backdrop blur. Safari and Firefox use CSS backdrop blur with the same elastic contour. Refraction is an enhancement and can render differently across engines; complex transformed/filtering ancestors can also affect backdrop sampling.
- Rendering uses a generated local displacement map. If your Content Security Policy restricts images, allow `data:` in `img-src` or use `refraction="0"`. The component also injects Shadow DOM styles, which require an appropriate `style-src` policy.
- Microphone capture requires HTTPS or localhost, permission, and MediaRecorder support. Embedded iframes need permission delegated by their parent (`allow="microphone"`). File opening is intended for the visual demo; use a secure served origin for recording.
- Keyboard-operable controls, focus indicators, readable error messages, and reduced-motion/reduced-transparency support are included. Visual contrast depends on the chosen background and tint.
- No copied paid code, remote assets, analytics, audio uploads, or runtime dependencies.

## Scene components

The UI cards and glass slider detail pages include the same backdrop choices, appearance controls, preview reset, and integration options as the Liquid Recorder page. Download the scene's module from its detail page, then add it to your site:

```html
<script type="module" src="/ui-cards.js"></script>
<ui-cards-scene refraction="36" blur="0" elasticity="1" glow="70"></ui-cards-scene>

<script type="module" src="/glass-slider.js"></script>
<glass-slider-scene refraction="36" blur="0" elasticity="1" glow="70"></glass-slider-scene>
```

Each scene is a standalone module with no dependencies. Give the element a width; its height follows its aspect ratio. Both support these appearance attributes:

| Attribute | Default | Purpose |
| --- | --- | --- |
| `refraction` | `36` | Orb lens strength or card curvature and edge light, from 0 to 100. |
| `blur` | `0` | Frosted orb finish or softened card backgrounds, from 0 to 24. |
| `elasticity` | `1` | Orb deformation or card bending, from 0 to 2. |
| `glow` | `70` | Material color intensity, from 0 to 100. |
| `preview` | absent | Hides the scene's navigation and pause controls for a gallery preview. |

Swipe, use the arrow keys, or press the scene's previous/next buttons to browse. The pause button stops automatic animation. Call `scene.reset()` to return to the first item and resume the preview while keeping its appearance settings. Reduced-motion preferences still apply. WebGL renders the full scenes; a readable static fallback is available when WebGL is disabled.

In React, import the module in a client-side entry point and use its custom element directly. In Vue, import it and include `ui-cards-scene` and `glass-slider-scene` in your `isCustomElement` configuration, following the Vue example above.

### Postage stamps

The postage stamps scene is an independent HTML/CSS/SVG implementation inspired by the stamp styling of Dhruv Gupta / Pixelup Labs, [featured on Inspora](https://www.inspora.design/posts/postage-stamps). It uses no video, images, external fonts, or dependencies. The gallery and detail page render the same Web Component.

```html
<script type="module" src="/postage-stamps.js"></script>
<postage-stamps-scene label="Glasskit"
  refraction="36" blur="0" elasticity="1" glow="70">
</postage-stamps-scene>
```

Give the element a width; the scene stays square. `refraction` controls stamp spread (0–100), `blur` softens the surrounding documents (0–24), `elasticity` controls pointer tilt (0–2), and `glow` controls blue ink saturation (0–100). `label` changes the blue stamp's heading. Use `--stamp-blue`, `--stamp-paper`, and `--stamp-background` to change its colors. `preview` hides the instruction line; `static` disables hover and pointer tilt. Reduced-motion preferences disable tilt and animated transitions.

Select a stamp by clicking or pressing Enter/Space. Left/right arrows, Home, and End select and focus another stamp. Escape or `scene.reset()` restores the stack without changing appearance settings. The composed, bubbling `stamp-select` event returns `{ index }` (0–2, or -1 when reset).

In React, import the module in a client-side entry point. In Vue, register `postage-stamps-scene` in `isCustomElement`. Download the standalone module from `/postage-stamps` and use it on any served site.

### Platinum Visa card

The platinum card scene is an independent HTML/CSS/SVG implementation inspired by [Juliette's design on Inspora](https://www.inspora.design/posts/platinum-visa-card). It renders brushed metal, a gold chip, embossed details, and six separated 3D layers. No video, images, external fonts, or dependencies are needed. This is a display-only design component, not a payment form.

```html
<script type="module" src="/platinum-visa-card.js"></script>
<platinum-visa-card-scene cardholder="Alex Morgan"
  refraction="36" blur="0" elasticity="1" glow="70">
</platinum-visa-card-scene>
```

Give the element a width; its scene maintains a 4:3 aspect ratio. `refraction` controls layer separation (0–100), `blur` controls the protective coating's frost (0–24), `elasticity` controls pointer tilt (0–2), and `glow` controls metal sheen (0–100). `cardholder` changes the displayed name. Use `--visa-background`, `--visa-metal`, and `--visa-ink` to change colors. `preview` hides the instruction line; `expanded` opens the layers initially; `static` disables pointer tilt and moving sheen. Reduced-motion preferences disable pointer effects and transition animation.

Click or press Enter/Space to expand/collapse the layers. Escape or `scene.reset()` restores the assembled card while preserving appearance settings. `scene.toggle()` toggles the layer view. User actions and reset emit a composed, bubbling `card-toggle` event with `{ expanded }`.

Download the standalone module from `/platinum-visa-card`. React and Vue integration follows the same custom-element setup as the other scenes; register `platinum-visa-card-scene` in Vue's `isCustomElement` configuration.

### Plasma app

The Plasma wallet scene is an independent HTML/CSS/SVG implementation inspired by [Sergei Semenov's design on Inspora](https://www.inspora.design/posts/plasma-app). It includes a rounded phone, engraved silver card, rolling balance digits, and bank, user, and invite deposit notifications. It is a local, in-memory demo: no payments, accounts, network requests, or remote artwork.

```html
<script type="module" src="/plasma-app.js"></script>
<plasma-app-scene balance="2450"
  refraction="36" blur="0" elasticity="1" glow="70">
</plasma-app-scene>
```

Give the element a width; the scene stays square. `balance` sets the initial demo balance in dollars (0–999999.99). `refraction` controls engraved groove contrast (0–100), `blur` controls navigation frost (0–24), `elasticity` controls counter motion duration (0–2, with 0 updating instantly), and `glow` controls green accent saturation (0–100). Colors use `--plasma-background`, `--plasma-metal`, and `--plasma-accent`. `preview` hides the instruction line. `static` and reduced-motion preferences disable counter, Dynamic Island, and notification animation.

Deposits expand the Dynamic Island into a tinted receipt with the sender's icon and a rolling amount, then collapse it back into the pill. Spendable, savings, and card balances use blurred odometer reels with stable cents. Optional `autoplay` cycles bank, user, and invite deposits, then resets the demo. The gallery and details preview enable it; standalone elements remain manual by default. Autoplay pauses offscreen or in a hidden browser tab and is disabled by `static`, reduced motion, or zero `elasticity`. Manual wallet actions stop autoplay; `reset()` restarts it when enabled.

Add funds cycles through demo bank deposits ($100), user transfers ($100), and invite rewards ($25). Send previews a $50 outgoing transfer. Home, Earn, and Rewards are keyboard-operable tabs. `scene.deposit()` and `scene.send()` return whether the demo transaction succeeded; `scene.balance` returns the current balance in dollars. `scene.reset()` restores the initial balance, transaction list, and tab without changing appearance settings. Rapid deposits cancel stale counter animations and keep exact cent-based totals. The composed, bubbling `balance-change` event returns `{ balance, amount, source }` in dollars.

Download the standalone module from `/plasma-app`. React and Vue integration follows the other custom-element scenes; register `plasma-app-scene` in Vue's `isCustomElement` configuration.

### Portfolio website

The garment portfolio is an independent HTML/CSS/WebGL implementation inspired by [Cambree Bernkopf's design on Inspora](https://www.inspora.design/posts/portfolio-website). Ten locally textured 3D garments hang on a chrome rack against a cream pegboard. Curved front/back panels, sewn sides, hollow sleeves, and open hems retain volume in the initial side view. Hovering rotates one garment front-facing and shifts its neighbors; damped vertex deformation moves hems and sleeves independently while shoulders stay anchored. Selecting opens a close-up over a softened rack; pointer movement tilts it and disturbs the cloth. Previous/next controls animate between garments, and Close returns to the rack. A decorative newsletter ticker completes the composition; it is not a subscription form. When WebGL is unavailable or its context is lost, local layered SVG artwork preserves all controls.

Download `portfolio-website.js` from `/portfolio-website`, then place it at the path used below:

```html
<script type="module" src="/portfolio-website.js"></script>
<portfolio-website-scene
  refraction="36" blur="0" elasticity="1" glow="70">
</portfolio-website-scene>
```

Give the element a width; its aspect ratio stays 8:5. `refraction` controls neighboring garment separation (0–100), `blur` controls close-up backdrop softness (0–24), `elasticity` sets transition duration and sway strength (0–2), and `glow` sets print saturation (0–100). At default elasticity, hover and viewer transitions take 1.45 seconds with gentle acceleration and deceleration; lower-frequency, bounded cloth impulses avoid fast whipping during rapid input. Sleeves use curved, flattened drape with gathered folds and uneven cuffs; a rounded rib-knit binding follows the open neckline. `label` safely replaces the wordmark as text. Colors use `--portfolio-paper`, `--portfolio-ink`, and `--portfolio-sky`; styling hooks are `scene`, `portfolio`, `rack`, `garment`, and `ticker` parts. `preview` hides the instruction line.

`scene.select(index)` browses garments; `scene.open(index)` opens a close-up (defaults to the selected garment or index 0). Indexes are zero-based, 0–9; `select(-1)` clears selection in rack view. Invalid indexes return `false`. `next()` and `previous()` wrap around, without changing the current view. `close()` restores the rack and keyboard focus; closing information opened from the viewer returns to that viewer. `reset()` clears selection, closes panels, and restarts an enabled preview without changing appearance settings. Read `selectedIndex`, `isOpen`, and `itemCount` for state. Composed, bubbling `portfolio-change` and `portfolio-view` events contain `{ index, name, view, open }`, with index -1/name null for no selection.

Use Tab to reach garments, Enter/Space to open, Left/Right to browse, Home/End for first/last, and Escape to close. Touch taps open garments; horizontal drags browse the rack, and swipes switch garments in the viewer. Vertical touch scrolling remains available. About, Contact, and Availability show local information panels only: no forms, purchases, messages, stock checks, external artwork, or network requests.

Opt-in `autoplay` demonstrates hover browsing → zoom → garment switches → close → reset; the gallery enables it, standalone use remains manual. The enlarged details preview uses `interaction-only`: no autoplay or automatic ticker motion, even after reset. Garments respond only to deliberate pointer, touch, or keyboard input. Manual interaction stops autoplay; `reset()` restarts it only when enabled and not `interaction-only`. Autoplay and the ticker pause offscreen or in hidden tabs. `static`, reduced-motion preferences (including live changes), and zero `elasticity` disable transitions, deformation, ticker motion, and autoplay while preserving all manual controls. Interrupted movement preserves the current cloth pose; matte diffuse lighting, fine fabric grain, and curved hems replace hard glossy folds. The event-driven render loop stops when cloth and transitions settle. Disconnect releases listeners, observers, timers, animation frames, and WebGL resources; reconnect recreates the renderer. Instances keep independent state. No renderer, texture, or artwork dependency is downloaded.

React and Vue integration follows the other custom-element scenes; register `portfolio-website-scene` in Vue's `isCustomElement` configuration. This standalone scene is not included in the core npm exports or `dist/` bundle.

## Development

### Replica-building skill

The repo-local [glasskit-replicas skill](.agents/skills/glasskit-replicas/SKILL.md) captures the workflow behind UI Cards, Glass Slider, Postage Stamps, Platinum Visa Card, and Plasma App: reference inspection, reusable Web Components, gallery placement, matching details pages, material and motion recipes, and verification.

OpenCode discovers `.agents/skills/` automatically. Mention `@glasskit-replicas` when adding or updating a replica, for example: “Use @glasskit-replicas to recreate this Inspora design at column 3, row 2.”

```sh
npm run build  # ES module, classic script, and declarations in dist/
npm test       # Capture lifecycle, permission races, and packaging checks
npm run dev    # Local preview on 127.0.0.1:4173
```

Build outputs are included, so using the components does not require npm. The package is ready to install from a local directory or tarball; it has not been published to npm.

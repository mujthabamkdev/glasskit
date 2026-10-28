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

Water deformation follows the mouse near the edge, bends the lens texture, and settles with a damped spring. The text and controls stay stable. Touch input does not start this hover effect. Reduced-motion preferences disable it.

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

## Development

```sh
npm run build  # ES module, classic script, and declarations in dist/
npm test       # Capture lifecycle, permission races, and packaging checks
npm run dev    # Local preview on 127.0.0.1:4173
```

Build outputs are included, so using the components does not require npm. The package is ready to install from a local directory or tarball; it has not been published to npm.

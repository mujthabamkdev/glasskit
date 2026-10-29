# Replica recipes from this repository

Repository paths below are root-relative. Read the relevant source when using a recipe; these are techniques and examples, not permission to overwrite existing scenes or freeze their future placement.

## UI Cards: procedural imagery and a rotating composition

Sources: `src/ui-cards.js`, `ui-cards.html`.

- Render a shared 5:4 scene in gallery and details.
- Generate panel imagery locally using Canvas 2D gradients and seeded grain rather than remote artwork. Cache/generated backgrounds should not be rebuilt unnecessarily on every frame.
- Use explicit spatial slots for foreground, background, rotation, scale, and curl/depth. Preserve the reference composition as panels move between slots.
- Keep navigation, drag, keyboard controls, current-item feedback, and reset attached to the same underlying state. `preview` hides secondary controls, not the scene itself.

## Glass Slider: procedural material rendering

Sources: `src/glass-slider.js`, `glass-slider.html`.

- Put the material inside a proportionally scaled phone composition. The reusable scene is square; the details stage has its own narrower sizing.
- Use WebGL for the refractive/deforming material, with a local CSS fallback when WebGL is unavailable. Do not add a rendering framework simply to reproduce one object.
- Drive material variation, movement, and recoil through shader parameters tied to interaction and appearance attributes.
- Keep the fallback navigable. Test renderer availability, resize, reduced motion, pointer cancellation, and disconnect resource cleanup as applicable.

## Postage Stamps: layered paper, perforation, and foil

Sources: `src/postage-stamps.js`, `postage-stamps.html`, `tests/postage-stamps.test.mjs`.

- Square scene with three overlapping stamps and surrounding clipped documents. Use a few meaningful background fragments, not large imported screenshots of documents.
- Perforated paper uses a composite CSS mask: a solid inset center plus repeated radial edge cutouts. Put artwork inside that paper shape; apply drop shadows outside the mask.
- Use clipped polygons for torn document edges, repeating gradients for charts/paper texture, and local SVG ribbons with metallic gradient stops for foil.
- Encode stamp offsets, angles, and layer order in custom properties. Selection lifts/unrotates the stamp and updates `aria-pressed`; a composed `stamp-select` event reports selection.
- Map `refraction` to spread, `blur` to paper softness, `elasticity` to pointer tilt, and `glow` to ink saturation. A custom `label` must be assigned as text.
- Reset clears selection and tilt without resetting tuning. Disable pointer effects for touch, static mode, zero tilt, or reduced motion as appropriate.

## Platinum Visa Card: six real 3D layers

Sources: `src/platinum-visa-card.js`, `platinum-visa-card.html`, `tests/platinum-visa-card.test.mjs`.

- 4:3 scene with a card matching the physical 85.6:54 proportion. Do not substitute the reference video.
- Use six separate spans: substrate, brushed metal, laminate, electronics/chip, personalization, and branding. The button assembly has `transform-style:preserve-3d` and the scene provides perspective.
- Closed layers sit nearly together. Expanded layers use level × gap on `translateZ`, with assembly rotation exposing separation. Keep embossed numbers/name on their own layer.
- Combine broad silver highlights with fine repeating gradients for brushed grain. Use a moving sheen, subtle text shadows for embossing, and CSS gold chip circuitry.
- Set `text-align:left` on the assembly button so browser button defaults do not center cardholder/details text.
- Click/Enter/Space toggles expansion, Escape resets, `expanded` reflects state, and `card-toggle` carries `{ expanded }` with bubbling/composed delivery.
- Map shared attributes to layer gap, laminate frost, pointer tilt, and sheen. Cancel a queued tilt frame before restoring the neutral pose.

## Plasma App: wallet numbers and Dynamic Island choreography

Sources: `src/plasma-app.js`, `plasma-app.html`, `tests/plasma-app.test.mjs`.

### Visual structure

- Square scene; black rounded phone frame around a white wallet UI. Include status bar/island, spendable balance, savings pill, action buttons, engraved silver card, activity rows, and bottom tabs.
- Silver card grooves use repeating linear gradients and paired dark/light edges. Use accent dots and tabular number sizing without loading remote assets.
- Demo transactions stay in memory. Store money in integer cents; format dollars with one reused `Intl.NumberFormat` instance.

### Odometer numbers

The initial attempt changed the balance numerically but kept the island static and retargeted short digit CSS transitions every frame. It did not reproduce the reference's visible motion.

- Build digit reels once per transaction, leaving currency symbols and separators fixed. Use a one-em clipping window and stacked one-em glyph rows.
- Calculate each digit's start, target, direction, and bounded travel from place values. Include a turn for lower-order carries; avoid thousands of repeated glyphs for a large deposit.
- When a whole-dollar transaction preserves cents, keep the fractional digits still. Intermediate rolling glyphs are visual motion; final accessible labels report the exact target balance.
- Drive spendable, savings, card, and receipt reels with one `requestAnimationFrame` loop and eased progress. Apply slight blur while rolling, then remove it at rest. Do not recreate markup every frame.
- On rapid input, cancel the old loop and start from current display state while updating the exact cent-based ledger. Test carries, downward sends, digit-count changes, and final semantic/display agreement.

### Dynamic Island

- Animate the small black pill into a rounded panel above the wallet's actions. It temporarily covers the upper balance region, not the Add funds/Send buttons.
- Coordinate width/height/corner expansion, a sender-tinted radial glow, sender icon, Spendable label, rolling received amount, and a checked receipt line.
- Bank/user deposits say “Deposit received”; invite credits and outgoing transfers use appropriate feedback. Keep a separate readable live status outside decorative rolling content.
- Hold long enough for the selected counter duration, then retract. Rapid transactions replace receipt content and cancel the previous collapse timer; reset/disconnect clear it.
- Reduced motion and static mode update the receipt and balances without animated transforms or morphing.

### Preview behavior

- Opt-in `autoplay` cycles bank $100 → user $100 → invite $25 → reset; gallery and details enable it. A bare imported component does not autoplay.
- Observe intersection and document visibility. Do not keep scheduling demo deposits while hidden. Manual deposit/send/tab navigation cancels autoplay; reset can restart it.
- `deposit()`/`send()` return success; guard overdrafts and the supported upper bound. `balance-change` reports `{ balance, amount, source }` in dollars.
- Test that a reconnection produces one event per action and no orphaned frame, observer, or timer.

## Existing gallery placement baseline

Check current `index.html` and `tests/gallery.test.mjs` before relying on these positions:

- Desktop: column 1 begins Recorder, UI Cards, Glass Slider; column 2 begins Postage Stamps then Platinum Visa Card; column 3 begins Plasma App.
- Tablet: Postage Stamps, Platinum Visa Card, and Plasma App share column 2 in that order.
- Mobile: one lane follows source order. Category filtering may omit earlier cards and therefore changes row numbers.

Preserve the other positions when adding a new replica. A later explicit user placement request overrides only the position it changes.

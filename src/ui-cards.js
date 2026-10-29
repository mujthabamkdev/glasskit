// Shared, dependency-free scene for the gallery preview and full-page demo.
const panels = [
  { title: 'Command', subtitle: 'Generative AI parameters', footer: 'Create with context  →', kind: 'sphere', base: '#008b80', clouds: [[.5,.56,.64,.62,'#330020'],[.1,.94,.52,.3,'#ff870b'],[.97,.96,.36,.3,'#ffc52d'],[.06,.02,.6,.25,'#4ccdc8']] },
  { title: 'Embedded', subtitle: 'Semantic retrieval', footer: 'Text Based', right: 'Image Based', kind: 'spiral', base: '#b7b9b6', clouds: [[.83,.1,.65,.52,'#ff771e'],[.53,.5,.44,.46,'#ffb073'],[.25,.62,.35,.38,'#839878'],[.34,1,.6,.27,'#bba3ee']] },
  { title: 'Arx Corpus', subtitle: 'Knowledge infrastructure', footer: 'Live Stream', kind: 'eclipse', base: '#d6cfee', clouds: [[.53,.51,.48,.53,'#031631'],[.73,.36,.41,.5,'#0079ef'],[.34,.91,.6,.28,'#62d9f8'],[.94,.02,.25,.68,'#ffb4ce']] },
  { title: 'Rerank', subtitle: 'Relevant results', footer: 'Surface what matters', kind: 'rank', base: '#d6d4db', clouds: [[.3,.08,.55,.42,'#979c35'],[.55,.6,.56,.53,'#2154fb'],[.92,.59,.3,.48,'#7009ed'],[.1,.98,.56,.28,'#f4cefb']] },
  { title: 'Northwalk', subtitle: 'Organization workspace', footer: 'Sync and Connected', kind: 'orbit', base: '#d5ced8', clouds: [[.22,.26,.64,.51,'#003f08'],[.51,.49,.45,.48,'#638a00'],[.94,.6,.33,.54,'#ff9134'],[.96,.06,.32,.3,'#eab3fb'],[.1,.83,.52,.23,'#ff909e']] }
];

const styles = `
  :host{display:block;position:relative;color:#fff;contain:content}
  *{box-sizing:border-box}
  .scene{position:relative;width:100%;aspect-ratio:5/4;overflow:hidden;background:#f2f5f6;isolation:isolate}
  canvas{display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}
  canvas:active{cursor:grabbing}
  canvas:focus-visible{outline:2px solid #626d7d;outline-offset:-4px}
  .controls{position:absolute;bottom:6%;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;color:#737d86;font:12px Inter,system-ui,sans-serif}
  button{display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid #dce1e5;border-radius:50%;background:#ffffffb3;color:#59636d;font:16px system-ui;cursor:pointer}
  button:hover{background:#fff;border-color:#aeb9c2}
  button:focus-visible{outline:2px solid #626d7d;outline-offset:3px}
  .count{min-width:32px;text-align:center;font-variant-numeric:tabular-nums}
  .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
  :host([preview]) .controls{display:none}
`;

const slots = [
  { x:500, scale:1, angle:0, curl:0, depth:3 },
  { x:925, scale:1, angle:-.22, curl:1, depth:2 },
  { x:725, scale:.46, angle:-.2, curl:0, depth:0 },
  { x:275, scale:.46, angle:.2, curl:0, depth:0 },
  { x:75, scale:1, angle:.22, curl:-1, depth:2 }
];

function cloud(ctx, x, y, rx, ry, color) {
  ctx.save();
  ctx.translate(x * 768, y * 960);
  ctx.scale(rx * 768, ry * 960);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, color);
  gradient.addColorStop(.38, color);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
}

function background(panel, width) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = width * 1.25;
  const ctx = canvas.getContext('2d');
  ctx.scale(width / 768, width / 768);
  ctx.fillStyle = panel.base;
  ctx.fillRect(0, 0, 768, 960);
  panel.clouds.forEach(args => cloud(ctx, ...args));
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let seed = 17;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const grain = ((seed >>> 24) / 255 - .5) * 15;
    for (let channel = 0; channel < 3; channel++) image.data[i + channel] += grain;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function point(ctx, x, y, alpha = .7, radius = 1.1) {
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function illustration(ctx, kind, time) {
  ctx.save();
  ctx.translate(384, 495);
  if (kind === 'sphere') {
    const rotation = time * .14;
    for (let latitude = 1; latitude < 35; latitude++) {
      const phi = Math.PI * latitude / 35;
      for (let longitude = 0; longitude < 64; longitude++) {
        const theta = Math.PI * 2 * longitude / 64 + rotation;
        const x = 239 * Math.sin(phi) * Math.cos(theta);
        const z = Math.sin(phi) * Math.sin(theta);
        const y = 239 * Math.cos(phi);
        point(ctx, x, y + x * .08, .2 + (z + 1) * .3, z > 0 ? 1.25 : .75);
      }
    }
    ctx.strokeStyle = '#ffffff55';
    ctx.lineWidth = .65;
    for (let ring = 0; ring < 8; ring++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 239, 42 + ring * 27, rotation + ring * Math.PI / 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (kind === 'spiral' || kind === 'orbit') {
    const orbit = kind === 'orbit';
    for (let strand = 0; strand < 38; strand++) {
      for (let step = 0; step < 58; step++) {
        const t = step / 57;
        const angle = strand / 38 * Math.PI * 2 + t * (orbit ? 3.9 : 1.65) + time * .09;
        const radius = orbit ? 140 + Math.sin(t * Math.PI) * 125 : Math.sin(t * Math.PI) * 210;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * (orbit ? .92 : 1) + (orbit ? 0 : (t - .5) * 66);
        point(ctx, x, y, .22 + Math.sin(t * Math.PI) * .5, .95);
      }
    }
    if (orbit) {
      ctx.strokeStyle = '#ffffffb0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(22, 12, 142, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (kind === 'eclipse') {
    const glow = ctx.createRadialGradient(0, 0, 90, 0, 0, 226);
    glow.addColorStop(0, '#001127');
    glow.addColorStop(.65, '#001127');
    glow.addColorStop(.72, '#00112700');
    glow.addColorStop(.78, '#91c9ff55');
    glow.addColorStop(.91, '#00112700');
    glow.addColorStop(1, '#00112700');
    ctx.fillStyle = glow;
    ctx.fillRect(-250, -250, 500, 500);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 151, 0, Math.PI * 2);
    ctx.clip();
    const shade = ctx.createLinearGradient(-140, 0, 140, 0);
    shade.addColorStop(0, '#e1efff');
    shade.addColorStop(.49, '#417dd1');
    shade.addColorStop(1, '#03162f');
    ctx.fillStyle = shade;
    ctx.fillRect(-151, 0, 302, 151);
    ctx.restore();
    for (let i = 0; i < 60; i++) {
      const angle = i / 60 * Math.PI * 2 + time * .02;
      point(ctx, Math.cos(angle) * 205, Math.sin(angle) * 205, i % 5 ? .3 : .85, 1.5);
    }
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#ffffffc0';
    ctx.fillText('DATA', -282, 10);
    ctx.fillText('●', 263, 10);
  } else {
    const glyphs = ['01110011110','10001010000','10001010000','11111010110','10001010010','10001010010','10001011110'];
    glyphs.forEach((row, y) => [...row].forEach((value, x) => {
      if (value === '1') point(ctx, (x - 5) * 15, (y - 3) * 15 - 58, .95, 2.8);
    }));
    ctx.strokeStyle = '#fffffff0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-320, 70);
    ctx.bezierCurveTo(-130, 70, 100, 50, 320, 83);
    ctx.stroke();
    const x = Math.sin(time * .25) * 140;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#d3ffab';
    point(ctx, x, 70, 1, 12);
  }
  ctx.restore();
}

class UICardsScene extends HTMLElement {
  static get observedAttributes() { return ['refraction', 'blur', 'elasticity', 'glow']; }

  attributeChangedCallback(name, oldValue, value) {
    if (oldValue === value) return;
    const [fallback, min, max] = { refraction:[36,0,100], blur:[0,0,24], elasticity:[1,0,2], glow:[70,0,100] }[name];
    const number = value === null || value.trim() === '' ? fallback : Number(value);
    this[`_${name}`] = Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    if (this._connected && this._canvas) {
      this._lastTextures = -Infinity;
      this._draw(performance.now());
    }
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._index = 0;
    this._moving = false;
    this._paused = false;
    this._visible = false;
    this._lastTextures = -Infinity;
    this._next = 0;
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${styles}</style><div class="scene"><canvas tabindex="0" role="img" aria-label="Command: generative AI parameters. Five curved gradient cards in a carousel. Use left and right arrow keys to browse."></canvas><div class="controls"><button class="previous" aria-label="Previous card">←</button><span class="count">1 / 5</span><button class="next" aria-label="Next card">→</button><button class="pause" aria-label="Pause animation">Ⅱ</button></div><span class="sr-only" aria-live="polite"></span></div>`;
    this._canvas = shadow.querySelector('canvas');
    this._gl = this._canvas.getContext('webgl', { alpha:false, antialias:true, preserveDrawingBuffer:false });
    const textureWidth = this.hasAttribute('preview') ? 384 : 768;
    this._backs = panels.map(panel => background(panel, textureWidth));
    this._textures = panels.map(() => {
      const canvas = document.createElement('canvas');
      canvas.width = textureWidth;
      canvas.height = textureWidth * 1.25;
      const ctx = canvas.getContext('2d');
      ctx.scale(textureWidth / 768, textureWidth / 768);
      return { canvas, ctx };
    });
    if (this._gl) this._setupGL();
    else {
      // A readable static card remains available when WebGL is disabled.
      const fallback = document.createElement('canvas');
      this._canvas.replaceWith(fallback);
      this._canvas = fallback;
      this._canvas.tabIndex = 0;
      this._canvas.setAttribute('role', 'img');
      this._canvas.setAttribute('aria-label', 'Command: generative AI parameters');
      this._fallback = fallback.getContext('2d');
    }
    this._resize = new ResizeObserver(() => this._size());
    this._resize.observe(this);
    this._intersection = new IntersectionObserver(([entry]) => {
      this._visible = entry.isIntersecting;
      if (this._visible) this._start();
      else this._stop();
    });
    this._intersection.observe(this);
    this._onVisibility = () => document.hidden ? this._stop() : this._start();
    document.addEventListener('visibilitychange', this._onVisibility);
    shadow.querySelector('.previous').addEventListener('click', () => this._advance(-1));
    shadow.querySelector('.next').addEventListener('click', () => this._advance(1));
    shadow.querySelector('.pause').addEventListener('click', () => {
      this._paused = !this._paused;
      this._syncPause();
      if (this._paused && !this._moving) this._stop();
      else this._start();
    });
    this._canvas.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        this._advance(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    this._canvas.addEventListener('pointerdown', event => { this._pointerX = event.clientX; });
    this._canvas.addEventListener('pointerup', event => {
      if (this._pointerX === undefined) return;
      const delta = event.clientX - this._pointerX;
      if (Math.abs(delta) > 24) this._advance(delta < 0 ? 1 : -1);
      else {
        const bounds = this._canvas.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        if (x < .3 || x > .7) this._advance(x < .3 ? -1 : 1);
      }
      this._pointerX = undefined;
    });
    this._canvas.addEventListener('pointercancel', () => { this._pointerX = undefined; });
    this._onMotion = () => { this._syncPause(); this._start(); };
    this._motion.addEventListener('change', this._onMotion);
    this._syncPause();
    this._size();
    document.fonts.ready.then(() => {
      if (!this.isConnected) return;
      this._lastTextures = -Infinity;
      this._draw(performance.now());
    });
  }

  reset() {
    if (!this._connected) return;
    this._stop();
    this._index = this._next = 0;
    this._paused = this._moving = false;
    this._pointerX = this._visualTime = undefined;
    this._lastTextures = -Infinity;
    const panel = panels[0];
    this._canvas.setAttribute('aria-label', `${panel.title}: ${panel.subtitle}. Use left and right arrow keys to browse.`);
    this.shadowRoot.querySelector('.count').textContent = '1 / 5';
    this.shadowRoot.querySelector('.sr-only').textContent = `${panel.title}. ${panel.subtitle}.`;
    this._syncPause();
    this._draw(performance.now());
    this._start();
  }

  _syncPause() {
    const paused = this._paused || this._motion.matches;
    const button = this.shadowRoot.querySelector('.pause');
    button.textContent = paused ? '▷' : 'Ⅱ';
    button.setAttribute('aria-label', this._motion.matches ? 'Animation disabled by reduced motion preference' : paused ? 'Play animation' : 'Pause animation');
    button.disabled = this._motion.matches;
  }

  _setupGL() {
    const gl = this._gl;
    const shader = (type, source) => {
      const result = gl.createShader(type);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
      return result;
    };
    const vertex = shader(gl.VERTEX_SHADER, `
      attribute vec2 a_uv;
      uniform float u_x, u_scale, u_angle, u_curl;
      varying vec2 v_uv;
      void main(){
        v_uv=a_uv;
        float edge=pow(.5+(a_uv.x-.5)*sign(u_curl),3.0)*abs(u_curl);
        float x=(a_uv.x-.5)*314.0;
        float y=(a_uv.y-.5)*396.0;
        float perspective=1.0+(x/1000.0)*sin(u_angle);
        x=(x*cos(u_angle)+edge*22.0*sign(u_curl))*u_scale/perspective;
        y=(y*(1.0+edge*1.05)+cos(a_uv.x*6.283)*3.0*(a_uv.y-.5))*u_scale/perspective;
        gl_Position=vec4((u_x+x)/500.0-1.0,-y/400.0,0.0,1.0);
      }
    `);
    const fragment = shader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_refraction;
      varying vec2 v_uv;
      void main(){
        vec2 p=abs(v_uv*vec2(314.0,396.0)-vec2(157.0,198.0))-vec2(140.0,181.0);
        float distance=length(max(p,0.0))+min(max(p.x,p.y),0.0)-17.0;
        float alpha=1.0-smoothstep(-.75,.75,distance);
        vec3 color=texture2D(u_texture,v_uv).rgb;
        float rim=smoothstep(-2.3,-.5,distance)*.28*(u_refraction/36.0);
        color=mix(color,vec3(1.0),rim);
        gl_FragColor=vec4(color,alpha);
      }
    `);
    this._program = gl.createProgram();
    gl.attachShader(this._program, vertex);
    gl.attachShader(this._program, fragment);
    gl.linkProgram(this._program);
    if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this._program));
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.useProgram(this._program);
    const vertices = [];
    const columns = 48, rows = 16;
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      const left=x/columns, right=(x+1)/columns, top=y/rows, bottom=(y+1)/rows;
      vertices.push(left,top, right,top, left,bottom, right,top, right,bottom, left,bottom);
    }
    this._vertexCount = vertices.length / 2;
    this._buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(this._program, 'a_uv');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    this._uniforms = Object.fromEntries(['x','scale','angle','curl','texture','refraction'].map(name => [name, gl.getUniformLocation(this._program, `u_${name}`)]));
    gl.uniform1i(this._uniforms.texture, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this._textures.forEach(texture => {
      texture.gl = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture.gl);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    });
  }

  _size() {
    const width = this.getBoundingClientRect().width;
    if (!width) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this._canvas.width = Math.round(width * ratio);
    this._canvas.height = Math.round(width * .8 * ratio);
    if (this._gl) this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._draw(performance.now());
  }

  _paintTextures(time) {
    this._textures.forEach((texture, index) => {
      const { ctx } = texture;
      const panel = panels[index];
      const frost = this._blur ?? 0;
      ctx.save();
      ctx.filter = `blur(${frost}px) saturate(${(this._glow ?? 70) / 70})`;
      ctx.drawImage(this._backs[index], -frost * 2, -frost * 2, 768 + frost * 4, 960 + frost * 4);
      ctx.restore();
      illustration(ctx, panel.kind, time);
      ctx.fillStyle = '#fff';
      ctx.font = '500 40px Inter, system-ui, sans-serif';
      ctx.fillText(panel.title, 55, 84);
      ctx.fillStyle = '#ffffff99';
      ctx.font = '300 30px Inter, system-ui, sans-serif';
      ctx.fillText(panel.subtitle, 55, 130);
      if (index === 0) {
        ctx.fillStyle = '#ffffff24';
        ctx.beginPath();
        ctx.roundRect(55, 836, 338, 86, 43);
        ctx.fill();
      }
      ctx.font = '400 29px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#fffffff2';
      ctx.fillText(panel.footer, index === 0 ? 87 : 55, 890);
      if (panel.right) {
        ctx.textAlign = 'right';
        ctx.fillText(panel.right, 713, 890);
        ctx.textAlign = 'left';
      }
      if (this._gl) {
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture.gl);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, texture.canvas);
      }
    });
  }

  _advance(direction) {
    if (this._moving) return;
    this._from = this._index;
    this._index = (this._index + direction + panels.length) % panels.length;
    this._transitionStart = performance.now();
    this._moving = !this._motion.matches && !!this._gl;
    this._next = this._transitionStart + 5000;
    const panel = panels[this._index];
    this.shadowRoot.querySelector('.count').textContent = `${this._index + 1} / 5`;
    this.shadowRoot.querySelector('.sr-only').textContent = `${panel.title}. ${panel.subtitle}.`;
    this._canvas.setAttribute('aria-label', `${panel.title}: ${panel.subtitle}. Use left and right arrow keys to browse.`);
    this._draw(this._transitionStart);
    this._start();
  }

  _draw(now) {
    if (now - this._lastTextures > 90) {
      if ((!this._paused && !this._motion.matches) || this._visualTime === undefined) this._visualTime = this._motion.matches ? 0 : now / 1000;
      this._paintTextures(this._visualTime);
      this._lastTextures = now;
    }
    if (!this._gl) {
      const ctx = this._fallback;
      const { width, height } = this._canvas;
      ctx.fillStyle = '#f2f5f6';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(this._textures[this._index].canvas, width*.343, height*.2525, width*.314, height*.495);
      return;
    }
    const progress = this._moving ? Math.min(1, (now - this._transitionStart) / 1450) : 1;
    const eased = progress < .5 ? 4*progress**3 : 1-(-2*progress+2)**3/2;
    const current = panels.map((_, index) => {
      const to = slots[(index - this._index + 5) % 5];
      const from = this._moving ? slots[(index - this._from + 5) % 5] : to;
      return { index, ...Object.fromEntries(Object.keys(to).map(key => [key, from[key] + (to[key]-from[key])*eased])) };
    }).sort((a,b) => a.depth-b.depth);
    const gl = this._gl;
    gl.clearColor(.949, .961, .965, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(this._uniforms.refraction, this._refraction ?? 36);
    current.forEach(panel => {
      gl.bindTexture(gl.TEXTURE_2D, this._textures[panel.index].gl);
      gl.uniform1f(this._uniforms.x, panel.x);
      gl.uniform1f(this._uniforms.scale, panel.scale);
      gl.uniform1f(this._uniforms.angle, panel.angle * (this._elasticity ?? 1));
      gl.uniform1f(this._uniforms.curl, panel.curl * (this._refraction ?? 36) / 36 * (this._elasticity ?? 1));
      gl.drawArrays(gl.TRIANGLES, 0, this._vertexCount);
    });
    if (progress === 1) this._moving = false;
  }

  _start() {
    if (this._frame || !this._visible || document.hidden) return;
    const tick = now => {
      if (!this.isConnected || !this._visible || document.hidden) {
        this._frame = 0;
        return;
      }
      this._draw(now);
      if (!this._next) this._next = now + 5000;
      if (!this._paused && !this._motion.matches && !this._moving && now > this._next) this._advance(1);
      if ((!this._paused && !this._motion.matches) || this._moving) this._frame = requestAnimationFrame(tick);
      else this._frame = 0;
    };
    this._frame = requestAnimationFrame(tick);
  }

  _stop() {
    cancelAnimationFrame(this._frame);
    this._frame = 0;
  }

  disconnectedCallback() {
    this._connected = false;
    this._stop();
    this._resize?.disconnect();
    this._intersection?.disconnect();
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._motion?.removeEventListener('change', this._onMotion);
    if (this._gl) {
      this._textures.forEach(texture => this._gl.deleteTexture(texture.gl));
      this._gl.deleteBuffer(this._buffer);
      this._gl.deleteProgram(this._program);
      this._gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }
}

customElements.define('ui-cards-scene', UICardsScene);

// Independent, procedural garment artwork; the gallery and details share this scene.
const garments = [
  { name: 'Archive Wash Tee', color: '#746960', ink: '#ded6ba', print: 'archive', type: 'tee' },
  { name: 'Made This Tee — Black', color: '#242226', ink: '#ede8df', print: 'small', type: 'tee' },
  { name: 'Made This Dollar Tee', color: '#f0ecea', ink: '#26252a', print: 'dollar', type: 'tee' },
  { name: 'Save The Dreamers Tee', color: '#262329', ink: '#e8e2d7', print: 'script', type: 'tee' },
  { name: 'Save Chicken Republic Crewneck', color: '#314d45', ink: '#e7e8d9', print: 'republic', type: 'crew' },
  { name: 'Remi 3 Long Sleeve', color: '#252126', ink: '#ede8e2', print: 'remi', type: 'long' },
  { name: 'Made This Flowers Tee', color: '#f1ebeb', ink: '#2e292a', print: 'flowers', type: 'tee' },
  { name: 'Made This Collar Tee', color: '#eeebea', ink: '#404238', print: 'collar', type: 'tee' },
  { name: 'Night Watch Tee', color: '#f0ebea', ink: '#333131', print: 'night', type: 'tee' },
  { name: 'Everyday Studio Tee', color: '#797985', ink: '#ddd9d0', print: 'small', type: 'tee' }
];

const transitionSeconds = 1.45;

function artwork(item) {
  const script = 'font-family="Georgia,serif" font-style="italic"';
  switch (item.print) {
    case 'small': return '<text x="120" y="116" text-anchor="middle" font-family="Georgia,serif" font-size="7">MadeThis</text>';
    case 'archive': return `<g opacity=".78"><text x="120" y="116" text-anchor="middle" font-size="21" font-family="Georgia,serif">STUDIO</text><text x="120" y="145" text-anchor="middle" font-size="29" font-family="Georgia,serif">ARCHIVE</text><path d="M82 160h76v56H82zM88 166h64v44H88z" fill="none" stroke="currentColor"/><text x="120" y="198" text-anchor="middle" font-size="25">26</text><text x="120" y="235" text-anchor="middle" font-size="8">COLLECTED, NOT CREATED</text></g>`;
    case 'dollar': return `<g><rect x="70" y="132" width="100" height="48" fill="#c3d6b6" stroke="#54866d" stroke-width="1"/><path d="M76 136h88v40H76zM79 140h82v32H79z" fill="none" stroke="#54866d"/><ellipse cx="120" cy="156" rx="15" ry="18" fill="none" stroke="#54866d"/><text x="120" y="164" text-anchor="middle" font-size="22" fill="#54866d">$</text><text x="120" y="144" text-anchor="middle" font-size="39" ${script}>Made</text><text x="120" y="198" text-anchor="middle" font-size="42" ${script}>This</text><text x="120" y="246" text-anchor="middle" font-size="5">MAKE THINGS THAT MATTER</text></g>`;
    case 'script': return `<text x="120" y="117" text-anchor="middle" font-size="21" ${script}>Save The</text><text x="120" y="145" text-anchor="middle" font-size="25" ${script}>Dreamers</text><text x="120" y="174" text-anchor="middle" font-size="22" ${script}>And Makers</text><text x="120" y="207" text-anchor="middle" font-size="6">BATCH / 026</text>`;
    case 'republic': return '<text x="120" y="115" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="21">Save</text><text x="120" y="140" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="21">Chicken</text><text x="120" y="165" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="21">Republic</text><text x="120" y="184" text-anchor="middle" font-size="4">SMALL BATCH, BIG IDEAS</text><path d="M115 198q5-13 10 0l-2 7h-7z"/>';
    case 'remi': return `<text x="120" y="122" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="33" transform="rotate(-5 120 122)">remi</text><text x="120" y="178" text-anchor="middle" font-family="Arial,sans-serif" font-size="67" font-weight="bold" fill="none" stroke="currentColor" stroke-width="1.5">3</text><text x="120" y="205" text-anchor="middle" font-size="5">WE WEREN'T SUPPOSED</text><text x="120" y="212" text-anchor="middle" font-size="5">TO LIVE THIS LONG</text>`;
    case 'flowers': return `<g>${Array.from({ length: 16 }, (_, i) => { const x = 75 + (i * 29) % 90; const y = 124 + (i * 23) % 83; const color = ['#df3c31','#6aa3b3','#ba8bb4','#8d9956','#dfba3b'][i % 5]; return `<g transform="translate(${x} ${y}) rotate(${i * 33})" fill="${color}">${Array.from({ length: 5 }, (_, p) => `<ellipse cy="-6" rx="2.8" ry="6" transform="rotate(${p * 72})"/>`).join('')}<circle r="2.2" fill="#e6dca5"/></g>`; }).join('')}<text x="120" y="118" text-anchor="middle" font-size="35" ${script}>Made</text><text x="120" y="224" text-anchor="middle" font-size="36" ${script}>This</text></g>`;
    case 'collar': return `<path d="M86 96q34-15 68 0M87 102q33-14 66 0" fill="none" stroke="#69735a"/><text x="120" y="143" text-anchor="middle" font-size="20" ${script}>Better</text><text x="120" y="169" text-anchor="middle" font-size="24" ${script}>Together</text><path d="m99 183 8 15 12-11 11 10 12-14" fill="none" stroke="currentColor"/>`;
    case 'night': return `<g fill="none" stroke="currentColor" stroke-width=".8"><path d="M83 244V151l37-46 37 46v93M77 244h86M82 237h77M89 149h62M99 133h43M100 158v78M114 158v78M127 158v78M140 158v78M83 169h74M83 184h74M83 199h74M83 214h74"/><path d="m122 104 17 20-4 20-10-3-6 8-10-12 7-13-4-8z" fill="currentColor"/>${Array.from({ length: 18 }, (_, i) => `<path d="M${85 + i * 4} 235v${-55 - i % 4 * 18}" opacity=".4"/>`).join('')}</g>`;
  }
}

function garmentSvg(item, index, back = false) {
  const shape = item.type === 'tee'
    ? 'M85 53Q73 55 60 64Q40 84 17 109L44 130Q55 124 62 111C65 151 58 197 62 268Q85 273 110 270Q145 278 178 269C181 218 174 153 177 110Q186 123 193 129L222 110Q203 82 180 64Q166 58 155 53Q120 68 85 53Z'
    : 'M85 53Q73 56 60 64Q48 83 43 102L28 260Q38 267 51 265L65 171C66 205 60 242 64 266Q91 273 117 270Q151 278 177 267C180 231 173 204 175 170L190 266Q203 269 214 261L196 102Q192 82 180 64Q166 57 155 53Q120 68 85 53Z';
  const id = `garment-${index}${back ? '-back' : ''}`;
  return `<svg class="garment${back ? ' garment-back' : ''}" viewBox="0 0 240 292" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-cloth" x1="0%" y1="0%" x2="100%" y2="12%"><stop stop-color="#000" stop-opacity=".09"/><stop offset=".25" stop-color="#fff" stop-opacity=".035"/><stop offset=".55" stop-color="#fff" stop-opacity=".015"/><stop offset="1" stop-color="#000" stop-opacity=".07"/></linearGradient>
      <linearGradient id="${id}-wood"><stop stop-color="#6c3423"/><stop offset=".3" stop-color="#bf835e"/><stop offset=".5" stop-color="#d29b70"/><stop offset=".52" stop-color="#88503a"/><stop offset="1" stop-color="#a46a4c"/></linearGradient>
      <linearGradient id="${id}-fold"><stop stop-color="#000" stop-opacity="0"/><stop offset=".38" stop-color="#000" stop-opacity=".085"/><stop offset=".68" stop-color="#fff" stop-opacity=".025"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="${id}-soft-fold"><feGaussianBlur stdDeviation="1.8"/></filter>
      <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".8 .92" numOctaves="2" seed="${index + 7}"/><feColorMatrix type="saturate" values="0"/></filter>
      <clipPath id="${id}-clip"><path d="${shape}"/></clipPath>
    </defs>
    <path d="M120 36V28c0-5 7-8 7-14a7 7 0 0 0-14 0" fill="none" stroke="#716357" stroke-width=".85"/>
    <path d="m106 31 28 0 1 13 31 20-4 3-42-21-42 21-5-3 32-20z" fill="url(#${id}-wood)"/><path d="M105 35h29M104 38h31M107 42l-26 20M134 42l26 20" fill="none" stroke="#694332" opacity=".28" stroke-width=".7"/>
    <g class="fabric"><path d="${shape}" fill="${item.color}"/><g clip-path="url(#${id}-clip)"><rect x="0" y="45" width="240" height="242" fill="url(#${id}-cloth)"/>
      ${item.print === 'archive' ? `<path d="M35 82q89-35 168 17l-22 35-39-9-20 48-30-34-39 36-10 75M63 187l44-13 28 38 32-2 17 42" fill="none" stroke="#37372d" stroke-width="21" opacity=".3"/>` : ''}
      <g class="print" fill="${item.ink}" color="${item.ink}">${artwork(item)}</g>
      <g filter="url(#${id}-soft-fold)"><path d="M66 77C91 129 70 192 66 269L86 272C86 196 95 130 76 76Z" fill="url(#${id}-fold)"/><path d="M167 77C148 129 166 210 159 271L180 271C170 216 164 131 178 77Z" fill="url(#${id}-fold)"/><path d="M110 218Q121 245 107 274h18Q136 247 117 215Z" fill="url(#${id}-fold)" opacity=".65"/><path d="M62 110q20 9 24 27M176 110q-22 7-29 24M65 239q17-8 27-4M151 249q13-10 25-6" fill="none" stroke="#000" stroke-opacity=".055" stroke-width="3" stroke-linecap="round"/></g>
      <rect width="240" height="292" filter="url(#${id}-grain)" opacity="${item.print === 'archive' ? '.17' : '.11'}" style="mix-blend-mode:soft-light"/>
    </g><path d="M86 54Q120 78 154 54M86 57Q120 82 154 57" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.4"/><path d="M65 265q23 6 46 3q34 7 64-1M65 268q23 6 46 3q34 7 64-1M62 65l7 43M178 65l-7 43" fill="none" stroke="#000" stroke-opacity=".085" stroke-width=".7"/><path d="M111 65h18v5h-18z" fill="${item.type === 'tee' ? '#e3dfdc' : '#1f2925'}" opacity=".8"/></g>
  </svg>`;
}

// Actual curved, hollow garment geometry. Front/back panels share sewn side edges;
// open sleeve tubes and the uncapped hem retain volume when viewed edge-on.
function clothMesh(type) {
  const vertices = [];
  const emit = (p, n, print, uv = [p[0] / 240, p[1] / 292]) => vertices.push(...p, ...n, ...uv, print);
  const quad = (a, b, c, d, print, reverse = false) => {
    for (const p of reverse ? [a, c, b, a, d, c] : [a, b, c, a, c, d]) emit(p.p, p.n, print, p.uv);
  };
  const smooth = value => { const t = Math.max(0, Math.min(1, value));return t * t * (3 - 2 * t); };
  const surface = (point, u, v, sign = 1) => {
    const p = point(u, v), across = point(u + .001, v), down = point(u, v + .001);
    const a = across.map((value, i) => value - p[i]), b = down.map((value, i) => value - p[i]);
    return { p, n: [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]].map(value => value * sign) };
  };
  const bodyPoint = (s, t, side) => {
    const half = 58 + Math.sin(t * Math.PI) * 2;
    const x = 120 + (s * 2 - 1) * (half + t ** 3 * 1.3 * Math.sin(t * 11));
    const distance = Math.abs(s * 2 - 1), neck = Math.max(0, 1 - (distance / .6) ** 2);
    const shoulder = smooth((distance - .6) / .4), anchor = (1 - t) ** 8;
    const top = 54 + (side === 1 ? 12 : 4) * neck + 11 * shoulder;
    const y = 55 + 214 * t + anchor * (top - 55) + t ** 6 * (2.2 * Math.sin(s * Math.PI * 3) + 1.5 * Math.sin(s * Math.PI * 7));
    const depth = 6.5 + Math.sin(s * Math.PI) * (10 + 2 * Math.sin(t * Math.PI) + (t ** 2 + .15) * 2.2 * Math.sin(s * Math.PI * 7 + .4 * Math.sin(t * 7)));
    const z = side * (depth * (1 - anchor) + (16.5 * Math.sqrt(neck) + 4 * shoulder) * anchor);
    return [x, y, z];
  };
  const body = (s, t, side) => surface((s, t) => bodyPoint(s, t, side), s, t, side);
  const rows = 30, columns = 20;
  for (const side of [1, -1]) for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
    quad(body(x / columns, y / rows, side), body((x + 1) / columns, y / rows, side), body((x + 1) / columns, (y + 1) / rows, side), body(x / columns, (y + 1) / rows, side), side === 1 ? 1 : 0, side === -1);
  }
  for (const edge of [0, 1]) for (let y = 0; y < rows; y++) {
    const points = [body(edge, y / rows, 1), body(edge, y / rows, -1), body(edge, (y + 1) / rows, -1), body(edge, (y + 1) / rows, 1)];
    points.forEach(p => { p.n = [edge === 0 ? -1 : 1, 0, 0]; });
    quad(...points, 0, edge === 0);
  }
  // Sew shoulder tops, leaving the curved neckline open in the middle.
  for (let x = 0; x < columns; x++) {
    if (x >= 4 && x < columns - 4) continue;
    const points = [body(x / columns, 0, 1), body((x + 1) / columns, 0, 1), body((x + 1) / columns, 0, -1), body(x / columns, 0, -1)];
    points.forEach(p => { p.n = [0, -1, 0]; });quad(...points, 0, true);
  }
  for (const direction of [-1, 1]) {
    const long = type !== 'tee';
    // A hanging Bezier centerline, flattened cross-section, and gathered folds:
    // sleeves drape from shoulders instead of looking like rigid round pipes.
    const controls = long ? [[50, 87], [86, 100], [72, 191], [85, 258]] : [[51, 88], [79, 93], [84, 109], [94, 121]];
    const sleevePoint = (t, angle, inner = false) => {
      const q = 1 - t;
      const center = [0, 1].map(axis => q ** 3 * controls[0][axis] + 3 * q ** 2 * t * controls[1][axis] + 3 * q * t ** 2 * controls[2][axis] + t ** 3 * controls[3][axis]);
      const tangent = [0, 1].map(axis => 3 * q ** 2 * (controls[1][axis] - controls[0][axis]) + 6 * q * t * (controls[2][axis] - controls[1][axis]) + 3 * t ** 2 * (controls[3][axis] - controls[2][axis]));
      const length = Math.hypot(...tangent), fold = Math.sin(Math.PI * t);
      const radius = (24 * q + (long ? 12 : 16) * t + (long ? 4 : 2.5) * fold) * (inner ? .88 : 1);
      const gather = 1 + .065 * Math.sin(angle * 3 + t * 11) * t + .045 * Math.cos(angle * 5 - t * 7) * fold;
      const cross = radius * gather * Math.cos(angle);
      const depth = (10 * q + (long ? 4 : 6) * t + 1.5 * fold) * (inner ? .88 : 1);
      return [120 + direction * (center[0] + tangent[1] / length * cross),
        center[1] - tangent[0] / length * cross + t ** 3 * .9 * Math.sin(angle * 3 + .5),
        depth * Math.sin(angle) + 1.5 * fold * Math.sin(t * 8 + direction) + 1.8 * fold * Math.sin(angle * 5 + t * 12) * Math.sin(angle) ** 2];
    };
    const sleeve = (t, angle, inner = false) => surface((t, angle) => sleevePoint(t, angle, inner), t, angle, direction);
    const bands = 30, segments = 32;
    for (let y = 0; y < bands; y++) for (let x = 0; x < segments; x++) {
      const a = x / segments * Math.PI * 2, b = (x + 1) / segments * Math.PI * 2;
      quad(sleeve(y / bands, a), sleeve((y + 1) / bands, a), sleeve((y + 1) / bands, b), sleeve(y / bands, b), 0, direction === -1);
    }
    // Turned-over cuff lip; the sleeve mouth remains open rather than a flat cap.
    for (let x = 0; x < segments; x++) {
      const a = x / segments * Math.PI * 2, b = (x + 1) / segments * Math.PI * 2;
      quad(sleeve(1, a), sleeve(1, b), sleeve(.98, b, true), sleeve(.98, a, true), 0, direction === -1);
    }
  }
  // Rounded rib-knit binding follows the actual oval neck opening, not a bar
  // joining rectangular shoulder panels. The center remains genuinely hollow.
  const collarPoint = (angle, round) => {
    const c = Math.cos(angle), s = Math.sin(angle), radial = Math.hypot(c / 34.8, s / 16.5);
    const radius = 1.3 + .08 * Math.cos(angle * 56);
    return [120 + 34.8 * c + c / 34.8 / radial * radius * Math.cos(round),
      54 + (s >= 0 ? 12 : 4) * s ** 2 + radius * Math.sin(round),
      16.5 * s + s / 16.5 / radial * radius * Math.cos(round)];
  };
  const collar = (angle, round) => ({ ...surface(collarPoint, angle, round, -1), uv: [angle / (Math.PI * 2), round / (Math.PI * 2)] });
  for (let i = 0; i < 96; i++) for (let j = 0; j < 8; j++) {
    const a = i / 96 * Math.PI * 2, b = (i + 1) / 96 * Math.PI * 2, c = j / 8 * Math.PI * 2, d = (j + 1) / 8 * Math.PI * 2;
    quad(collar(a, c), collar(b, c), collar(b, d), collar(a, d), -1, true);
  }
  return new Float32Array(vertices);
}

const clothVertex = `
  attribute vec3 a_position;attribute vec3 a_normal;attribute vec2 a_uv;attribute float a_print;
  uniform mat4 u_pose;uniform vec2 u_view;uniform vec2 u_cloth;uniform float u_phase;
  varying vec3 v_normal;varying vec2 v_uv;varying float v_print;varying float v_binding;
  void main(){
    vec3 p=a_position;
    float hem=pow(clamp((p.y-65.0)/205.0,0.0,1.0),2.4);
    float sleeve=smoothstep(52.0,104.0,abs(p.x-120.0))*.9;
    float free=max(hem,sleeve);
    float ripple=mix(sin(p.x*.075+p.y*.038+u_phase),sin(p.y*.045-u_phase*.7+p.x*.018),sleeve);
    p.x+=u_cloth.x*free*(.65+.35*sin(p.y*.028));
    p.z+=u_cloth.y*free*ripple;
    p.y+=u_cloth.y*free*.22*cos(p.x*.07+u_phase);
    vec3 normal=normalize(a_normal);
    normal.x-=u_cloth.x*free*.02;normal.z+=u_cloth.y*free*.045*ripple;
    v_normal=normalize(mat3(u_pose)*normal);v_uv=a_uv;v_print=max(0.0,a_print);v_binding=max(0.0,-a_print);
    vec4 q=u_pose*vec4(p,1.0);
    gl_Position=vec4(2.0*q.x/u_view.x-q.w,q.w-2.0*q.y/u_view.y,-q.z/600.0,q.w);
  }
`;
const clothFragment = `
  precision mediump float;
  uniform sampler2D u_texture;uniform vec3 u_color;uniform float u_opacity;uniform float u_saturation;uniform float u_blur;
  varying vec3 v_normal;varying vec2 v_uv;varying float v_print;varying float v_binding;
  void main(){
    vec4 ink=texture2D(u_texture,v_uv);
    if(u_blur>0.0){
      vec2 blur=vec2(u_blur/480.0,u_blur/584.0);
      ink=(ink*2.0+texture2D(u_texture,v_uv+blur)+texture2D(u_texture,v_uv-blur)+texture2D(u_texture,v_uv+vec2(blur.x,-blur.y))+texture2D(u_texture,v_uv+vec2(-blur.x,blur.y)))/6.0;
    }
    ink.rgb=mix(vec3(dot(ink.rgb,vec3(.2126,.7152,.0722))),ink.rgb,u_saturation);
    vec3 color=mix(u_color,ink.rgb,ink.a*v_print);
    vec3 n=normalize(v_normal);
    if(!gl_FrontFacing) n=-n;
    float diffuse=max(0.0,dot(n,normalize(vec3(-.45,-.65,1.0))));
    float weave=sin(v_uv.x*1950.0)*sin(v_uv.y*2160.0)*.012;
    color*=.72+.29*diffuse+weave;
    color*=1.0-v_binding*(.035+.018*cos(v_uv.x*352.0));
    if(!gl_FrontFacing) color*=.84;
    gl_FragColor=vec4(color,u_opacity);
  }
`;

class PortfolioCloth {
  constructor(scene) {
    this.scene = scene;this.disposed = false;this.states = garments.map(() => ({ bend: 0, velocity: 0, flutter: 0, flutterVelocity: 0 }));
    this.canvas = document.createElement('canvas');this.canvas.className = 'cloth-canvas';this.canvas.setAttribute('aria-hidden', 'true');
    scene._site.appendChild(this.canvas);
    try { this.initialize(); } catch { this.dispose(); }
  }
  initialize() {
    const scene = this.scene;
    this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!this.gl) throw new Error('WebGL unavailable');
    const gl = this.gl;
    this.shaders = [];
    const compile = (type, source) => {
      const shader = gl.createShader(type);this.shaders.push(shader);gl.shaderSource(shader, source);gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Cloth shader unavailable');
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, clothVertex), fragment = compile(gl.FRAGMENT_SHADER, clothFragment);
    this.program = gl.createProgram();gl.attachShader(this.program, vertex);gl.attachShader(this.program, fragment);gl.linkProgram(this.program);
    this.shaders.forEach(shader => gl.deleteShader(shader));this.shaders = [];
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error('Cloth program unavailable');
    this.uniforms = Object.fromEntries(['pose','view','cloth','phase','texture','color','opacity','saturation','blur'].map(name => [name, gl.getUniformLocation(this.program, `u_${name}`)]));
    this.attributes = Object.fromEntries(['position','normal','uv','print'].map(name => [name, gl.getAttribLocation(this.program, `a_${name}`)]));
    this.meshes = new Map();
    for (const type of ['tee', 'long']) {
      const mesh = clothMesh(type);const buffer = gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER, buffer);gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);this.meshes.set(type, { buffer, count: mesh.length / 9 });
    }
    this.textures = garments.map(() => gl.createTexture());
    this.resize = new ResizeObserver(() => this.wake(0));this.resize.observe(scene._site);
    this.canvas.addEventListener('webglcontextlost', event => { event.preventDefault();this.dispose(); }, { signal: scene._events.signal });
    Promise.all(garments.map((item, i) => this.loadTexture(item, i))).then(() => {
      if (this.disposed) return;
      this.ready = true;this.draw(performance.now());scene.setAttribute('data-cloth-renderer', 'webgl');
      this.scene._cancelAnimations();this.wake(this.scene._selected >= 0 ? this.scene._number('elasticity', 1, 0, 2) * transitionSeconds + .1 : 0);
    }).catch(() => this.dispose());
  }
  loadTexture(item, index) {
    const svg = garmentSvg(item, index);
    const defs = svg.slice(svg.indexOf('<defs>'), svg.indexOf('</defs>') + 7);
    const fabric = svg.slice(svg.indexOf('<g class="fabric">'), svg.lastIndexOf('</svg>'));
    const image = new Image();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        try { if (!this.disposed) {
          const gl = this.gl;gl.bindTexture(gl.TEXTURE_2D, this.textures[index]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        } } catch (error) { reject(error); }
        image.onload = image.onerror = null;resolve();
      };
      image.onerror = () => { image.onload = image.onerror = null;reject(new Error('Local cloth texture unavailable')); };
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="584" viewBox="0 0 240 292">${defs}${fabric}</svg>`)}`;
    });
  }
  disturb(index, old = -1, force = 1) {
    if (!this.scene._motionAllowed()) return;
    this.states.forEach((state, i) => {
      const distance = Math.min(index < 0 ? 20 : Math.abs(i - index), old < 0 ? 20 : Math.abs(i - old));
      if (distance > 2) return;
      const impulse = Math.min(2, Math.max(-2, force)) / (1 + distance * .7);
      state.velocity = Math.max(-66, Math.min(66, state.velocity + impulse * (i < index ? -30 : 30)));
      state.flutterVelocity = Math.max(-48, Math.min(48, state.flutterVelocity + impulse * 24));
    });
    this.wake(2.8);
  }
  nudge(index, pixels) { if (index >= 0 && Math.abs(pixels) > .1) this.disturb(index, -1, Math.max(-.08, Math.min(.08, pixels / 60))); }
  wake(seconds = 1.8) {
    if (this.disposed || !this.ready) return;
    if (!this.scene._visible || document.hidden) { this.pause();return; }
    const duration = this.scene._motionAllowed() ? seconds : 0;
    this.until = Math.max(this.until || 0, performance.now() + duration * 1000);
    if (this.frame) return;
    this.last = performance.now();
    const tick = now => {
      this.frame = 0;
      if (this.disposed) return;
      const dt = Math.min(.025, (now - this.last) / 1000);this.last = now;
      let moving = false;
      this.states.forEach(state => {
        state.velocity += (-state.bend * 22 - state.velocity * 7) * dt;state.bend += state.velocity * dt;
        state.flutterVelocity += (-state.flutter * 34 - state.flutterVelocity * 8) * dt;state.flutter += state.flutterVelocity * dt;
        if (Math.abs(state.velocity) + Math.abs(state.flutterVelocity) + Math.abs(state.bend) + Math.abs(state.flutter) > .035) moving = true;
      });
      this.draw(now);
      if (this.scene._motionAllowed() && (moving || now < this.until) && this.scene._visible && !document.hidden) this.frame = requestAnimationFrame(tick);
      else if (this.scene._motionAllowed() && moving === false) {
        this.states.forEach(state => { state.bend = state.velocity = state.flutter = state.flutterVelocity = 0; });
        this.draw(now);
      }
    };
    this.frame = requestAnimationFrame(tick);
  }
  draw(now) {
    if (this.disposed) return;
    const gl = this.gl, site = this.scene._site, rack = this.scene._rack;
    const width = site.clientWidth, height = site.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2, 1920 / width);
    if (this.canvas.width !== Math.round(width * dpr) || this.canvas.height !== Math.round(height * dpr)) { this.canvas.width = Math.round(width * dpr);this.canvas.height = Math.round(height * dpr); }
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);gl.clearColor(0, 0, 0, 0);gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);gl.frontFace(gl.CW);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.view, width, height);gl.uniform1i(this.uniforms.texture, 0);
    gl.uniform1f(this.uniforms.saturation, this.scene._number('glow', 70, 0, 100) / 70);
    const order = garments.map((_, i) => i).reverse().sort((a, b) => Number(a === this.scene._selected) - Number(b === this.scene._selected));
    for (const i of order) {
      const button = this.scene._buttons[i], style = getComputedStyle(button), size = parseFloat(style.width);
      const pose = new DOMMatrix().translate(rack.offsetLeft + parseFloat(style.left) + size / 2, rack.offsetTop + parseFloat(style.top)).multiply(new DOMMatrix(style.transform)).translate(-size / 2, 0).scale(size / 240);
      const mesh = this.meshes.get(garments[i].type === 'tee' ? 'tee' : 'long');gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
      for (const [name, size, offset] of [['position',3,0],['normal',3,12],['uv',2,24],['print',1,32]]) { const attribute = this.attributes[name];gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 36, offset); }
      gl.uniformMatrix4fv(this.uniforms.pose, false, pose.toFloat32Array());
      const state = this.states[i];gl.uniform2f(this.uniforms.cloth, state.bend, state.flutter);gl.uniform1f(this.uniforms.phase, now / 450 + i * 1.7);
      const color = garments[i].color.match(/\w\w/g).map(part => parseInt(part, 16) / 255);gl.uniform3fv(this.uniforms.color, color);
      // DOM stacking order wins between shirts; depth testing still resolves each
      // garment's front, back, sewn sides, and hollow sleeves correctly.
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(this.uniforms.blur, this.scene._view !== 'rack' && i !== this.scene._selected ? 3 + this.scene._number('blur', 0, 0, 24) / 2 : 0);
      gl.uniform1f(this.uniforms.opacity, parseFloat(style.opacity));gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    }
  }
  settle() { this.pause();this.states.forEach(state => { state.bend = state.velocity = state.flutter = state.flutterVelocity = 0; });this.wake(0); }
  pause() { cancelAnimationFrame(this.frame);this.frame = 0;this.until = 0; }
  dispose() {
    if (this.disposed) return;this.disposed = true;this.pause();this.resize?.disconnect();
    this.meshes?.forEach(mesh => this.gl.deleteBuffer(mesh.buffer));this.textures?.forEach(texture => this.gl.deleteTexture(texture));if (this.program) this.gl.deleteProgram(this.program);
    this.shaders?.forEach(shader => this.gl.deleteShader(shader));
    this.scene.removeAttribute('data-cloth-renderer');this.canvas.remove();
  }
}

const styles = `
  :host{display:block;width:100%;--portfolio-paper:#eae9e5;--portfolio-ink:#303a59;--portfolio-sky:#c7e6fc}
  *{box-sizing:border-box}button{font:inherit;color:inherit;cursor:pointer;touch-action:manipulation}button:focus-visible{outline:2px solid #446793;outline-offset:3px}
  .scene{position:relative;width:100%;aspect-ratio:8/5;container-type:inline-size;overflow:hidden;background:linear-gradient(145deg,var(--portfolio-sky),#eef7fd 80%);font-family:Arial,system-ui,sans-serif;color:var(--portfolio-ink);isolation:isolate}
  .site{position:absolute;inset:12.7% 7.9%;background:var(--portfolio-paper);border-radius:.2cqw;box-shadow:0 2cqw 4cqw #26374835;isolation:isolate;overflow:hidden;font-family:Arial,system-ui,sans-serif;touch-action:pan-y}
  .site::before{content:'';position:absolute;inset:10% 1% 4%;background:radial-gradient(circle at center,transparent .21cqw,#babbb23d .24cqw .31cqw,transparent .34cqw) 0 0/2.85cqw 2.25cqw;transition:opacity var(--duration,.7s)}
  .masthead{position:absolute;left:2%;right:2%;top:2.4%;display:flex;justify-content:space-between;align-items:center;transition:opacity var(--duration,.7s)}.masthead>button{padding:.7cqw 0;border:0;background:none;font-size:.78cqw;letter-spacing:.03em}.brand{font:bold italic 1.5cqw/.8 Georgia,serif;letter-spacing:-.1cqw;white-space:pre-line;transform:rotate(-13deg);text-align:center}
  .rack{position:absolute;left:12.5%;right:13.5%;top:26%;height:48%}
  .rail{position:absolute;left:0;right:0;top:0;height:.75cqw;border-radius:.2cqw;background:linear-gradient(#b7b8af,#fbfbf9 24%,#5a5e58 40%,#d4d5cf 64%,#f9f9f5 78%,#7b8178);box-shadow:0 .35cqw .5cqw #383c303a;transition:opacity var(--duration,.7s),filter var(--duration,.7s)}.rail::before,.rail::after{content:'';position:absolute;top:-.6cqw;width:1.45cqw;height:2.6cqw;border-radius:.3cqw;background:linear-gradient(90deg,#b9bcb3,#fafbf9 26%,#b3b6ad 53%,#fff 75%,#8e948a);box-shadow:0 .3cqw .4cqw #4548394d}.rail::before{left:-.2cqw}.rail::after{right:-.2cqw}.screw{position:absolute;top:.1cqw;width:.35cqw;height:.35cqw;border-radius:50%;background:#51574b;box-shadow:0 1.6cqw 0 #51574b}.screw:first-child{left:.35cqw}.screw:last-child{right:.35cqw}
  .shirt{position:absolute;top:-.6cqw;left:var(--position);width:18cqw;aspect-ratio:240/292;padding:0;border:0;background:none;transform:perspective(100cqw) translate(-50%,0) translateX(var(--offset,0cqw)) rotateY(var(--yaw,76deg)) rotateZ(var(--lean,0deg));transform-origin:50% 0;transform-style:preserve-3d;transition-property:left,top,width,transform,opacity,filter;transition-duration:var(--duration,${transitionSeconds}s);transition-timing-function:cubic-bezier(.4,0,.22,1);z-index:var(--order,1);-webkit-tap-highlight-color:transparent}.shirt[data-selected=true]{--yaw:0deg;z-index:20}.garment{display:block;width:100%;overflow:visible;transform:translateZ(.16cqw);filter:drop-shadow(.18cqw .35cqw .5cqw #17151218)}.garment-back{position:absolute;inset:0;transform:translateZ(-.32cqw);filter:brightness(.96)}.garment-back .print,.garment-back>path{display:none}.fabric{transform-origin:120px 55px}.print{filter:saturate(var(--print-saturation,1));opacity:.93}
  .hover-label{position:absolute;left:50%;bottom:-2.2cqw;transform:translateX(-50%);width:22cqw;text-align:center;font-size:.72cqw;color:#73766c;pointer-events:none;opacity:0;transition:opacity .2s}.site[data-view=rack] .hover-label[data-visible=true]{opacity:1}
  .availability{position:absolute;left:50%;bottom:8.3%;transform:translateX(-50%);border:1px solid #6d7381;border-radius:999px;background:none;padding:.3cqw 1.2cqw;font-size:.8cqw;letter-spacing:.02em;white-space:nowrap}.availability:hover{background:var(--portfolio-ink);color:var(--portfolio-paper)}
  .ticker{position:absolute;left:0;right:0;bottom:0;height:2.1cqw;overflow:hidden;background:#566384;color:#fff;display:flex;align-items:center}.ticker-track{display:flex;width:max-content;animation:ticker 24s linear infinite;font:italic .75cqw/1 Arial,sans-serif;white-space:nowrap}.ticker-track>span{padding-right:2cqw}.ticker-track i{font-style:normal;margin:0 1.4cqw}.ticker:hover .ticker-track{animation-play-state:paused}
  .detail-controls{position:absolute;inset:0;pointer-events:none;z-index:30}.detail-controls button{pointer-events:auto}.close{position:absolute;right:2%;top:3%;padding:.5cqw;border:0;background:none;font-size:.78cqw}.arrow{position:absolute;top:43%;width:2.4cqw;height:2.4cqw;min-width:20px;min-height:20px;display:grid;place-items:center;padding:0;border:1px solid #89908c;border-radius:50%;background:none;font-size:1.2cqw}.arrow:hover{background:#6b716a;color:#fff}.previous{left:30.5%}.next{right:30.5%}.detail-caption{position:absolute;left:5%;right:5%;bottom:9.7%;text-align:center;pointer-events:none}.detail-count{font-size:.65cqw;color:#646b66}.detail-name{margin:.65cqw 0 0;font:italic 1.5cqw/1.1 Arial,sans-serif}.detail-controls .availability{bottom:4.2%;font-size:.8cqw}.handle{position:absolute;left:50%;bottom:1.2%;width:1.9cqw;height:.3cqw;border-radius:999px;background:#888b84;transform:translateX(-50%)}
  .site:not([data-view=rack])::before{opacity:0}.site:not([data-view=rack]) .masthead{opacity:0;pointer-events:none}.site:not([data-view=rack]) .rail,.site:not([data-view=rack]) .shirt{opacity:.14;filter:blur(var(--rack-blur,3px))}.site:not([data-view=rack])>.availability,.site:not([data-view=rack]) .ticker{opacity:0;pointer-events:none}.site[data-view=detail] .shirt[data-selected=true]{left:50%;top:-5.2cqw;width:26cqw;opacity:1;filter:none;transform:perspective(100cqw) translate(-50%,0) translateX(0cqw) rotateY(var(--viewer-yaw,0deg)) rotateX(var(--viewer-pitch,0deg)) rotateZ(0deg);z-index:25}
  .info-panel{position:absolute;inset:0;z-index:35;background:rgb(234 233 229 / .88);padding:14% 22%;text-align:center;animation:panel-in var(--duration,.7s) ease both}.info-panel h2{margin:0 0 1.5cqw;font:italic 3.2cqw Georgia,serif}.info-panel p{font-size:1.1cqw;line-height:1.7;margin:1cqw 0}.info-panel small{font-size:.8cqw;color:#69736f}.info-panel .close{font-family:Arial,sans-serif}.info-panel .availability{position:static;display:inline-block;transform:none;margin-top:1cqw}
  .hint{position:absolute;bottom:3.6%;left:0;right:0;margin:0;text-align:center;font-size:.86cqw;color:#6c7890}:host([preview]) .hint{display:none}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}[hidden]{display:none!important}
  @keyframes ticker{to{transform:translateX(-50%)}}@keyframes panel-in{from{opacity:0;transform:translateY(1cqw)}to{opacity:1;transform:none}}
  :host([static]) *, :host([static]) *::before, :host([static]) *::after, :host([data-still]) *, :host([data-still]) *::before, :host([data-still]) *::after{transition:none!important;animation:none!important}
  :host([data-paused]) .ticker-track{animation-play-state:paused}
  :host([interaction-only]) .ticker-track{animation:none}
  .cloth-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:24}
  :host([data-cloth-renderer=webgl]) .fabric{visibility:hidden}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

const ticker = '<span>NEW DESIGNS DAILY<i>✦</i>SUBSCRIBE TO OUR NEWSLETTER<i>✦</i>NEW DESIGNS DAILY<i>✦</i>SUBSCRIBE TO OUR NEWSLETTER<i>✦</i>NEW DESIGNS DAILY<i>✦</i>SUBSCRIBE TO OUR NEWSLETTER<i>✦</i></span>';
const markup = `<div class="scene" part="scene"><section class="site" data-view="rack" role="region" aria-label="Interactive garment portfolio" part="portfolio">
  <header class="masthead"><button type="button" data-info="about">ABOUT</button><span class="brand" data-brand>Batch\nMerch</span><button type="button" data-info="contact">CONTACT</button></header>
  <div class="rack" part="rack"><div class="rail" aria-hidden="true"><i class="screw"></i><i class="screw"></i></div>${garments.map((item, i) => `<button class="shirt" type="button" data-index="${i}" data-selected="false" aria-label="View ${item.name}" aria-pressed="false" style="--position:${10 + i * 8.8}%;--order:${10 - i}" part="garment">${garmentSvg(item, i, true)}${garmentSvg(item, i)}</button>`).join('')}<span class="hover-label" data-visible="false" aria-hidden="true"></span></div>
  <button class="availability" type="button" data-info="availability">SEE AVAILABILITY</button>
  <div class="ticker" aria-hidden="true" part="ticker"><div class="ticker-track">${ticker}${ticker}</div></div>
  <div class="detail-controls" hidden><button class="close" type="button" data-close aria-label="Close garment viewer">CLOSE</button><button class="arrow previous" type="button" aria-label="Previous garment">‹</button><button class="arrow next" type="button" aria-label="Next garment">›</button><div class="detail-caption"><span class="detail-count"></span><p class="detail-name"></p></div><button class="availability" type="button" data-info="availability">SEE AVAILABILITY</button><i class="handle" aria-hidden="true"></i></div>
  <section class="info-panel" hidden><button class="close" type="button" data-close aria-label="Close portfolio information">CLOSE</button><h2></h2><p data-description></p><p data-extra></p><small>Independent design demo. No orders, forms, or messages are sent.</small></section>
  <span class="sr-only" role="status" aria-live="polite"></span>
</section><p class="hint">Move along the rack. Select a garment for a closer look.</p></div>`;

// A complete demonstration: rack browsing, zoom, previous items, close, and reset.
const demoSteps = [
  { index: 1 }, { index: 2 }, { index: 4 }, { index: 5 }, { index: 6 },
  { index: 6, view: 'detail' }, { index: 5, view: 'detail' }, { index: 4, view: 'detail' }, { index: 2, view: 'detail' },
  { index: -1, view: 'rack' }, { index: 8 }, { index: 1 }, { index: -1 }
];

export class PortfolioWebsiteScene extends HTMLElement {
  static get observedAttributes() { return ['refraction', 'blur', 'elasticity', 'glow', 'label', 'static', 'autoplay', 'interaction-only']; }
  constructor() { super(); this._selected = -1; this._view = 'rack'; this._animations = new Set(); }
  get selectedIndex() { return this._selected; }
  get isOpen() { return this._view === 'detail'; }
  get itemCount() { return garments.length; }
  _number(name, fallback, min, max) {
    const value = this.getAttribute(name);
    const number = value === null || value.trim() === '' ? fallback : Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }
  _motionAllowed() { return !this.hasAttribute('static') && !this._motion?.matches && this._number('elasticity', 1, 0, 2) > 0; }
  attributeChangedCallback(name) { if (name === 'autoplay') this._manual = false; this._syncMaterial(); this._syncPlayback(); }
  _syncMaterial() {
    this.style.setProperty('--separation', `${this._number('refraction', 36, 0, 100) / 36 * 4.8}cqw`);
    this.style.setProperty('--rack-blur', `${3 + this._number('blur', 0, 0, 24) / 2}px`);
    this.style.setProperty('--duration', `${this._number('elasticity', 1, 0, 2) * transitionSeconds}s`);
    this.style.setProperty('--print-saturation', this._number('glow', 70, 0, 100) / 70);
    this.toggleAttribute('data-still', !this._motionAllowed());
    if (this._brand) this._brand.textContent = this.getAttribute('label') || 'Batch\nMerch';
    if (!this._motionAllowed()) { this._cancelAnimations();this._cloth?.settle(); }
    this._cloth?.wake(this._number('elasticity', 1, 0, 2) * transitionSeconds + .1);
  }
  connectedCallback() {
    if (this._events) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' }).innerHTML = `<style>${styles}</style>${markup}`;
    this._site = this.shadowRoot.querySelector('.site');
    this._rack = this.shadowRoot.querySelector('.rack');
    this._buttons = [...this.shadowRoot.querySelectorAll('.shirt')];
    this._label = this.shadowRoot.querySelector('.hover-label');
    this._brand = this.shadowRoot.querySelector('[data-brand]');
    this._details = this.shadowRoot.querySelector('.detail-controls');
    this._panel = this.shadowRoot.querySelector('.info-panel');
    this._status = this.shadowRoot.querySelector('[role=status]');
    this._events = new AbortController();
    const options = { signal: this._events.signal };
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    this._motion.addEventListener('change', () => { this._syncMaterial(); this._syncPlayback(); }, options);
    this._buttons.forEach((button, index) => {
      button.addEventListener('click', () => this.open(index), options);
      button.addEventListener('focus', () => { if (this._view === 'rack' && !this._restoringFocus) this.select(index); }, options);
    });
    this._rack.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || this._view !== 'rack') return;
      this._takeControl();
      this._browseAt(event.clientX);
    }, options);
    this._rack.addEventListener('pointerleave', () => { if (this._view === 'rack' && this._manual && !this._touch?.moved) this._select(-1); }, options);
    this._rack.addEventListener('pointercancel', () => { if (this._view === 'rack') this._select(-1); }, options);
    this.shadowRoot.querySelector('.previous').addEventListener('click', () => this.previous(), options);
    this.shadowRoot.querySelector('.next').addEventListener('click', () => this.next(), options);
    this.shadowRoot.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => this.close(), options));
    this.shadowRoot.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => { this._infoFocus = button; this._infoReturnView = this._view; this._takeControl(); this._setView(button.dataset.info); this._panel.querySelector('[data-close]').focus(); }, options));
    this.shadowRoot.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.close(); }
      else if ((this._view === 'rack' || this.isOpen) && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') this.previous();
        else if (event.key === 'ArrowRight') this.next();
        else this.select(event.key === 'Home' ? 0 : 9);
        if (this._view === 'rack') this._buttons[this._selected]?.focus();
      }
    }, options);
    this.shadowRoot.addEventListener('pointerdown', event => {
      this._takeControl();
      this._suppressClick = false;
      if (event.pointerType === 'touch' && !event.target.closest('button:not(.shirt)') && (this.isOpen || this._view === 'rack' && event.target.closest('.rack'))) {
        this._touch = { id: event.pointerId, x: event.clientX, y: event.clientY, view: this._view, moved: false };
        this._pointerX = event.clientX;
      }
    }, options);
    this._site.addEventListener('pointermove', event => {
      if (event.pointerType !== 'touch') {
        if (this.isOpen && !event.target.closest('button:not(.shirt)')) this._moveCloth(event.clientX, event.clientY);
        else if (this._view === 'rack') this._nudgeCloth(event.clientX);
      }
      const touch = this._touch;
      if (!touch || event.pointerId !== touch.id) return;
      const dx = event.clientX - touch.x;
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(event.clientY - touch.y)) return;
      touch.moved = true;
      this._site.setPointerCapture(event.pointerId);
      if (touch.view === 'rack') this._browseAt(event.clientX);
      if (touch.view === 'rack') this._nudgeCloth(event.clientX);
      if (touch.view === 'detail') this._moveCloth(event.clientX, event.clientY);
    }, options);
    this._site.addEventListener('pointerup', event => {
      const touch = this._touch;
      if (!touch || event.pointerId !== touch.id) return;
      this._suppressClick = touch.moved;
      if (touch.moved && touch.view === 'detail' && Math.abs(event.clientX - touch.x) > 28) {
        if (event.clientX < touch.x) this.next(); else this.previous();
      }
      this._touch = null;
      this._neutralCloth();
    }, options);
    this._site.addEventListener('pointerleave', () => this._neutralCloth(), options);
    this._site.addEventListener('pointercancel', () => { this._touch = null; this._suppressClick = false;this._neutralCloth(); }, options);
    this.shadowRoot.addEventListener('click', event => {
      if (this._suppressClick && event.detail > 0) { event.preventDefault(); event.stopImmediatePropagation(); this._suppressClick = false; }
    }, { ...options, capture: true });
    document.addEventListener('visibilitychange', () => this._syncPlayback(), options);
    this._observer = new IntersectionObserver(entries => { this._visible = entries[0].isIntersecting; this._syncPlayback(); });
    this._observer.observe(this);
    this._syncMaterial();
    this._render();
    this._cloth = new PortfolioCloth(this);
  }
  _emit(type) { this.dispatchEvent(new CustomEvent(type, { detail: { index: this._selected, name: garments[this._selected]?.name || null, view: this._view, open: this.isOpen }, bubbles: true, composed: true })); }
  _browseAt(clientX) {
    const rect = this._rack.getBoundingClientRect();
    if (!rect.width) return;
    const position = (clientX - rect.left) / rect.width * 100;
    this._select(Math.max(0, Math.min(9, Math.round((position - 10) / 8.8))));
  }
  _nudgeCloth(clientX) {
    if (this._pointerX !== undefined) this._cloth?.nudge(this._selected, clientX - this._pointerX);
    this._pointerX = clientX;
  }
  _moveCloth(clientX, clientY) {
    if (!this._motionAllowed()) return;
    this._takeControl();this._nudgeCloth(clientX);
    const rect = this._site.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this._site.style.setProperty('--viewer-yaw', `${Math.max(-1, Math.min(1, (clientX - rect.left) / rect.width * 2 - 1)) * 32}deg`);
    this._site.style.setProperty('--viewer-pitch', `${Math.max(-1, Math.min(1, (clientY - rect.top) / rect.height * 2 - 1)) * -7}deg`);
    this._cloth?.wake(this._number('elasticity', 1, 0, 2) * transitionSeconds + .1);
  }
  _neutralCloth() {
    this._pointerX = undefined;
    this._site?.style.setProperty('--viewer-yaw', '0deg');
    this._site?.style.setProperty('--viewer-pitch', '0deg');
    this._cloth?.wake(this._number('elasticity', 1, 0, 2) * transitionSeconds + .1);
  }
  _select(index) {
    if (!Number.isInteger(index) || index < -1 || index >= garments.length || index === -1 && this.isOpen) return false;
    if (this._selected === index) return true;
    const old = this._selected;
    this._selected = index;
    this._render();
    this._sway(index, old);
    this._emit('portfolio-change');
    return true;
  }
  select(index) { this._takeControl(); return this._select(index); }
  open(index = this._selected < 0 ? 0 : this._selected) {
    if (!Number.isInteger(index) || index < 0 || index >= garments.length) return false;
    this._takeControl();
    this._returnFocus = this._buttons?.[index];
    this._select(index);
    this._setView('detail');
    this._details?.querySelector('[data-close]').focus();
    return true;
  }
  next() { this._takeControl(); return this._select((this._selected + 1) % garments.length); }
  previous() { this._takeControl(); return this._select((this._selected < 0 ? garments.length - 1 : this._selected + garments.length - 1) % garments.length); }
  _setView(view) {
    if (this._view === view) return;
    this._view = view;
    this._render();
    this._emit('portfolio-view');
  }
  close() {
    this._takeControl();
    if (this._view !== 'rack' && !this.isOpen && this._infoReturnView === 'detail') {
      this._setView('detail');
      this._infoFocus?.focus();
      this._infoFocus = null;
      this._infoReturnView = null;
      return;
    }
    const index = this._selected;
    const focus = this.isOpen ? this._buttons?.[index] : this._infoFocus || this._returnFocus;
    this._setView('rack');
    this._select(-1);
    // Restore focus without firing the rack's focus-to-select interaction.
    this._restoringFocus = true;
    if (focus?.isConnected) focus.focus({ preventScroll: true });
    this._restoringFocus = false;
    this._returnFocus = null;
    this._infoFocus = null;
    this._infoReturnView = null;
  }
  _render() {
    if (!this._site) return;
    this._site.dataset.view = this._view;
    this._site.setAttribute('role', this._view === 'rack' ? 'region' : 'dialog');
    this._site.setAttribute('aria-label', this.isOpen ? 'Garment viewer' : this._view === 'rack' ? 'Interactive garment portfolio' : 'Portfolio information');
    this._buttons.forEach((button, i) => {
      const selected = i === this._selected;
      const direction = this._selected < 0 ? 0 : i < this._selected ? -1 : i > this._selected ? 1 : 0;
      const falloff = this._selected < 0 ? 0 : 1 / (1 + Math.abs(i - this._selected) * .22);
      button.dataset.selected = String(selected);
      button.setAttribute('aria-pressed', String(selected));
      button.style.setProperty('--offset', `calc(var(--separation,4.8cqw) * ${direction * falloff})`);
      button.style.setProperty('--lean', `${direction * falloff * 2}deg`);
      button.inert = this._view !== 'rack';
    });
    const item = garments[this._selected];
    this._label.dataset.visible = String(this._selected >= 0);
    this._label.textContent = item?.name || '';
    this._label.style.left = `${10 + Math.max(0, this._selected) * 8.8}%`;
    this._details.hidden = !this.isOpen;
    this._panel.hidden = this._view === 'rack' || this.isOpen;
    this.shadowRoot.querySelector('.masthead').inert = this._view !== 'rack';
    this._site.querySelector(':scope > .availability').inert = this._view !== 'rack';
    if (this.isOpen) {
      this._details.querySelector('.detail-count').textContent = `${String(this._selected + 1).padStart(2, '0')} / 10`;
      this._details.querySelector('.detail-name').textContent = item.name;
    }
    if (!this._panel.hidden) {
      const text = this._view === 'about' ? ['Small batches. Big ideas.', 'A portfolio of wearable experiments. Explore ten independently drawn garments on an interactive chrome rack.', 'Hover to browse. Select to look closer.'] : this._view === 'contact' ? ['Let’s make something.', 'This is a visual portfolio demo, not an active contact form.', 'No email, personal information, or network request is required.'] : ['The collection.', item?.name || 'Ten wearable experiments, available to explore.', 'Preview only. No stock, checkout, or purchases are connected.'];
      this._panel.querySelector('h2').textContent = text[0];
      this._panel.querySelector('[data-description]').textContent = text[1];
      this._panel.querySelector('[data-extra]').textContent = text[2];
    }
    if (this._status) this._status.textContent = this.isOpen ? `${item.name}. Garment ${this._selected + 1} of 10.` : this._selected >= 0 ? item.name : this._view === 'rack' ? 'Garment rack.' : 'Portfolio information opened.';
    this._cloth?.wake(this._number('elasticity', 1, 0, 2) * transitionSeconds + .1);
  }
  _sway(index, old) {
    if (!this._motionAllowed() || !this._buttons) return;
    if (this._cloth?.ready && !this._cloth.disposed) {
      this._cloth.disturb(index, old, this._number('elasticity', 1, 0, 2));return;
    }
    // Retarget from the rendered pose, not zero: crossing rack slots must not snap.
    const poses = new Map();
    this._buttons.forEach(button => button.querySelectorAll('.fabric').forEach(fabric => {
      const transform = getComputedStyle(fabric).transform;
      poses.set(fabric, transform === 'none' ? 'rotate(0deg)' : transform);
    }));
    this._cancelAnimations();
    this._buttons.forEach((button, i) => {
      const nearby = Math.min(index < 0 ? Infinity : Math.abs(i - index), old < 0 ? Infinity : Math.abs(i - old)) <= 2;
      const strength = nearby ? (i < index ? -1 : 1) * this._number('elasticity', 1, 0, 2) * 1.8 : 0;
      button.querySelectorAll('.fabric').forEach(fabric => {
        const pose = poses.get(fabric);
        if (!nearby && pose === 'rotate(0deg)') return;
        const animation = fabric.animate([{ transform: pose }, { transform: `rotate(${strength}deg)`, offset: .3 }, { transform: `rotate(${-strength * .3}deg)`, offset: .68 }, { transform: 'rotate(0deg)' }], { duration: this._number('elasticity', 1, 0, 2) * 1700, easing: 'cubic-bezier(.4,0,.2,1)' });
        this._animations.add(animation);
        animation.finished.then(() => this._animations.delete(animation), () => this._animations.delete(animation));
      });
    });
  }
  _cancelAnimations() { this._animations.forEach(animation => animation.cancel()); this._animations.clear(); }
  _takeControl() { this._manual = true; this._stopPlayback(); }
  _stopPlayback() { clearTimeout(this._timer); this._timer = 0; }
  _syncPlayback() {
    const visible = this._events && this._visible && !document.hidden;
    this.toggleAttribute('data-paused', !visible);
    if (!visible) this._cloth?.pause();
    else if (!this._wasVisible) this._cloth?.wake(this._number('elasticity', 1, 0, 2) * transitionSeconds + .1);
    this._wasVisible = Boolean(visible);
    if (!visible || !this.hasAttribute('autoplay') || this.hasAttribute('interaction-only') || this._manual || !this._motionAllowed()) { this._stopPlayback(); if (!visible) this._cancelAnimations(); return; }
    if (this._timer) return;
    this._timer = setTimeout(() => {
      this._timer = 0;
      const step = demoSteps[this._step || 0];
      if (step.view === 'rack') this._setView('rack');
      this._select(step.index);
      if (step.view === 'detail') this._setView('detail');
      this._step = ((this._step || 0) + 1) % demoSteps.length;
      this._syncPlayback();
    }, 1500);
  }
  reset() {
    this._stopPlayback();
    this._cancelAnimations();
    this._selected = -1;
    this._view = 'rack';
    this._step = 0;
    this._manual = false;
    this._returnFocus = null;
    this._infoFocus = null;
    this._infoReturnView = null;
    this._neutralCloth();this._cloth?.settle();
    this._render();
    this._syncPlayback();
    this._touch = null;
    this._suppressClick = false;
  }
  disconnectedCallback() { this._events?.abort(); this._events = null; this._observer?.disconnect(); this._cloth?.dispose();this._cloth = null; this._visible = false; this._touch = null;this._pointerX = undefined; this.toggleAttribute('data-paused', true); this._stopPlayback(); this._cancelAnimations(); }
}

if (!customElements.get('portfolio-website-scene')) customElements.define('portfolio-website-scene', PortfolioWebsiteScene);

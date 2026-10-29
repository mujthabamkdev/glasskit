// One interactive scene shared by the gallery and full-page experiment.
const materials = ['Pearl glass', 'Ice glass', 'Prismatic glass', 'Emerald ribbon', 'Woven chrome'];
const styles = `
  :host{display:block;contain:content;color:#202124}
  *{box-sizing:border-box}
  .scene{position:relative;width:100%;aspect-ratio:1;background:#f7f7f7;overflow:hidden;container-type:inline-size;font-family:Inter,system-ui,sans-serif}
  .phone{position:absolute;top:13.6cqw;left:26.2cqw;width:47.6cqw;height:80cqw;border:1cqw solid #fff;border-radius:7cqw;background:#fff;box-shadow:0 0 0 .28cqw #eeeff0,inset 0 0 0 .2cqw #f0f1f2;overflow:hidden;mask-image:linear-gradient(#000 78%,transparent 99%)}
  .speaker{position:absolute;top:2.3cqw;left:45%;width:10%;height:.5cqw;border-radius:1cqw;background:#eee}
  .status{position:absolute;top:4cqw;left:8%;right:8%;display:flex;align-items:center;justify-content:space-between;font-size:1.55cqw;font-weight:600}
  .status-icons{display:flex;gap:.7cqw;align-items:center}
  .status-icons svg{width:1.7cqw;height:1.5cqw;fill:currentColor}
  .eyebrow{position:absolute;top:23%;left:8%;display:flex;gap:1.3cqw;align-items:center;font-size:1.55cqw;letter-spacing:-.04em;white-space:nowrap}
  .badge{padding:.15cqw .55cqw;border-radius:.7cqw;background:#f5f5f5}
  .orb-area{position:absolute;left:0;top:31%;width:100%;height:38%}
  canvas{display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y}
  canvas:active{cursor:grabbing}
  canvas:focus-visible{outline:1px solid #9babb8;outline-offset:-3px;border-radius:12px}
  .copy{position:absolute;top:72%;left:8%;right:8%;margin:0;font-size:1.55cqw;line-height:1.22;letter-spacing:-.045em;font-weight:400}
  .copy.secondary{top:82%;color:#b9b9b9}
  .controls{position:absolute;left:50%;bottom:3cqw;transform:translateX(-50%);display:flex;align-items:center;gap:12px;color:#7b8187;font:11px Inter,system-ui,sans-serif}
  .controls button{width:28px;height:28px;display:grid;place-items:center;border:1px solid #e0e3e5;border-radius:50%;padding:0;background:#ffffffb3;color:#626970;font:14px system-ui;cursor:pointer}
  .controls button:hover{background:#fff;border-color:#aeb7bf}
  .controls button:focus-visible{outline:2px solid #7c8c9a;outline-offset:3px}
  .count{min-width:30px;text-align:center;font-variant-numeric:tabular-nums}
  :host([preview]) .controls{display:none}
  .fallback{display:none;position:absolute;inset:0;overflow:hidden;pointer-events:none}
  .fallback i{position:absolute;top:25%;left:50%;width:32%;aspect-ratio:1;border-radius:50%;box-shadow:inset 2px 3px 3px #ffffffcc,inset -3px -5px 8px #2e435788;background:radial-gradient(ellipse at 33% 27%,#fff 0%,#ffffff00 27%),conic-gradient(from 45deg,#698095,#f8e8cf,#7e594a,#e9f1f5,#3b5975,#698095)}
  .fallback i:nth-child(2){background:radial-gradient(ellipse at 30% 25%,#fff,#ffffff00 30%),conic-gradient(#d5f3fa,#246d81,#ecf8f9,#478592,#e4f3f7,#d5f3fa)}
  .fallback i:nth-child(3){background:conic-gradient(#e5d8f9,#ea887d,#273d75,#e9d7fb,#c66283,#e5d8f9)}
  .fallback i:nth-child(4){background:conic-gradient(#ccef83,#173e05,#91bf3d,#153808,#ccef83);border-radius:45% 65% 45% 70%}
  .fallback i:nth-child(5){background:repeating-linear-gradient(115deg,#182433 0 2px,#becad3 2px 3px,#678cb9 3px 4px);border-radius:50% 25% 65% 30%}
  .no-webgl canvas{position:relative;z-index:1}
  .no-webgl .fallback{display:block}
  @media(forced-colors:active){.phone{border:1px solid CanvasText;mask-image:none}.scene,.phone{background:Canvas}.copy.secondary{color:CanvasText}}
`;

const vertexSource = `
  attribute vec2 a_uv;
  uniform vec2 u_resolution;
  uniform float u_center, u_size, u_extent;
  varying vec2 v_uv;
  void main(){
    v_uv=a_uv;
    vec2 pixel=vec2(u_center,u_resolution.y*.5)+(a_uv-.5)*vec2(u_size*u_extent,u_size);
    gl_Position=vec4(pixel/u_resolution*2.0-1.0,0.0,1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_kind, u_time, u_flow, u_direction, u_recoil, u_extent, u_pixel;
  mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
  float noise(vec3 p){
    vec3 cell=floor(p), f=fract(p);
    f=f*f*(3.0-2.0*f);
    float n=dot(cell,vec3(1.0,57.0,113.0));
    vec4 a=fract(sin(n+vec4(0.0,1.0,57.0,58.0))*43758.5453);
    vec4 b=fract(sin(n+vec4(113.0,114.0,170.0,171.0))*43758.5453);
    return mix(mix(mix(a.x,a.y,f.x),mix(a.z,a.w,f.x),f.y),mix(mix(b.x,b.y,f.x),mix(b.z,b.w,f.x),f.y),f.z);
  }
  float grain(vec3 p){return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.09)*.15;}
  vec3 liquidSpace(vec3 p){
    float stretch=1.0+u_flow*.78+u_recoil*.16;
    float tail=smoothstep(-.65,.6,-p.x*u_direction/stretch);
    p.x=p.x/stretch+u_flow*.12*u_direction;
    float thickness=pow(stretch,-.2)*(1.0-u_flow*.48*tail)*(1.0-u_recoil*.10);
    p.yz/=thickness;
    p.y+=u_recoil*.05*sin(p.x*4.5+u_time*.7);
    p.xy=rotate(u_recoil*.035)*p.xy;
    return p;
  }
  float shape(vec3 p){
    vec3 q=liquidSpace(p);
    float ripple=.009*sin(q.y*5.0+u_time*.65)*sin(q.x*4.0-q.z*3.0);
    return (length(q)-.89+ripple)*.52;
  }
  vec3 specimenSpace(vec3 p){
    p.xz=rotate(sin(u_time*.12+u_kind)*.24)*p.xz;
    p.xy=rotate(.22*sin(u_time*.09)+u_kind*.32)*p.xy;
    return p;
  }
  float inclusion(vec3 p){
    p=specimenSpace(p);
    if(u_kind<.5){
      float angle=atan(p.y,p.x);
      float petals=length(p.xy)-(.48+.12*cos(angle*4.0));
      float radius=length(p.xy);
      float fold=abs(p.z-.18*cos(angle*4.0)*smoothstep(.0,.3,radius)-.10*sin(radius*7.0))-.055;
      return max(petals,fold)*.65;
    }
    if(u_kind<1.5){
      p.yz=rotate(.48)*p.yz;
      float wave=p.y+.16*sin(p.x*3.0+p.z*3.0)+p.z*.3;
      float layers=abs(mod(wave+.15,.30)-.15)-.038;
      return max(length(p)-.73,layers)*.58;
    }
    if(u_kind<2.5){
      p.yz=rotate(.22)*p.yz;
      return (dot(abs(p),vec3(1.0))-.77)*.57735;
    }
    if(u_kind<3.5){
      p.xy=rotate(-.82)*p.xy;
      float leaf=length(p.xy*vec2(1.3,.96))-.75;
      float fold=abs(p.z-.14*sin(p.x*4.0)-.09*sin(p.y*3.0))-.035;
      return max(leaf,fold)*.64;
    }
    p.xy=rotate(.45)*p.xy;
    float fold=abs(p.z-.13*sin(p.x*5.0)-.17*p.y)-.055;
    return max(length(p)-.75,max(abs(p.x)-.29,fold))*.65;
  }
  vec3 normal(vec3 p){
    vec2 e=vec2(.0015,0.0);
    return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));
  }
  vec3 studio(vec3 direction){
    vec3 color=mix(vec3(.31,.39,.46),vec3(.97,.98,1.0),smoothstep(-.8,.6,direction.y));
    float band=exp(-pow((direction.y+.12+sin(direction.x*3.0)*.18)*4.2,2.0));
    color=mix(color,vec3(.12,.17,.21),band*.72);
    float window=(1.0-smoothstep(.06,.15,abs(direction.x+.5)))*(1.0-smoothstep(.2,.53,abs(direction.y-.44)))*smoothstep(.05,.4,direction.z);
    float softbox=pow(max(0.0,dot(direction,normalize(vec3(.4,.8,1.0)))),24.0);
    return color+window*.8+softbox*.45;
  }
  vec3 specimenColor(vec3 p,vec3 n){
    vec3 q=specimenSpace(p);
    float detail=grain(q*32.0);
    vec3 color;
    if(u_kind<.5){
      float rings=sin(length(q.xy)*37.0+grain(q*5.0)*3.0);
      color=mix(vec3(.68,.52,.35),vec3(.98,.94,.81),smoothstep(-.15,.7,q.z+detail*.22));
      color*=.94+.06*rings;
    }else if(u_kind<1.5){
      float frost=grain(q*49.0);
      color=mix(vec3(.10,.36,.43),vec3(.74,.92,.95),smoothstep(-.2,.6,q.y));
      color=mix(color,vec3(.9,.98,1.0),pow(frost,4.0)*.55);
    }else if(u_kind<2.5){
      color=mix(vec3(.28,.065,.012),vec3(1.0,.58,.16),smoothstep(-.3,.65,dot(n,normalize(vec3(-.6,.7,1.0)))));
      color*=.97+detail*.05;
    }else if(u_kind<3.5){
      q.xy=rotate(-.82)*q.xy;
      float midrib=1.0-smoothstep(.008,.018+u_pixel,abs(q.x));
      float branch=abs(sin((q.y-abs(q.x)*.68)*26.0+grain(q*7.0)*.25));
      float veins=(1.0-smoothstep(.025,.08+u_pixel*6.0,branch))*exp(-abs(q.x)*1.4);
      float cells=grain(q*66.0);
      color=mix(vec3(.014,.065,.003),vec3(.21,.48,.027),detail*.65+cells*.25);
      color=mix(color,vec3(.74,.88,.32),max(midrib,veins*.83));
      color+=vec3(.11,.19,.016)*pow(cells,5.0);
    }else{
      q.xy=rotate(.45)*q.xy;
      float warp=sin(q.x*143.0+.3*sin(q.y*19.0));
      float weft=sin(q.y*147.0+.3*sin(q.x*23.0));
      float contrast=1.0-smoothstep(.004,.024,u_pixel);
      float weave=(.5+.5*warp)*(.5+.5*weft)*contrast;
      color=mix(vec3(.018,.026,.035),vec3(.42,.51,.61),weave*.65+detail*.26);
    }
    float light=.42+.58*max(0.0,dot(n,normalize(vec3(-.55,.75,1.0))));
    vec3 reflection=studio(reflect(vec3(0.0,0.0,-1.0),n));
    return color*light+reflection*(u_kind>3.5?.16:.07);
  }
  void main(){
    vec2 uv=(v_uv-.5)*vec2(2.65*u_extent,2.65);
    vec3 origin=vec3(uv,3.2);
    vec3 ray=vec3(0.0,0.0,-1.0);
    float travel=0.0;
    bool hit=false;
    vec3 p;
    for(int i=0;i<80;i++){
      p=origin+ray*travel;
      float distance=shape(p);
      if(distance<.002){hit=true;break;}
      travel+=distance*.75;
      if(travel>5.6)break;
    }
    if(!hit){gl_FragColor=vec4(0.0);return;}
    vec3 n=normal(p);
    vec3 reflection=reflect(ray,n);
    float facing=max(0.0,dot(n,-ray));
    float fresnel=pow(1.0-facing,3.0);
    vec3 reflected=studio(reflection);
    vec3 insideRay=normalize(refract(ray,n,.69));
    vec3 entrance=liquidSpace(p)+insideRay*.035;
    vec3 interior=entrance;
    float depth=0.0;
    bool included=false;
    for(int i=0;i<54;i++){
      interior=entrance+insideRay*depth;
      float distance=inclusion(interior);
      if(distance<.003){included=true;break;}
      depth+=max(.003,distance*.75);
      if(depth>1.9||length(interior)>1.02)break;
    }
    vec3 tint=u_kind<.5?vec3(.69,.78,.88):u_kind<1.5?vec3(.75,.94,.96):u_kind<2.5?vec3(1.0,.7,.35):u_kind<3.5?vec3(.70,.82,.53):vec3(.75,.82,.89);
    vec3 body=mix(vec3(.98,.985,1.0),tint,.16);
    if(included){
      vec2 e=vec2(.002,0.0);
      vec3 innerNormal=normalize(vec3(inclusion(interior+e.xyy)-inclusion(interior-e.xyy),inclusion(interior+e.yxy)-inclusion(interior-e.yxy),inclusion(interior+e.yyx)-inclusion(interior-e.yyx)));
      body=specimenColor(interior,innerNormal);
      body=mix(body,tint,.08+.06*depth);
      if(u_kind<2.5){
        float innerFresnel=pow(1.0-abs(dot(innerNormal,-insideRay)),3.0);
        body=mix(body,studio(reflect(insideRay,innerNormal)),innerFresnel*.36);
      }
    }
    vec3 color=mix(body,reflected,.12+fresnel*.77);
    float rim=pow(1.0-facing,6.0);
    float softbox=(1.0-smoothstep(.035,.105,abs(n.x+.48)))*(1.0-smoothstep(.16,.48,abs(n.y-.48)));
    color=mix(color,vec3(.99,1.0,1.0),softbox*.77);
    color+=vec3(.85,.93,1.0)*rim*.16;
    float highlight=pow(max(0.0,dot(n,normalize(vec3(-.65,.8,1.3)))),110.0);
    color+=vec3(1.0)*highlight*.4;
    vec3 dispersion=.5+.5*sin(vec3(0.0,2.1,4.2)+facing*31.0);
    color+=dispersion*fresnel*.025;
    color=mix(color,vec3(.95,.98,1.0),fresnel*.11);
    float silhouette=shape(vec3(uv,0.0))/.52;
    float alpha=1.0-smoothstep(-u_pixel,u_pixel,silhouette);
    gl_FragColor=vec4(color,alpha);
  }
`;

class GlassSliderScene extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._index = 0;
    this._position = 0;
    this._paused = false;
    this._moving = false;
    this._visible = false;
    this._time = 0;
    this._flow = 0;
    this._recoil = 0;
    this._direction = 1;
    this._next = 0;
    this._frame = 0;
    this._motion = matchMedia('(prefers-reduced-motion: reduce)');
    const root = this.shadowRoot || this.attachShadow({ mode:'open' });
    root.innerHTML = `<style>${styles}</style><div class="scene"><div class="phone"><div class="speaker"></div><div class="status" aria-hidden="true"><span>9:41</span><div class="status-icons"><svg viewBox="0 0 20 16"><path d="M1 11h3v5H1zm5-3h3v8H6zm5-4h3v12h-3zm5-4h3v16h-3z"/></svg><svg viewBox="0 0 20 16"><path d="M1 5a14 14 0 0 1 18 0l-2 2a11 11 0 0 0-14 0zm4 4a8 8 0 0 1 10 0l-2 2a5 5 0 0 0-6 0zm3 4a3 3 0 0 1 4 0l-2 3z"/></svg><svg viewBox="0 0 24 16"><rect x="1" y="3" width="19" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="5" width="15" height="6" rx="1"/><path d="M22 6v4h1V6z"/></svg></div></div><div class="eyebrow"><span class="badge">COD1</span><span>Frontier meets reality</span></div><div class="orb-area"><canvas tabindex="0" role="slider" aria-label="Glass orb slider" aria-orientation="horizontal" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1" aria-valuetext="Pearl glass"></canvas><div class="fallback" aria-hidden="true">${materials.map(() => '<i></i>').join('')}</div></div><p class="copy">Our team has helped build companies like Meta AI, Nvidia, Cruise, Scale, and Cohere.</p><p class="copy secondary">Help create a powerful new way to understand visual data. We share a vision of what AI can do and we’re transforming the way people use video for good.</p></div><div class="controls"><button class="previous" aria-label="Previous glass orb">←</button><span class="count">1 / 5</span><button class="next" aria-label="Next glass orb">→</button><button class="pause" aria-label="Pause animation">Ⅱ</button></div></div>`;
    this._canvas = root.querySelector('canvas');
    this._gl = this._canvas.getContext('webgl', { alpha:true, antialias:true });
    if (this._gl) this._setupGL();
    else root.querySelector('.orb-area').classList.add('no-webgl');
    root.querySelector('.previous').addEventListener('click', () => this._advance(-1));
    root.querySelector('.next').addEventListener('click', () => this._advance(1));
    root.querySelector('.pause').addEventListener('click', () => {
      this._paused = !this._paused;
      this._syncPause();
      if (this._paused && !this._moving) this._stop();
      else this._start();
    });
    this._canvas.addEventListener('keydown', event => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'Home' || event.key === 'End') this._goTo(event.key === 'Home' ? 0 : 4);
        else this._advance(event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1);
      }
    });
    this._canvas.addEventListener('pointerdown', event => {
      this._pointerX = event.clientX;
      this._canvas.setPointerCapture(event.pointerId);
    });
    this._canvas.addEventListener('pointerup', event => {
      if (this._pointerX === undefined) return;
      const delta = event.clientX - this._pointerX;
      if (Math.abs(delta) > 20) this._advance(delta < 0 ? 1 : -1);
      else {
        const rect = this._canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        if (x < .3 || x > .7) this._advance(x < .3 ? -1 : 1);
      }
      this._pointerX = undefined;
    });
    this._canvas.addEventListener('pointercancel', () => { this._pointerX = undefined; });
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
    this._onMotion = () => {
      this._syncPause();
      if (this._motion.matches) {
        this._position = this._target ?? this._index;
        this._moving = false;
        this._flow = 0;
        this._recoil = 0;
        this._stop();
        this._draw(performance.now());
      } else this._start();
    };
    this._motion.addEventListener('change', this._onMotion);
    this._syncPause();
    this._size();
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
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    this._program = gl.createProgram();
    gl.attachShader(this._program, vertex);
    gl.attachShader(this._program, fragment);
    gl.linkProgram(this._program);
    if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this._program));
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.useProgram(this._program);
    this._buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(this._program, 'a_uv');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    this._uniforms = Object.fromEntries(['resolution','center','size','kind','time','flow','direction','recoil','extent','pixel'].map(name => [name, gl.getUniformLocation(this._program, `u_${name}`)]));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  _size() {
    const rect = this._canvas.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(devicePixelRatio || 1, this.hasAttribute('preview') ? 1.5 : 2);
    this._canvas.width = Math.round(rect.width * ratio);
    this._canvas.height = Math.round(rect.height * ratio);
    if (this._gl) this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._draw(performance.now());
  }

  _advance(direction) { this._goTo(this._index + direction, direction); }

  _goTo(index, direction) {
    if (this._moving) return;
    const next = (index + 5) % 5;
    if (next === this._index) return;
    const delta = direction ?? next - this._index;
    this._direction = -Math.sign(delta);
    this._from = this._position;
    this._target = this._position + delta;
    this._index = next;
    this._transitionStart = performance.now();
    this._next = this._transitionStart + 3400;
    this._moving = !this._motion.matches;
    if (!this._moving) this._position = this._target;
    this._canvas.setAttribute('aria-valuenow', String(next + 1));
    this._canvas.setAttribute('aria-valuetext', materials[next]);
    this.shadowRoot.querySelector('.count').textContent = `${next + 1} / 5`;
    this._draw(this._transitionStart);
    this._start();
  }

  _draw(now) {
    if (!this._paused && !this._motion.matches) this._time = now / 1000;
    if (this._moving) {
      const progress = Math.min(1, (now - this._transitionStart) / 1400);
      const eased = progress < .5 ? 4*progress**3 : 1-(-2*progress+2)**3/2;
      this._position = this._from + (this._target - this._from) * eased;
      const velocity = progress < .5 ? 12*progress**2 : 12*(1-progress)**2;
      this._flow = Math.min(1.08,velocity*.36);
      this._recoil = progress > .55 ? Math.sin((progress-.55)*31.0)*Math.exp(-(progress-.55)*7.0)*(1-progress)*2.2 : 0;
      if (progress === 1) this._moving = false;
    }
    if (!this._moving) { this._flow = 0; this._recoil = 0; }
    const gl = this._gl;
    if (gl) {
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(this._uniforms.resolution, this._canvas.width, this._canvas.height);
      gl.uniform1f(this._uniforms.size, this._canvas.width*.44);
      gl.uniform1f(this._uniforms.time, this._time);
      gl.uniform1f(this._uniforms.direction, this._direction);
      gl.uniform1f(this._uniforms.recoil, this._recoil);
      gl.uniform1f(this._uniforms.pixel,2.65/(this._canvas.width*.44));
    }
    materials.forEach((_, index) => {
      let offset = ((index - this._position + 2.5) % 5 + 5) % 5 - 2.5;
      const center = .5 + offset * .39;
      const flow = this._flow*(index === this._index ? 1 : .34);
      if (gl && center > -.5 && center < 1.5) {
        gl.uniform1f(this._uniforms.center, center * this._canvas.width);
        gl.uniform1f(this._uniforms.kind, index);
        gl.uniform1f(this._uniforms.flow,flow);
        gl.uniform1f(this._uniforms.extent,1+flow*.85);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!gl) this.shadowRoot.querySelectorAll('.fallback i')[index].style.transform = `translateX(calc(${offset * 121.875}% - 50%)) scale(${1+flow*.6},${1-flow*.18})`;
    });
  }

  _start() {
    if (this._frame || !this._visible || document.hidden) return;
    const tick = now => {
      if (!this.isConnected || !this._visible || document.hidden) { this._frame = 0; return; }
      this._draw(now);
      if (!this._next) this._next = now + 3400;
      if (!this._paused && !this._motion.matches && !this._moving && now > this._next) this._advance(1);
      if ((!this._paused && !this._motion.matches) || this._moving) this._frame = requestAnimationFrame(tick);
      else this._frame = 0;
    };
    this._frame = requestAnimationFrame(tick);
  }

  _stop() { cancelAnimationFrame(this._frame); this._frame = 0; }

  disconnectedCallback() {
    this._connected = false;
    this._stop();
    this._resize?.disconnect();
    this._intersection?.disconnect();
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._motion?.removeEventListener('change', this._onMotion);
    if (this._gl) {
      this._gl.deleteBuffer(this._buffer);
      this._gl.deleteProgram(this._program);
      this._gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }
}

customElements.define('glass-slider-scene', GlassSliderScene);

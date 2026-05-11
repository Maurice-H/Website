import{$ as e,A as t,D as n,F as r,J as i,K as a,L as o,Nt as s,O as c,Pt as l,X as u,_ as d,a as ee,b as f,c as te,d as ne,dt as p,et as re,f as ie,g as ae,h as oe,i as se,j as m,jt as h,k as ce,l as le,m as g,mt as _,n as ue,o as de,p as v,q as fe,r as pe,s as y,t as me,tt as b,u as he,ut as ge,v as _e,w as ve,x,y as S,z as C}from"./three-vendor-CczPxAsu.js";import{t as ye}from"./usePerformanceStore-BkniT3NR.js";import{a as w,i as T,n as be,r as xe,t as Se}from"./index-8krwY3Ym.js";var Ce={class:`ufo-body`},E={key:0,class:`ufo-glow`},we={class:`drone-body`},D={key:0,class:`drone-scanner`},O={key:1,class:`drone-status-light`},k={class:`css-particles`},A=w(o({__name:`CSSBackground`,setup(e){let r=xe(),a=Se(),o=n(()=>r.phase===T.NAV),s=n(()=>r.phase===T.CONTENT),d=n(()=>a.lightingEnabled),ee=n(()=>a.isBlueprintMode),f=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(e,n)=>(i(),m(`div`,{class:h([`css-background`,{"phase-content":s.value}])},[c(`div`,{class:h([`css-ufo`,{"ufo-visible":o.value,"ufo-blueprint":ee.value}])},[c(`div`,Ce,[n[0]||=c(`div`,{class:`ufo-dome`},null,-1),n[1]||=c(`div`,{class:`ufo-hull`},null,-1),n[2]||=c(`div`,{class:`ufo-ring`},null,-1),d.value?(i(),m(`div`,E)):t(``,!0)])],2),c(`div`,{class:h([`css-drone`,{"drone-visible":s.value,"drone-blueprint":ee.value}])},[c(`div`,we,[d.value?(i(),m(`div`,D)):t(``,!0),n[3]||=c(`div`,{class:`drone-base`},null,-1),n[4]||=c(`div`,{class:`drone-pulse`},null,-1),n[5]||=c(`div`,{class:`drone-core`},null,-1),n[6]||=c(`div`,{class:`drone-ring`},null,-1),d.value?(i(),m(`div`,O)):t(``,!0)])],2),c(`div`,k,[(i(),m(ve,null,u(12,e=>c(`span`,{key:e,class:`particle`,style:l(f(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-cf7d8cc0`]]),Te=`uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uThemeState;
uniform bool uLightingEnabled;
uniform float uPhase;
uniform vec3 uAccentColor;
uniform vec2 uUfoPosition;
uniform bool uIsMobile;

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec3 baseColor = vec3(0.0);
  vec3 lightColor = vec3(0.0);

  if (uLightingEnabled) {
    // Use vUv (0..1) for stable coordinate mapping across devices
    vec2 st = vUv;
    float aspect = uResolution.x / uResolution.y;
    st.x *= aspect;

    // Flipped mouse in WebGL coords
    vec2 mouse = uMouse / uResolution;
    mouse.y = 1.0 - mouse.y;
    mouse.x *= aspect;

    //   NAV phase: UFO Tractor Beam 
    if (uPhase < 0.5) {
      // Use dynamic emitter position from projected UFO coordinates
      vec2 emitterPos = uUfoPosition;
      emitterPos.x *= aspect; 
      
      vec2 toEmitter = st - emitterPos;
      
      if (toEmitter.y < 0.0) { // Drawing below the UFO
        float beamWidth = 2.00; // Wie breit der Strahl unten wird
        float distFromCenter = abs(toEmitter.x) / (abs(toEmitter.y) * beamWidth + 0.05);
        
        // Core = Innerer harter Strahl (x 1.2 macht ihn heller)
        float core = smoothstep(0.30, 0.0, distFromCenter) * 0.6;
        // Aura = Weicher Nebel drumherum
        float aura = smoothstep(0.8, 0.0, distFromCenter) * 0.40;
        
        float verticalFade = smoothstep(0.0, emitterPos.y, st.y);
        
        lightColor += uAccentColor * (core + aura) * verticalFade;
      }
    }

    //   CONTENT phase: custom cursor Cyber-Optic HUD Scanner (Micro)
    if (uPhase > 0.9 && !uIsMobile) {
      vec2 dir = st - mouse;
      float dist = length(dir);
      float angle = atan(dir.y, dir.x);
      
      // 1. GRÖSSE: Still micro
      float outerRadius = 0.025; 
      float coreRadius = 0.003; 
      
      // 2. KERN
      float core = smoothstep(coreRadius, 0.0, dist) * 2.5;
      
      // 3. TECH-RING
      float ring = smoothstep(outerRadius, outerRadius - 0.001, dist) - 
                   smoothstep(outerRadius - 0.001, outerRadius - 0.003, dist);
      float gaps = sin(angle * 8.0 + uTime * -3.0); 
      ring *= smoothstep(0.0, 0.5, gaps) * 1.5; 
      
      // 4. RADAR-SWEEP
      float sweepAngle = fract(angle / 6.28318 + uTime * 1.2); 
      float sweep = sweepAngle * smoothstep(outerRadius, 0.0, dist) * 0.2;
      
      // 5. AMBIENT
      float ambient = smoothstep(0.06, 0.0, dist) * 0.1;
      
      lightColor += uAccentColor * (core + ring + sweep + ambient);
    }

    // Noise/grain (both phases)
    float noise = random(vUv * uTime * 0.1) * 0.03;
    lightColor += noise;
  }

  // Cosmic Void Background: Immer tiefes Schwarz plus das reine Licht.
  // uThemeState ändert nur die *Farbe* des Lichts (wird via uAccentColor gesteuert), 
  // aber niemals den Hintergrund.
  vec3 finalColor = baseColor + lightColor;
  gl_FragColor = vec4(finalColor, 1.0);
}
`,Ee=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,j=new x;function De(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new f(r,i)}var Oe=[`position`],ke={"render-order":-1},Ae=[`vertex-shader`,`fragment-shader`],je=[`object`],Me={key:1,scale:[.3,.3,.3]},Ne=[`rotation`],Pe=[`color`],Fe=[`object`,`rotation`],Ie={key:1,scale:[.15,.15,.15]},Le=[`rotation`],Re=[`color`],ze={position:[.27,.26,-.1]},Be=[`color`,`angle`],Ve={position:[-.78,-.67,1.2],rotation:[5,0,0]},He={key:0,args:[.4,3,16,1,!0]},Ue=[`position`,`a-velocity`],We=.8,Ge=.3,Ke=15,qe=.82,Je=3.2,Ye=20,Xe=3,Ze=`
  uniform float uTime;
  uniform float uActivationTime;
  uniform float uPixelRatio;
  attribute float aVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;

    // Relative time since activation
    float localTime = max(0.0, uTime - uActivationTime);

    // Apply velocity over time and wrap around (simulate modulus operator logic for floats)
    float currentY = pos.y + aVelocity * localTime;

    // wrap logic: starting from -2.0, going up to 4.0, length of 6.0
    float wrappedY = mod(currentY + 2.0, 6.0) - 2.0;
    pos.y = wrappedY;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Proper size attenuation logic replicating TresPointsMaterial :size="0.04"
    gl_PointSize = 0.04 * uPixelRatio * (1000.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`,Qe=`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    // Circle shape for points
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;

    // Soft edge
    float alpha = (0.5 - r) * 2.0;

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`,$e=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,et=`
  #define PI 3.14159265359
  uniform float uProgress;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    // ── Expanding Wave ──
    // Leading edge: sharp cut off ahead of the wave
    float leadingEdge = smoothstep(uProgress + 0.01, uProgress, dist);

    // Trailing fade: long soft tail behind the wave
    float tailLength = 0.6; // How far the tail stretches backwards
    float trailingFade = smoothstep(uProgress - tailLength, uProgress, dist);
    // Exponential fade makes it look more explosive/natural
    trailingFade = pow(trailingFade, 1.5);

    float wave = leadingEdge * trailingFade;

    // ── Holographic Matrix Grid ──
    float gridScale = 120.0;
    vec2 gridId = floor(p * gridScale);
    vec2 gridUv = fract(p * gridScale);

    // Distance from center of current cell
    float dotDist = length(gridUv - vec2(0.5));

    // Noise to make dots flicker/vary organically
    float noise = random(gridId);

    // Glowing dots
    float dots = smoothstep(0.4, 0.1, dotDist) * (0.3 + 0.7 * noise);

    // Concentric radar rings
    float rings = smoothstep(0.01, 0.0, abs(fract(dist * 12.0) - 0.5));

    // Combine patterns
    float techPattern = max(dots, rings * 0.4);

    // Apply the wave to the pattern
    float alpha = techPattern * wave;

    // Add a solid glowing core ring at the exact leading edge
    float coreRing = smoothstep(uProgress - 0.015, uProgress, dist) * smoothstep(uProgress + 0.015, uProgress, dist);
    alpha += coreRing * 0.8;

    alpha *= smoothstep(1.0, 0.8, dist);
    alpha *= uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }`,tt=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }`,nt=`
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel-like effect: brightest when looking directly through the center
    float viewDot = abs(dot(normal, viewDir));

    // Soft core and subtle aura
    float core = smoothstep(0.7, 1.0, viewDot) * 0.8;
    float aura = smoothstep(0.0, 0.8, viewDot) * 0.2;
    float intensity = core + aura;

    // Vertical fade: vUv.y is 1.0 at the narrow tip (lens), 0.0 at the wide base.
    // By squaring vUv.y, it creates a smooth exponential fade that completely
    // dissipates to 0.0 at the end of the beam!
    float verticalFade = pow(vUv.y, 1.5);

    float alpha = intensity * verticalFade * 0.6;

    gl_FragColor = vec4(uColor, alpha);
  }`,rt=150,M=o({__name:`WebGLScene`,setup(r){let o=_e.prototype.traverse;_e.prototype.traverse=function(e){if(this.isMesh){let e=this;e.geometry&&!e.geometry.attributes.position&&e.geometry.setAttribute(`position`,new ne(new Float32Array([0,0,0]),3))}return o.call(this,e)};function s(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new ie(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function l(e,t){let n=e=>{let t=new he;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof oe&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new x;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new x;s.getCenter(c),e.position.sub(c)}function u(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof d){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=s(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof ae){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function h(e,t){new v(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof d))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}function ce(e,t){let n=0,r=new Set;t.traverse(e=>{let t=e;if(!t.isMesh)return;n++;let i=t.material;r.add(i.type)});let i=new he().setFromObject(t),a=new x;i.getSize(a),console.info(`[WebGLScene] ${e}: ${n} meshes, materials: [${[...r].join(`, `)}], bbox: ${a.x.toFixed(2)} × ${a.y.toFixed(2)} × ${a.z.toFixed(2)}`)}let y=Se(),b=xe(),S=n(()=>y.isBlueprintMode?`#38bdf8`:`#10b981`),C=ge(!1);e(()=>b.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&(C.value=!0)});let w=p(null),T=p(null);fe(()=>{w.value=null,T.value=null});let Ce=new me,E=!1;function we(){E||T.value||(E=!0,Ce.load(`./models/drone.glb`,e=>{ce(`Drone`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),u(e.scene),l(e.scene,Ge),h(e.scene,S.value),T.value=e.scene},void 0,e=>{console.error(`[WebGLScene] drone.glb not found — using primitive fallback.`,e),E=!1}))}a(()=>{Ce.load(`./models/ufo.glb`,e=>{ce(`UFO`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),u(e.scene),l(e.scene,We),h(e.scene,S.value),w.value=e.scene,setTimeout(()=>{we()},500)},void 0,e=>{console.error(`[WebGLScene] ufo.glb not found — using primitive fallback.`,e),setTimeout(()=>{we()},500)})}),e(S,e=>{w.value&&h(w.value,e);let t=new v(e);W.uColor.value=[t.r,t.g,t.b],mt.uColor.value.set(t)});let D=ye(),O=n(()=>D.gpuTier&&D.gpuTier>=3),k=p(),A=p(),j=p(),M=p(null),N=p(null),P=p(null),F=p(),I=be(),L=ge(`IDLE`),it=ge(0),R=ge(0),at=10,ot=new x;function st(e){if(b.focusedElementPos)return;let t=(typeof window<`u`?window.innerWidth:1200)<768,n=Math.random();n<.3?(L.value=`CLOSE_VISIT`,R.value=6):n<.5?(L.value=`DISTANT_PROBE`,R.value=8):n<.75?(L.value=`LOOPING`,R.value=5):(L.value=t?`CLOSE_VISIT`:`FOLLOW_MOUSE`,R.value=10),it.value=e,at=e+R.value+12+Math.random()*8}let z=0,ct=0,lt=null;function ut(e,t){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200)),i=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*r,a=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,o=Math.sin(e*.25)*2-3,s=n<768;if(!s&&b.focusedElementPos&&z>.01){let e=b.focusedElementPos.x*5*r,t=b.focusedElementPos.y*3;i=g.lerp(i,e,.85*z),a=g.lerp(a,t,.85*z),o=g.lerp(o,-1.2,.85*z)}let c=e-it.value;if(c>0&&c<R.value){let t=c/R.value,n=t<.5?4*t*t*t:1-(-2*t+2)**3/2,l=Math.sin(n*Math.PI);if(L.value===`CLOSE_VISIT`)o=g.lerp(o,3.8,l),i=g.lerp(i,Math.sin(e*.5)*1.5*r,l),a=g.lerp(a,Math.cos(e*.4)*.5,l);else if(L.value===`DISTANT_PROBE`)o=g.lerp(o,-18,l),i=g.lerp(i,i*1.5,l);else if(!s&&L.value===`FOLLOW_MOUSE`&&!b.focusedElementPos){let t=(I.rawMouse.x/G.width.value-.5)*8*r,n=-(I.rawMouse.y/G.height.value-.5)*5;i=g.lerp(i,t+Math.sin(e*2)*.5,l),a=g.lerp(a,n+Math.cos(e*2)*.5,l),o=g.lerp(o,-1.5,l)}else if(L.value===`LOOPING`){let e=2.5*l,n=t*Math.PI*2;a+=Math.sin(n)*e,o+=(Math.cos(n)-1)*e}}t.set(i,a,o)}let B=new x(0,0,-2),V=new _e,dt=new x,H=new x,ft=0,U=!1,pt=0,W={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}},mt={uColor:{value:new v(S.value)}},{renderer:ht,scene:gt,camera:_t,sizes:G}=le(),K=null,q=null,J=null,vt={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float angle;
    varying vec2 vUv;
    void main() {
      vec2 offset = vec2(cos(angle), sin(angle)) * amount;
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cga = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);
      gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
    }`};re(()=>{let e=ht.instance,t=_t.activeCamera.value;if(e&&gt.value&&t&&!K){K=new ee(e);let n=new pe(gt.value,t);K.addPass(n),q=new de(vt),q.uniforms.amount.value=0,K.addPass(q);let r=()=>{if(K){if(O.value&&!D.isCiMode){let e=new ue(new f(G.width.value,G.height.value),.15,.5,.9);K.insertPass(e,1)}O.value&&(J=new se,J.enabled=!1,J.goWild=!1,K.addPass(J))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),e([()=>G.width.value,()=>G.height.value],([e,t])=>{K&&K.setSize(e,t),k.value&&k.value.uniforms.uResolution.value.set(e,t)});let yt;e(()=>y.isBlueprintMode,()=>{J&&(J.enabled=!0,clearTimeout(yt),yt=setTimeout(()=>{J&&(J.enabled=!1)},350))});let bt=D.isCiMode?10:O.value?200:50,xt=new Float32Array(bt*3);for(let e=0;e<bt*3;e++)xt[e]=(Math.random()-.5)*6;let St=new Float32Array(rt*3),Ct=new Float32Array(rt);for(let e=0;e<rt;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;St[e*3]=Math.cos(n)*t,St[e*3+1]=-2+Math.random()*4,St[e*3+2]=Math.sin(n)*t,Ct[e]=2+Math.random()*4}let Y=p(),X=0,Z={uTime:{value:0},uActivationTime:{value:0},uPixelRatio:{value:window.devicePixelRatio||1},uColor:{value:new v(S.value)},uOpacity:{value:0}},wt={uMouse:{value:new f(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new f(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uIsMobile:{value:!1},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new f(.5,.85)}},{onBeforeRender:Tt,render:Et}=te();Et(()=>{K&&K.render()});let Dt=new f(I.rawMouse.x,I.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new v;return re(()=>{$.set(S.value),k.value&&(k.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Z.uColor.value.set(S.value),W.uColor.value=[$.r,$.g,$.b],Q.isNavPhase=b.phase===`NAV`,Q.isContentPhase=b.phase===`CONTENT`,Q.isBlueprintMode=+!!y.isBlueprintMode,Q.lightingEnabled=y.lightingEnabled}),Tt(({elapsed:e,delta:t})=>{if(j.value&&_t.activeCamera.value){let n=Q.isNavPhase?1.6+Math.sin(e*2)*.1:15,r=1-Math.exp((Q.isNavPhase?-2:-3)*t);j.value.position.y+=(n-j.value.position.y)*r;let i=j.value.position.y<10;j.value.visible=i,!i&&!Q.isNavPhase&&(C.value=!1),i&&k.value&&De(j.value.position,_t.activeCamera.value,k.value.uniforms.uUfoPosition.value)}if(M.value){let n=Q.isContentPhase;if(M.value.visible!==n&&(M.value.visible=n,!n&&U&&(U=!1,F.value&&(F.value.visible=!1,W.uProgress.value=0,W.uOpacity.value=0))),n){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200));if(b.focusedElementPos){b.focusedElementPos!==lt&&(ct=e,lt=b.focusedElementPos);let n=+(e-ct<Je);z=g.lerp(z,n,t*3)}else z=g.lerp(z,0,t*4),lt=null;e>at&&st(e),L.value!==`IDLE`&&e>it.value+R.value&&(L.value=`IDLE`,T.value&&h(T.value,S.value)),ut(e,dt);let i=dt.clone().sub(B).multiplyScalar(Ke);ot.add(i.multiplyScalar(t));let a=qe**(t*60);ot.multiplyScalar(a),B.add(ot.clone().multiplyScalar(t));let o=Math.sin(e*3.5)*.1;if(M.value.position.copy(B),M.value.position.y+=o,ut(e+.4,H),b.focusedElementPos&&z>.1){let e=b.focusedElementPos.x*5*r,t=b.focusedElementPos.y*3;H.set(e,t,-2)}else if(L.value===`IDLE`){let e=(I.rawMouse.x/G.width.value-.5)*5,t=-(I.rawMouse.y/G.height.value-.5)*3;H.x+=e*.5,H.y+=t*.5}let s=B.distanceTo(new x(0,0,5)),c=L.value===`CLOSE_VISIT`&&s<2.5;c&&H.set(0,0,8),V.position.copy(B),V.lookAt(H);let l=-(dt.y-B.y)*.8,u=V.rotation.y-M.value.rotation.y,d=Math.atan2(Math.sin(u),Math.cos(u))*1.5;V.rotateX(l),V.rotateZ(d);let ee=1-Math.exp(-3.5*t);if(M.value.quaternion.slerp(V.quaternion,ee),c&&s<1.8&&J&&!J.enabled&&Math.random()>.95&&(J.enabled=!0,T.value&&h(T.value,`#ef4444`),setTimeout(()=>{J&&(J.enabled=!1),T.value&&h(T.value,S.value)},400)),N.value&&P.value){N.value.target=P.value;let n=dt.distanceTo(B)/t,r=Math.min(n*.1,4),i=c?5:0;N.value.intensity=3+r+i+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let a=1+r*.2+i*.5;mt.uColor.value.set(S.value).multiplyScalar(a)}if(e-ft>=Ye&&!U&&(U=!0,pt=0,ft=e,J&&(J.enabled=!0,setTimeout(()=>{J&&(J.enabled=!1)},300))),U&&F.value){pt+=t;let e=Math.min(pt/Xe,1);F.value.visible=!0,F.value.position.copy(M.value.position),F.value.position.y-=.5,W.uProgress.value=e,W.uOpacity.value=1-e*e,e>=1&&(U=!1,F.value.visible=!1,W.uProgress.value=0,W.uOpacity.value=0)}}}if(Y.value&&Y.value.geometry?.attributes?.position){let n=Q.isContentPhase&&j.value&&j.value.position.y<8;n&&!Y.value.visible&&(Z.uActivationTime.value=e),n?(X=g.lerp(X,1,t*10),Y.value.visible=!0):(X=g.lerp(X,0,t*5),X<.01&&(Y.value.visible=!1)),Y.value.visible&&(Z.uOpacity.value=X*.8)}if(A.value&&(A.value.rotation.y+=.05*t,A.value.rotation.x+=.02*t),q){let e=I.rawMouse.x,t=I.rawMouse.y,n=e-Dt.x,r=t-Dt.y,i=Math.sqrt(n*n+r*r);Dt.set(e,t);let a=Math.min(i*5e-5,.005);q.uniforms.amount.value+=(a-q.uniforms.amount.value)*.1}if(Z.uTime.value=e,!k.value)return;let n=k.value.uniforms;n.uTime.value=e,n.uMouse.value.set(I.rawMouse.x,I.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=(typeof window<`u`?window.innerWidth:1200)<768;n.uIsMobile.value=r;let i=+!!Q.isContentPhase,a=1-Math.exp(-4*t);n.uPhase.value+=(i-n.uPhase.value)*a}),(e,n)=>(i(),m(ve,null,[n[9]||=c(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),c(`TresPoints`,{ref_key:`dustRef`,ref:A},[c(`TresBufferGeometry`,{position:[_(xt),3]},null,8,Oe),n[0]||=c(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),c(`TresMesh`,ke,[n[1]||=c(`TresPlaneGeometry`,{args:[2,2]},null,-1),c(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:k,"vertex-shader":_(Ee),"fragment-shader":_(Te),uniforms:wt,"depth-write":!1,"depth-test":!1},null,8,Ae)]),_(b).phase===`NAV`||C.value?(i(),m(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:j,position:[0,15,0]},[w.value?(i(),m(`primitive`,{key:0,object:w.value},null,8,je)):(i(),m(`TresMesh`,Me,[n[3]||=c(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),n[4]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[n[2]||=c(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:S.value},null,8,Pe)],8,Ne)]))],512)):t(``,!0),c(`TresGroup`,{ref_key:`droneRef`,ref:M,position:[0,0,2]},[T.value?(i(),m(`primitive`,{key:0,object:T.value,rotation:[0,Math.PI,0]},null,8,Fe)):(i(),m(`TresMesh`,Ie,[n[6]||=c(`TresSphereGeometry`,{args:[1,32,32]},null,-1),n[7]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{rotation:[Math.PI/2,0,0]},[n[5]||=c(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:S.value},null,8,Re)],8,Le)])),c(`TresGroup`,ze,[c(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:N,color:S.value,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,Be),c(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:P,position:[0,0,0]},null,512),c(`TresMesh`,Ve,[_(y).lightingEnabled?(i(),m(`TresConeGeometry`,He)):t(``,!0),c(`TresShaderMaterial`,{"vertex-shader":tt,"fragment-shader":nt,uniforms:mt,transparent:!0,blending:2,"depth-write":!1,side:2})])])],512),c(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:Y,visible:!1},[c(`TresBufferGeometry`,{position:[_(St),3],"a-velocity":[_(Ct),1]},null,8,Ue),c(`TresShaderMaterial`,{"vertex-shader":Ze,"fragment-shader":Qe,uniforms:Z,transparent:!0,blending:2,"depth-write":!1})],512),c(`TresMesh`,{ref_key:`scanRingRef`,ref:F,visible:!1,rotation:[0,0,0]},[n[8]||=c(`TresPlaneGeometry`,{args:[20,20]},null,-1),c(`TresShaderMaterial`,{"vertex-shader":$e,"fragment-shader":et,uniforms:W,transparent:!0,"depth-write":!1,side:2})],512),n[10]||=c(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),n[11]||=c(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),N={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},P=o({__name:`WebGLBackground`,setup(e){let a=ye(),o=n(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:S,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,n)=>_(a).isReady&&_(a).isWebGLSupported?(i(),m(`div`,N,[r(_(y),s(C(o.value)),{default:b(()=>[r(M)]),_:1},16)])):_(a).isReady?(i(),ce(A,{key:1})):t(``,!0)}});export{P as default};
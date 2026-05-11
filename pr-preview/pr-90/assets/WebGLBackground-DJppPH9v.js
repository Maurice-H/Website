import{$ as e,A as t,D as n,F as r,J as i,K as a,L as o,Nt as s,O as c,Pt as l,X as u,_ as d,a as f,b as p,c as ee,d as te,dt as m,et as ne,f as re,g as ie,h as ae,i as oe,j as h,jt as g,k as se,l as ce,m as _,mt as v,n as le,o as ue,p as y,q as de,r as fe,s as b,t as pe,tt as x,u as me,ut as he,v as ge,w as _e,x as S,y as C,z as w}from"./three-vendor-CczPxAsu.js";import{t as ve}from"./usePerformanceStore-BkniT3NR.js";import{a as T,i as E,n as ye,r as be,t as xe}from"./index-dx_fmAED.js";var Se={class:`ufo-body`},D={key:0,class:`ufo-glow`},Ce={class:`drone-body`},O={key:0,class:`drone-scanner`},k={class:`css-particles`},A=T(o({__name:`CSSBackground`,setup(e){let r=be(),a=xe(),o=n(()=>r.phase===E.NAV),s=n(()=>r.phase===E.CONTENT),d=n(()=>a.lightingEnabled),f=n(()=>a.isBlueprintMode),p=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(e,n)=>(i(),h(`div`,{class:g([`css-background`,{"phase-content":s.value}])},[c(`div`,{class:g([`css-ufo`,{"ufo-visible":o.value,"ufo-blueprint":f.value}])},[c(`div`,Se,[n[0]||=c(`div`,{class:`ufo-dome`},null,-1),n[1]||=c(`div`,{class:`ufo-hull`},null,-1),n[2]||=c(`div`,{class:`ufo-ring`},null,-1),d.value?(i(),h(`div`,D)):t(``,!0)])],2),c(`div`,{class:g([`css-drone`,{"drone-visible":s.value,"drone-blueprint":f.value}])},[c(`div`,Ce,[d.value?(i(),h(`div`,O)):t(``,!0),n[3]||=c(`div`,{class:`drone-base`},null,-1),n[4]||=c(`div`,{class:`drone-pulse`},null,-1),n[5]||=c(`div`,{class:`drone-core`},null,-1),n[6]||=c(`div`,{class:`drone-ring`},null,-1)])],2),c(`div`,k,[(i(),h(_e,null,u(12,e=>c(`span`,{key:e,class:`particle`,style:l(p(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-81c22a84`]]),we=`uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uThemeState;
uniform bool uLightingEnabled;
uniform float uPhase;
uniform vec3 uAccentColor;
uniform vec2 uUfoPosition;

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
    if (uPhase > 0.9) {
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
`,Te=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,j=new S;function Ee(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new p(r,i)}var De=[`position`],Oe={"render-order":-1},ke=[`vertex-shader`,`fragment-shader`],Ae=[`object`],je={key:1,scale:[.3,.3,.3]},Me=[`rotation`],Ne=[`color`],Pe=[`object`,`rotation`],Fe={key:1,scale:[.15,.15,.15]},Ie=[`rotation`],Le=[`color`],Re={position:[.27,.26,-.1]},ze=[`color`,`angle`],Be={position:[-.78,-.67,1.2],rotation:[5,0,0]},Ve={key:0,args:[.4,3,16,1,!0]},He=[`position`,`a-velocity`],Ue=.8,We=.3,Ge=15,Ke=.82,qe=3.2,Je=20,Ye=3,Xe=`
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
`,Ze=`
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
`,Qe=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,$e=`
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
  }`,et=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }`,tt=`
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
  }`,nt=150,M=o({__name:`WebGLScene`,setup(r){let o=ge.prototype.traverse;ge.prototype.traverse=function(e){if(this.isMesh){let e=this;e.geometry&&!e.geometry.attributes.position&&e.geometry.setAttribute(`position`,new te(new Float32Array([0,0,0]),3))}return o.call(this,e)};function s(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new re(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function l(e,t){let n=e=>{let t=new me;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof ae&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new S;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new S;s.getCenter(c),e.position.sub(c)}function u(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof d){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=s(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof ie){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function g(e,t){new y(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof d))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}function se(e,t){let n=0,r=new Set;t.traverse(e=>{let t=e;if(!t.isMesh)return;n++;let i=t.material;r.add(i.type)});let i=new me().setFromObject(t),a=new S;i.getSize(a),console.info(`[WebGLScene] ${e}: ${n} meshes, materials: [${[...r].join(`, `)}], bbox: ${a.x.toFixed(2)} × ${a.y.toFixed(2)} × ${a.z.toFixed(2)}`)}let b=xe(),x=be(),C=n(()=>b.isBlueprintMode?`#38bdf8`:`#10b981`),w=he(!1);e(()=>x.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&(w.value=!0)});let T=m(null),E=m(null);de(()=>{T.value=null,E.value=null});let Se=new pe,D=!1;function Ce(){D||E.value||(D=!0,Se.load(`./models/drone.glb`,e=>{se(`Drone`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),u(e.scene),l(e.scene,We),g(e.scene,C.value),E.value=e.scene},void 0,e=>{console.error(`[WebGLScene] drone.glb not found — using primitive fallback.`,e),D=!1}))}a(()=>{Se.load(`./models/ufo.glb`,e=>{se(`UFO`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),u(e.scene),l(e.scene,Ue),g(e.scene,C.value),T.value=e.scene},void 0,e=>{console.error(`[WebGLScene] ufo.glb not found — using primitive fallback.`,e)})}),e(()=>x.phase,e=>{e===`CONTENT`&&Ce()}),e(C,e=>{T.value&&g(T.value,e);let t=new y(e);W.uColor.value=[t.r,t.g,t.b],mt.uColor.value.set(t)});let O=ve(),k=n(()=>O.gpuTier&&O.gpuTier>=3),A=m(),j=m(),M=m(),N=m(null),P=m(null),rt=m(null),F=m(),I=ye(),L=he(`IDLE`),it=he(0),R=he(0),at=10,ot=new S;function st(e){if(x.focusedElementPos)return;let t=Math.random();t<.3?(L.value=`CLOSE_VISIT`,R.value=6):t<.5?(L.value=`DISTANT_PROBE`,R.value=8):t<.75?(L.value=`LOOPING`,R.value=5):(L.value=`FOLLOW_MOUSE`,R.value=10),it.value=e,at=e+R.value+12+Math.random()*8}let z=0,ct=0,lt=null;function ut(e,t){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200)),i=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*r,a=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,o=Math.sin(e*.25)*2-3;if(x.focusedElementPos&&z>.01){let e=x.focusedElementPos.x*5*r,t=x.focusedElementPos.y*3;i=_.lerp(i,e,.85*z),a=_.lerp(a,t,.85*z),o=_.lerp(o,-1.2,.85*z)}let s=e-it.value;if(s>0&&s<R.value){let t=s/R.value,n=t<.5?4*t*t*t:1-(-2*t+2)**3/2,c=Math.sin(n*Math.PI);if(L.value===`CLOSE_VISIT`)o=_.lerp(o,3.8,c),i=_.lerp(i,Math.sin(e*.5)*1.5*r,c),a=_.lerp(a,Math.cos(e*.4)*.5,c);else if(L.value===`DISTANT_PROBE`)o=_.lerp(o,-18,c),i=_.lerp(i,i*1.5,c);else if(L.value===`FOLLOW_MOUSE`&&!x.focusedElementPos){let t=(I.rawMouse.x/G.width.value-.5)*8*r,n=-(I.rawMouse.y/G.height.value-.5)*5;i=_.lerp(i,t+Math.sin(e*2)*.5,c),a=_.lerp(a,n+Math.cos(e*2)*.5,c),o=_.lerp(o,-1.5,c)}else if(L.value===`LOOPING`){let e=2.5*c,n=t*Math.PI*2;a+=Math.sin(n)*e,o+=(Math.cos(n)-1)*e}}t.set(i,a,o)}let B=new S(0,0,-2),V=new ge,dt=new S,H=new S,ft=0,U=!1,pt=0,W={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}},mt={uColor:{value:new y(C.value)}},{renderer:ht,scene:gt,camera:_t,sizes:G}=ce(),K=null,q=null,J=null,vt={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};ne(()=>{let e=ht.instance,t=_t.activeCamera.value;if(e&&gt.value&&t&&!K){K=new f(e);let n=new fe(gt.value,t);K.addPass(n),q=new ue(vt),q.uniforms.amount.value=0,K.addPass(q);let r=()=>{if(K){if(k.value&&!O.isCiMode){let e=new le(new p(G.width.value,G.height.value),.15,.5,.9);K.insertPass(e,1)}k.value&&(J=new oe,J.enabled=!1,J.goWild=!1,K.addPass(J))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),e([()=>G.width.value,()=>G.height.value],([e,t])=>{K&&K.setSize(e,t),A.value&&A.value.uniforms.uResolution.value.set(e,t)});let yt;e(()=>b.isBlueprintMode,()=>{J&&(J.enabled=!0,clearTimeout(yt),yt=setTimeout(()=>{J&&(J.enabled=!1)},350))});let bt=O.isCiMode?10:k.value?200:50,xt=new Float32Array(bt*3);for(let e=0;e<bt*3;e++)xt[e]=(Math.random()-.5)*6;let St=new Float32Array(nt*3),Ct=new Float32Array(nt);for(let e=0;e<nt;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;St[e*3]=Math.cos(n)*t,St[e*3+1]=-2+Math.random()*4,St[e*3+2]=Math.sin(n)*t,Ct[e]=2+Math.random()*4}let Y=m(),X=0,Z={uTime:{value:0},uActivationTime:{value:0},uPixelRatio:{value:window.devicePixelRatio||1},uColor:{value:new y(C.value)},uOpacity:{value:0}},wt={uMouse:{value:new p(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new p(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new p(.5,.85)}},{onBeforeRender:Tt,render:Et}=ee();Et(()=>{K&&K.render()});let Dt=new p(I.rawMouse.x,I.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new y;return ne(()=>{$.set(C.value),A.value&&(A.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Z.uColor.value.set(C.value),W.uColor.value=[$.r,$.g,$.b],Q.isNavPhase=x.phase===`NAV`,Q.isContentPhase=x.phase===`CONTENT`,Q.isBlueprintMode=+!!b.isBlueprintMode,Q.lightingEnabled=b.lightingEnabled}),Tt(({elapsed:e,delta:t})=>{if(M.value&&_t.activeCamera.value){let n=Q.isNavPhase?1.6+Math.sin(e*2)*.1:15,r=1-Math.exp((Q.isNavPhase?-2:-3)*t);M.value.position.y+=(n-M.value.position.y)*r;let i=M.value.position.y<10;M.value.visible=i,!i&&!Q.isNavPhase&&(w.value=!1),i&&A.value&&Ee(M.value.position,_t.activeCamera.value,A.value.uniforms.uUfoPosition.value)}if(N.value){let n=Q.isContentPhase;if(N.value.visible!==n&&(N.value.visible=n,!n&&U&&(U=!1,F.value&&(F.value.visible=!1,W.uProgress.value=0,W.uOpacity.value=0))),n){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200));if(x.focusedElementPos){x.focusedElementPos!==lt&&(ct=e,lt=x.focusedElementPos);let n=+(e-ct<qe);z=_.lerp(z,n,t*3)}else z=_.lerp(z,0,t*4),lt=null;e>at&&st(e),L.value!==`IDLE`&&e>it.value+R.value&&(L.value=`IDLE`,E.value&&g(E.value,C.value)),ut(e,dt);let i=dt.clone().sub(B).multiplyScalar(Ge);ot.add(i.multiplyScalar(t));let a=Ke**(t*60);ot.multiplyScalar(a),B.add(ot.clone().multiplyScalar(t));let o=Math.sin(e*3.5)*.1;if(N.value.position.copy(B),N.value.position.y+=o,ut(e+.4,H),x.focusedElementPos&&z>.1){let e=x.focusedElementPos.x*5*r,t=x.focusedElementPos.y*3;H.set(e,t,-2)}else if(L.value===`IDLE`){let e=(I.rawMouse.x/G.width.value-.5)*5,t=-(I.rawMouse.y/G.height.value-.5)*3;H.x+=e*.5,H.y+=t*.5}let s=B.distanceTo(new S(0,0,5)),c=L.value===`CLOSE_VISIT`&&s<2.5;c&&H.set(0,0,8),V.position.copy(B),V.lookAt(H);let l=-(dt.y-B.y)*.8,u=V.rotation.y-N.value.rotation.y,d=Math.atan2(Math.sin(u),Math.cos(u))*1.5;V.rotateX(l),V.rotateZ(d);let f=1-Math.exp(-3.5*t);if(N.value.quaternion.slerp(V.quaternion,f),c&&s<1.8&&J&&!J.enabled&&Math.random()>.95&&(J.enabled=!0,E.value&&g(E.value,`#ef4444`),setTimeout(()=>{J&&(J.enabled=!1),E.value&&g(E.value,C.value)},400)),P.value&&rt.value){P.value.target=rt.value;let n=dt.distanceTo(B)/t,r=Math.min(n*.1,4),i=c?5:0;P.value.intensity=3+r+i+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let a=1+r*.2+i*.5;mt.uColor.value.set(C.value).multiplyScalar(a)}if(e-ft>=Je&&!U&&(U=!0,pt=0,ft=e,J&&(J.enabled=!0,setTimeout(()=>{J&&(J.enabled=!1)},300))),U&&F.value){pt+=t;let e=Math.min(pt/Ye,1);F.value.visible=!0,F.value.position.copy(N.value.position),F.value.position.y-=.5,W.uProgress.value=e,W.uOpacity.value=1-e*e,e>=1&&(U=!1,F.value.visible=!1,W.uProgress.value=0,W.uOpacity.value=0)}}}if(Y.value&&Y.value.geometry?.attributes?.position){let n=Q.isContentPhase&&M.value&&M.value.position.y<8;n&&!Y.value.visible&&(Z.uActivationTime.value=e),n?(X=_.lerp(X,1,t*10),Y.value.visible=!0):(X=_.lerp(X,0,t*5),X<.01&&(Y.value.visible=!1)),Y.value.visible&&(Z.uOpacity.value=X*.8)}if(j.value&&(j.value.rotation.y+=.05*t,j.value.rotation.x+=.02*t),q){let e=I.rawMouse.x,t=I.rawMouse.y,n=e-Dt.x,r=t-Dt.y,i=Math.sqrt(n*n+r*r);Dt.set(e,t);let a=Math.min(i*5e-5,.005);q.uniforms.amount.value+=(a-q.uniforms.amount.value)*.1}if(Z.uTime.value=e,!A.value)return;let n=A.value.uniforms;n.uTime.value=e,n.uMouse.value.set(I.rawMouse.x,I.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase,i=1-Math.exp(-4*t);n.uPhase.value+=(r-n.uPhase.value)*i}),(e,n)=>(i(),h(_e,null,[n[9]||=c(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),c(`TresPoints`,{ref_key:`dustRef`,ref:j},[c(`TresBufferGeometry`,{position:[v(xt),3]},null,8,De),n[0]||=c(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),c(`TresMesh`,Oe,[n[1]||=c(`TresPlaneGeometry`,{args:[2,2]},null,-1),c(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:A,"vertex-shader":v(Te),"fragment-shader":v(we),uniforms:wt,"depth-write":!1,"depth-test":!1},null,8,ke)]),v(x).phase===`NAV`||w.value?(i(),h(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:M,position:[0,15,0]},[T.value?(i(),h(`primitive`,{key:0,object:T.value},null,8,Ae)):(i(),h(`TresMesh`,je,[n[3]||=c(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),n[4]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[n[2]||=c(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:C.value},null,8,Ne)],8,Me)]))],512)):t(``,!0),c(`TresGroup`,{ref_key:`droneRef`,ref:N,position:[0,0,2]},[E.value?(i(),h(`primitive`,{key:0,object:E.value,rotation:[0,Math.PI,0]},null,8,Pe)):(i(),h(`TresMesh`,Fe,[n[6]||=c(`TresSphereGeometry`,{args:[1,32,32]},null,-1),n[7]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{rotation:[Math.PI/2,0,0]},[n[5]||=c(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:C.value},null,8,Le)],8,Ie)])),c(`TresGroup`,Re,[c(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:P,color:C.value,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,ze),c(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:rt,position:[0,0,0]},null,512),c(`TresMesh`,Be,[v(b).lightingEnabled?(i(),h(`TresConeGeometry`,Ve)):t(``,!0),c(`TresShaderMaterial`,{"vertex-shader":et,"fragment-shader":tt,uniforms:mt,transparent:!0,blending:2,"depth-write":!1,side:2})])])],512),c(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:Y,visible:!1},[c(`TresBufferGeometry`,{position:[v(St),3],"a-velocity":[v(Ct),1]},null,8,He),c(`TresShaderMaterial`,{"vertex-shader":Xe,"fragment-shader":Ze,uniforms:Z,transparent:!0,blending:2,"depth-write":!1})],512),c(`TresMesh`,{ref_key:`scanRingRef`,ref:F,visible:!1,rotation:[0,0,0]},[n[8]||=c(`TresPlaneGeometry`,{args:[20,20]},null,-1),c(`TresShaderMaterial`,{"vertex-shader":Qe,"fragment-shader":$e,uniforms:W,transparent:!0,"depth-write":!1,side:2})],512),n[10]||=c(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),n[11]||=c(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),N={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},P=o({__name:`WebGLBackground`,setup(e){let a=ve(),o=n(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:C,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,n)=>v(a).isReady&&v(a).isWebGLSupported?(i(),h(`div`,N,[r(v(b),s(w(o.value)),{default:x(()=>[r(M)]),_:1},16)])):v(a).isReady?(i(),se(A,{key:1})):t(``,!0)}});export{P as default};
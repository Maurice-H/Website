import{A as e,F as t,I as n,L as r,N as i,P as a,Q as o,U as s,V as c,X as l,Y as u,Z as d,_ as f,_t as p,a as ee,b as m,c as te,d as ne,f as re,ft as ie,g as ae,gt as h,h as oe,i as se,l as ce,m as g,n as le,nt as ue,o as de,p as _,pt as v,r as fe,rt as y,s as pe,t as me,tt as he,u as ge,v as _e,vt as b,x,y as S,yt as C,z as w}from"./three-vendor-CnuGiQxz.js";import{n as ve,t as ye}from"./usePerformanceStore-BdTHRkMh.js";import{a as T,i as E,n as be,r as xe,t as Se}from"./index-DbiKYO87.js";var Ce={class:`ufo-body`},we={key:0,class:`ufo-glow`},Te={class:`drone-x`},D={class:`drone-y`},Ee={class:`drone-scale`},O={class:`drone-rotate`},k={class:`drone-body`},A={key:0,class:`drone-pulse`},j={class:`css-particles`},M=T(c({__name:`CSSBackground`,setup(t){let s=xe(),c=Se(),l=i(()=>s.phase===E.NAV),u=i(()=>s.phase===E.CONTENT),f=i(()=>c.lightingEnabled),ee=i(()=>c.isBlueprintMode),m=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(t,i)=>(d(),r(`div`,{class:p([`css-background`,{"phase-content":u.value}])},[a(`div`,{class:p([`css-ufo`,{"ufo-visible":l.value,"ufo-blueprint":ee.value}])},[a(`div`,Ce,[i[0]||=a(`div`,{class:`ufo-dome`},null,-1),i[1]||=a(`div`,{class:`ufo-hull`},null,-1),i[2]||=a(`div`,{class:`ufo-ring`},null,-1),f.value?(d(),r(`div`,we)):n(``,!0)])],2),a(`div`,{class:p([`css-drone`,{"drone-visible":u.value,"drone-blueprint":ee.value}])},[a(`div`,Te,[a(`div`,D,[a(`div`,Ee,[a(`div`,O,[a(`div`,k,[f.value?(d(),r(`div`,A)):n(``,!0),i[3]||=a(`div`,{class:`drone-base`},null,-1),i[4]||=a(`div`,{class:`drone-core`},null,-1),i[5]||=a(`div`,{class:`drone-ring`},null,-1),f.value?(d(),r(e,{key:1},o(8,e=>a(`div`,{key:e,class:`drone-light`,style:C({"--dot-angle":e*45+`deg`,animationDelay:e*.2+`s`})},null,4)),64)):n(``,!0)])])])])])],2),a(`div`,j,[(d(),r(e,null,o(12,e=>a(`span`,{key:e,class:`particle`,style:C(m(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-9c746b4f`]]),De=`uniform vec2 uMouse;
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
`,Oe=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,N=new x;function ke(e,t,n){N.copy(e).project(t);let r=(N.x+1)/2,i=(N.y+1)/2;return n?n.set(r,i):new m(r,i)}var Ae=[`position`],je={"render-order":-1},Me=[`vertex-shader`,`fragment-shader`],Ne=[`object`],Pe={key:1,scale:[.3,.3,.3]},Fe=[`rotation`],Ie=[`color`],Le=[`object`,`rotation`],Re={key:1,scale:[.15,.15,.15]},ze=[`rotation`],Be=[`color`],Ve={position:[.27,.26,-.1]},He=[`color`,`angle`],Ue={position:[-.78,-.67,1.2],rotation:[5,0,0]},We={key:0,args:[.4,3,16,1,!0]},Ge=[`position`,`a-velocity`],Ke=.8,qe=.3,Je=15,Ye=.82,Xe=3.2,Ze=20,Qe=3,$e=`
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
`,et=`
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
`,tt=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,nt=`
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
  }`,rt=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }`,it=`
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
  }`,at=150,P=c({__name:`WebGLScene`,setup(t){let o=_e.prototype.traverse;_e.prototype.traverse=function(e){if(this.isMesh){let e=this;e.geometry&&!e.geometry.attributes.position&&e.geometry.setAttribute(`position`,new ne(new Float32Array([0,0,0]),3))}return o.call(this,e)};function s(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new re(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function c(e,t){let n=e=>{let t=new ge;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof oe&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new x;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new x;s.getCenter(c),e.position.sub(c)}function p(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof f){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=s(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof ae){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function y(e,t){new _(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof f))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}function pe(e,t){let n=0,r=new Set;t.traverse(e=>{let t=e;if(!t.isMesh)return;n++;let i=t.material;r.add(i.type)});let i=new ge().setFromObject(t),a=new x;i.getSize(a),console.info(`[WebGLScene] ${e}: ${n} meshes, materials: [${[...r].join(`, `)}], bbox: ${a.x.toFixed(2)} × ${a.y.toFixed(2)} × ${a.z.toFixed(2)}`)}let b=Se(),S=xe(),C=i(()=>b.isBlueprintMode?`#38bdf8`:`#10b981`),w=ie(!1);he(()=>S.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&(w.value=!0)});let T=v(null),E=v(null);l(()=>{T.value=null,E.value=null});let Ce=new me,we=!1;function Te(){we||E.value||(we=!0,Ce.load(`${ve.BASE_URL}models/drone.glb`,e=>{pe(`Drone`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),p(e.scene),c(e.scene,qe),y(e.scene,C.value),E.value=e.scene},void 0,e=>{console.error(`[WebGLScene] drone.glb not found — using primitive fallback.`,e),we=!1}))}u(()=>{Ce.load(`${ve.BASE_URL}models/ufo.glb`,e=>{pe(`UFO`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),p(e.scene),c(e.scene,Ke),y(e.scene,C.value),T.value=e.scene,setTimeout(()=>{Te()},500)},void 0,e=>{console.error(`[WebGLScene] ufo.glb not found — using primitive fallback.`,e),setTimeout(()=>{Te()},500)})}),he(C,e=>{T.value&&y(T.value,e);let t=new _(e);U.uColor.value=[t.r,t.g,t.b],gt.uColor.value.set(t)});let D=ye(),Ee=i(()=>D.gpuTier&&D.gpuTier>=3),O=v(),k=v(),A=v(),j=v(null),M=v(null),N=v(null),P=v(),F=be(),I=ie(`IDLE`),ot=ie(0),L=ie(0),st=10,ct=new x;function lt(e){if(S.focusedElementPos)return;let t=(typeof window<`u`?window.innerWidth:1200)<768,n=Math.random();n<.3?(I.value=`CLOSE_VISIT`,L.value=6):n<.5?(I.value=`DISTANT_PROBE`,L.value=8):n<.75?(I.value=`LOOPING`,L.value=5):(I.value=t?`CLOSE_VISIT`:`FOLLOW_MOUSE`,L.value=10),ot.value=e,st=e+L.value+12+Math.random()*8}let R=0,ut=0,dt=null;function ft(e,t){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200)),i=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*r,a=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,o=Math.sin(e*.25)*2-3,s=n<768;if(!s&&S.focusedElementPos&&R>.01){let e=S.focusedElementPos.x*5*r,t=S.focusedElementPos.y*3;i=g.lerp(i,e,.85*R),a=g.lerp(a,t,.85*R),o=g.lerp(o,-1.2,.85*R)}let c=e-ot.value;if(c>0&&c<L.value){let t=c/L.value,n=t<.5?4*t*t*t:1-(-2*t+2)**3/2,l=Math.sin(n*Math.PI);if(I.value===`CLOSE_VISIT`)o=g.lerp(o,3.8,l),i=g.lerp(i,Math.sin(e*.5)*1.5*r,l),a=g.lerp(a,Math.cos(e*.4)*.5,l);else if(I.value===`DISTANT_PROBE`)o=g.lerp(o,-18,l),i=g.lerp(i,i*1.5,l);else if(!s&&I.value===`FOLLOW_MOUSE`&&!S.focusedElementPos){let t=(F.rawMouse.x/W.width.value-.5)*8*r,n=-(F.rawMouse.y/W.height.value-.5)*5;i=g.lerp(i,t+Math.sin(e*2)*.5,l),a=g.lerp(a,n+Math.cos(e*2)*.5,l),o=g.lerp(o,-1.5,l)}else if(I.value===`LOOPING`){let e=2.5*l,n=t*Math.PI*2;a+=Math.sin(n)*e,o+=(Math.cos(n)-1)*e}}t.set(i,a,o)}let z=new x(0,0,-2),B=new _e,pt=new x,V=new x,mt=0,H=!1,ht=0,U={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}},gt={uColor:{value:new _(C.value)}},{renderer:_t,scene:vt,camera:yt,sizes:W}=ce(),G=null,K=null,q=null,bt={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};ue(()=>{let e=_t.instance,t=yt.activeCamera.value;if(e&&vt.value&&t&&!G){G=new ee(e);let n=new fe(vt.value,t);G.addPass(n),K=new de(bt),K.uniforms.amount.value=0,G.addPass(K);let r=()=>{if(G){if(Ee.value&&!D.isCiMode){let e=new le(new m(W.width.value,W.height.value),.15,.5,.9);G.insertPass(e,1)}Ee.value&&(q=new se,q.enabled=!1,q.goWild=!1,G.addPass(q))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),he([()=>W.width.value,()=>W.height.value],([e,t])=>{G&&G.setSize(e,t),O.value&&O.value.uniforms.uResolution.value.set(e,t)});let xt;he(()=>b.isBlueprintMode,()=>{q&&(q.enabled=!0,clearTimeout(xt),xt=setTimeout(()=>{q&&(q.enabled=!1)},350))});let St=D.isCiMode?10:Ee.value?200:50,Ct=new Float32Array(St*3);for(let e=0;e<St*3;e++)Ct[e]=(Math.random()-.5)*6;let J=new Float32Array(at*3),wt=new Float32Array(at);for(let e=0;e<at;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;J[e*3]=Math.cos(n)*t,J[e*3+1]=-2+Math.random()*4,J[e*3+2]=Math.sin(n)*t,wt[e]=2+Math.random()*4}let Y=v(),X=0,Z={uTime:{value:0},uActivationTime:{value:0},uPixelRatio:{value:window.devicePixelRatio||1},uColor:{value:new _(C.value)},uOpacity:{value:0}},Tt={uMouse:{value:new m(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new m(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uIsMobile:{value:!1},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new m(.5,.85)}},{onBeforeRender:Et,render:Dt}=te();Dt(()=>{G&&G.render()});let Ot=new m(F.rawMouse.x,F.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new _;return ue(()=>{$.set(C.value),O.value&&(O.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Z.uColor.value.set(C.value),U.uColor.value=[$.r,$.g,$.b],Q.isNavPhase=S.phase===`NAV`,Q.isContentPhase=S.phase===`CONTENT`,Q.isBlueprintMode=+!!b.isBlueprintMode,Q.lightingEnabled=b.lightingEnabled}),Et(({elapsed:e,delta:t})=>{if(A.value&&yt.activeCamera.value){let n=Q.isNavPhase?1.6+Math.sin(e*2)*.1:15,r=1-Math.exp((Q.isNavPhase?-2:-3)*t);A.value.position.y+=(n-A.value.position.y)*r;let i=A.value.position.y<10;A.value.visible=i,!i&&!Q.isNavPhase&&(w.value=!1),i&&O.value&&ke(A.value.position,yt.activeCamera.value,O.value.uniforms.uUfoPosition.value)}if(j.value){let n=Q.isContentPhase;if(j.value.visible!==n&&(j.value.visible=n,!n&&H&&(H=!1,P.value&&(P.value.visible=!1,U.uProgress.value=0,U.uOpacity.value=0))),n){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200));if(S.focusedElementPos){S.focusedElementPos!==dt&&(ut=e,dt=S.focusedElementPos);let n=+(e-ut<Xe);R=g.lerp(R,n,t*3)}else R=g.lerp(R,0,t*4),dt=null;e>st&&lt(e),I.value!==`IDLE`&&e>ot.value+L.value&&(I.value=`IDLE`,E.value&&y(E.value,C.value)),ft(e,pt);let i=pt.clone().sub(z).multiplyScalar(Je);ct.add(i.multiplyScalar(t));let a=Ye**(t*60);ct.multiplyScalar(a),z.add(ct.clone().multiplyScalar(t));let o=Math.sin(e*3.5)*.1;if(j.value.position.copy(z),j.value.position.y+=o,ft(e+.4,V),S.focusedElementPos&&R>.1){let e=S.focusedElementPos.x*5*r,t=S.focusedElementPos.y*3;V.set(e,t,-2)}else if(I.value===`IDLE`){let e=(F.rawMouse.x/W.width.value-.5)*5,t=-(F.rawMouse.y/W.height.value-.5)*3;V.x+=e*.5,V.y+=t*.5}let s=z.distanceTo(new x(0,0,5)),c=I.value===`CLOSE_VISIT`&&s<2.5;c&&V.set(0,0,8),B.position.copy(z),B.lookAt(V);let l=-(pt.y-z.y)*.8,u=B.rotation.y-j.value.rotation.y,d=Math.atan2(Math.sin(u),Math.cos(u))*1.5;B.rotateX(l),B.rotateZ(d);let f=1-Math.exp(-3.5*t);if(j.value.quaternion.slerp(B.quaternion,f),c&&s<1.8&&q&&!q.enabled&&Math.random()>.95&&(q.enabled=!0,E.value&&y(E.value,`#ef4444`),setTimeout(()=>{q&&(q.enabled=!1),E.value&&y(E.value,C.value)},400)),M.value&&N.value){M.value.target=N.value;let n=pt.distanceTo(z)/t,r=Math.min(n*.1,4),i=c?5:0;M.value.intensity=3+r+i+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let a=1+r*.2+i*.5;gt.uColor.value.set(C.value).multiplyScalar(a)}if(e-mt>=Ze&&!H&&(H=!0,ht=0,mt=e,q&&(q.enabled=!0,setTimeout(()=>{q&&(q.enabled=!1)},300))),H&&P.value){ht+=t;let e=Math.min(ht/Qe,1);P.value.visible=!0,P.value.position.copy(j.value.position),P.value.position.y-=.5,U.uProgress.value=e,U.uOpacity.value=1-e*e,e>=1&&(H=!1,P.value.visible=!1,U.uProgress.value=0,U.uOpacity.value=0)}}}if(Y.value&&Y.value.geometry?.attributes?.position){let n=Q.isContentPhase&&A.value&&A.value.position.y<8;n&&!Y.value.visible&&(Z.uActivationTime.value=e),n?(X=g.lerp(X,1,t*10),Y.value.visible=!0):(X=g.lerp(X,0,t*5),X<.01&&(Y.value.visible=!1)),Y.value.visible&&(Z.uOpacity.value=X*.8)}if(k.value&&(k.value.rotation.y+=.05*t,k.value.rotation.x+=.02*t),K){let e=F.rawMouse.x,t=F.rawMouse.y,n=e-Ot.x,r=t-Ot.y,i=Math.sqrt(n*n+r*r);Ot.set(e,t);let a=Math.min(i*5e-5,.005);K.uniforms.amount.value+=(a-K.uniforms.amount.value)*.1}if(Z.uTime.value=e,!O.value)return;let n=O.value.uniforms;n.uTime.value=e,n.uMouse.value.set(F.rawMouse.x,F.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=(typeof window<`u`?window.innerWidth:1200)<768;n.uIsMobile.value=r;let i=+!!Q.isContentPhase,a=1-Math.exp(-4*t);n.uPhase.value+=(i-n.uPhase.value)*a}),(t,i)=>(d(),r(e,null,[i[9]||=a(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),a(`TresPoints`,{ref_key:`dustRef`,ref:k},[a(`TresBufferGeometry`,{position:[h(Ct),3]},null,8,Ae),i[0]||=a(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),a(`TresMesh`,je,[i[1]||=a(`TresPlaneGeometry`,{args:[2,2]},null,-1),a(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:O,"vertex-shader":h(Oe),"fragment-shader":h(De),uniforms:Tt,"depth-write":!1,"depth-test":!1},null,8,Me)]),h(S).phase===`NAV`||w.value?(d(),r(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:A,position:[0,15,0]},[T.value?(d(),r(`primitive`,{key:0,object:T.value},null,8,Ne)):(d(),r(`TresMesh`,Pe,[i[3]||=a(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),i[4]||=a(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),a(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[i[2]||=a(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),a(`TresMeshBasicMaterial`,{color:C.value},null,8,Ie)],8,Fe)]))],512)):n(``,!0),a(`TresGroup`,{ref_key:`droneRef`,ref:j,position:[0,0,2]},[E.value?(d(),r(`primitive`,{key:0,object:E.value,rotation:[0,Math.PI,0]},null,8,Le)):(d(),r(`TresMesh`,Re,[i[6]||=a(`TresSphereGeometry`,{args:[1,32,32]},null,-1),i[7]||=a(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),a(`TresMesh`,{rotation:[Math.PI/2,0,0]},[i[5]||=a(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),a(`TresMeshBasicMaterial`,{color:C.value},null,8,Be)],8,ze)])),a(`TresGroup`,Ve,[a(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:M,color:C.value,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,He),a(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:N,position:[0,0,0]},null,512),a(`TresMesh`,Ue,[h(b).lightingEnabled?(d(),r(`TresConeGeometry`,We)):n(``,!0),a(`TresShaderMaterial`,{"vertex-shader":rt,"fragment-shader":it,uniforms:gt,transparent:!0,blending:2,"depth-write":!1,side:2})])])],512),a(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:Y,visible:!1},[a(`TresBufferGeometry`,{position:[h(J),3],"a-velocity":[h(wt),1]},null,8,Ge),a(`TresShaderMaterial`,{"vertex-shader":$e,"fragment-shader":et,uniforms:Z,transparent:!0,blending:2,"depth-write":!1})],512),a(`TresMesh`,{ref_key:`scanRingRef`,ref:P,visible:!1,rotation:[0,0,0]},[i[8]||=a(`TresPlaneGeometry`,{args:[20,20]},null,-1),a(`TresShaderMaterial`,{"vertex-shader":tt,"fragment-shader":nt,uniforms:U,transparent:!0,"depth-write":!1,side:2})],512),i[10]||=a(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),i[11]||=a(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),F={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},I=c({__name:`WebGLBackground`,setup(e){let a=ye(),o=i(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:S,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,i)=>h(a).isReady&&h(a).isWebGLSupported?(d(),r(`div`,F,[w(h(pe),b(s(o.value)),{default:y(()=>[w(P)]),_:1},16)])):h(a).isReady?(d(),t(M,{key:1})):n(``,!0)}});export{I as default};
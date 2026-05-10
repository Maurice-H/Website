import{A as e,D as t,Dt as n,E as r,G as i,I as a,K as o,L as s,O as c,Ot as l,P as u,U as d,W as f,X as p,Y as m,Z as h,_ as ee,a as te,b as g,c as ne,d as re,dt as _,f as ie,g as ae,h as oe,i as se,k as v,kt as y,l as ce,m as b,n as le,o as ue,ot as x,p as S,r as de,s as C,st as w,t as fe,u as pe,v as me,w as he,x as T,y as ge}from"./three-vendor-CPCvnJ5B.js";import{t as _e}from"./usePerformanceStore-DQt4tGX4.js";import{a as E,i as D,n as ve,r as ye,t as be}from"./index-BKU5bnB4.js";var xe={class:`ufo-body`},Se={key:0,class:`ufo-glow`},Ce={class:`drone-body`},O={key:0,class:`drone-scanner`},k={class:`css-particles`},A=E(a({__name:`CSSBackground`,setup(a){let s=ye(),c=be(),l=r(()=>s.phase===D.NAV),u=r(()=>s.phase===D.CONTENT),d=r(()=>c.lightingEnabled),f=r(()=>c.isBlueprintMode),p=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(r,a)=>(i(),e(`div`,{class:n([`css-background`,{"phase-content":u.value}])},[t(`div`,{class:n([`css-ufo`,{"ufo-visible":l.value,"ufo-blueprint":f.value}])},[t(`div`,xe,[a[0]||=t(`div`,{class:`ufo-dome`},null,-1),a[1]||=t(`div`,{class:`ufo-hull`},null,-1),a[2]||=t(`div`,{class:`ufo-ring`},null,-1),d.value?(i(),e(`div`,Se)):v(``,!0)])],2),t(`div`,{class:n([`css-drone`,{"drone-visible":u.value,"drone-blueprint":f.value}])},[t(`div`,Ce,[d.value?(i(),e(`div`,O)):v(``,!0),a[3]||=t(`div`,{class:`drone-base`},null,-1),a[4]||=t(`div`,{class:`drone-pulse`},null,-1),a[5]||=t(`div`,{class:`drone-core`},null,-1),a[6]||=t(`div`,{class:`drone-ring`},null,-1)])],2),t(`div`,k,[(i(),e(he,null,o(12,e=>t(`span`,{key:e,class:`particle`,style:y(p(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-81c22a84`]]),we=`uniform vec2 uMouse;
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
`,j=new T;function Ee(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new g(r,i)}var De=[`position`],Oe={"render-order":-1},ke=[`vertex-shader`,`fragment-shader`],Ae=[`object`],je={key:1,scale:[.3,.3,.3]},Me=[`rotation`],Ne=[`color`],Pe=[`object`,`rotation`],Fe={key:1,scale:[.15,.15,.15]},Ie=[`rotation`],Le=[`color`],Re={position:[.27,.26,-.1]},ze=[`color`,`angle`],Be={position:[-.78,-.67,1.2],rotation:[5,0,0]},Ve={key:0,args:[.4,3,16,1,!0]},He=[`position`],Ue=[`color`],We=.8,Ge=.3,Ke=15,qe=.82,Je=3.2,Ye=20,Xe=3,Ze=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,Qe=`
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
  }`,$e=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }`,et=`
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
  }`,M=150,N=a({__name:`WebGLScene`,setup(n){let a=me.prototype.traverse;me.prototype.traverse=function(e){if(this.isMesh){let e=this;e.geometry&&!e.geometry.attributes.position&&e.geometry.setAttribute(`position`,new re(new Float32Array([0,0,0]),3))}return a.call(this,e)};function o(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new ie(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function s(e,t){let n=e=>{let t=new pe;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof oe&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new T;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new T;s.getCenter(c),e.position.sub(c)}function c(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof ee){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=o(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof ae){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function l(e,t){new S(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof ee))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}function u(e,t){let n=0,r=new Set;t.traverse(e=>{let t=e;if(!t.isMesh)return;n++;let i=t.material;r.add(i.type)});let i=new pe().setFromObject(t),a=new T;i.getSize(a),console.info(`[WebGLScene] ${e}: ${n} meshes, materials: [${[...r].join(`, `)}], bbox: ${a.x.toFixed(2)} × ${a.y.toFixed(2)} × ${a.z.toFixed(2)}`)}let h=be(),y=ye(),C=r(()=>h.isBlueprintMode?`#38bdf8`:`#10b981`),ge=x(!1);m(()=>y.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&(ge.value=!0)});let E=w(null),D=w(null);f(()=>{E.value=null,D.value=null});let xe=new fe,Se=!1;function Ce(){Se||D.value||(Se=!0,xe.load(`/models/drone.glb`,e=>{u(`Drone`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),c(e.scene),s(e.scene,Ge),l(e.scene,C.value),D.value=e.scene},void 0,e=>{console.error(`[WebGLScene] drone.glb not found — using primitive fallback.`,e),Se=!1}))}d(()=>{xe.load(`/models/ufo.glb`,e=>{u(`UFO`,e.scene),e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),c(e.scene),s(e.scene,We),l(e.scene,C.value),E.value=e.scene},void 0,e=>{console.error(`[WebGLScene] ufo.glb not found — using primitive fallback.`,e)})}),m(()=>y.phase,e=>{e===`CONTENT`&&Ce()}),m(C,e=>{E.value&&l(E.value,e);let t=new S(e);G.uColor.value=[t.r,t.g,t.b],ft.uColor.value.set(t)});let O=_e(),k=r(()=>O.gpuTier&&O.gpuTier>=3),A=w(),j=w(),N=w(),P=w(null),F=w(null),tt=w(null),I=w(),L=ve(),R=x(`IDLE`),nt=x(0),z=x(0),rt=10,it=new T;function at(e){if(y.focusedElementPos)return;let t=Math.random();t<.3?(R.value=`CLOSE_VISIT`,z.value=6):t<.5?(R.value=`DISTANT_PROBE`,z.value=8):t<.75?(R.value=`LOOPING`,z.value=5):(R.value=`FOLLOW_MOUSE`,z.value=10),nt.value=e,rt=e+z.value+12+Math.random()*8}let B=0,ot=0,st=null;function ct(e,t){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200)),i=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*r,a=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,o=Math.sin(e*.25)*2-3;if(y.focusedElementPos&&B>.01){let e=y.focusedElementPos.x*5*r,t=y.focusedElementPos.y*3;i=b.lerp(i,e,.85*B),a=b.lerp(a,t,.85*B),o=b.lerp(o,-1.2,.85*B)}let s=e-nt.value;if(s>0&&s<z.value){let t=s/z.value,n=t<.5?4*t*t*t:1-(-2*t+2)**3/2,c=Math.sin(n*Math.PI);if(R.value===`CLOSE_VISIT`)o=b.lerp(o,3.8,c),i=b.lerp(i,Math.sin(e*.5)*1.5*r,c),a=b.lerp(a,Math.cos(e*.4)*.5,c);else if(R.value===`DISTANT_PROBE`)o=b.lerp(o,-18,c),i=b.lerp(i,i*1.5,c);else if(R.value===`FOLLOW_MOUSE`&&!y.focusedElementPos){let t=(L.rawMouse.x/K.width.value-.5)*8*r,n=-(L.rawMouse.y/K.height.value-.5)*5;i=b.lerp(i,t+Math.sin(e*2)*.5,c),a=b.lerp(a,n+Math.cos(e*2)*.5,c),o=b.lerp(o,-1.5,c)}else if(R.value===`LOOPING`){let e=2.5*c,n=t*Math.PI*2;a+=Math.sin(n)*e,o+=(Math.cos(n)-1)*e}}t.set(i,a,o)}let V=new T(0,0,-2),H=new me,lt=new T,U=new T,ut=0,W=!1,dt=0,G={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}},ft={uColor:{value:new S(C.value)}},{renderer:pt,scene:mt,camera:ht,sizes:K}=ce(),q=null,J=null,Y=null,gt={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};p(()=>{let e=pt.instance,t=ht.activeCamera.value;if(e&&mt.value&&t&&!q){q=new te(e);let n=new de(mt.value,t);q.addPass(n),J=new ue(gt),J.uniforms.amount.value=0,q.addPass(J);let r=()=>{if(q){if(k.value&&!O.isCiMode){let e=new le(new g(K.width.value,K.height.value),.15,.5,.9);q.insertPass(e,1)}k.value&&(Y=new se,Y.enabled=!1,Y.goWild=!1,q.addPass(Y))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),m([()=>K.width.value,()=>K.height.value],([e,t])=>{q&&q.setSize(e,t),A.value&&A.value.uniforms.uResolution.value.set(e,t)});let _t;m(()=>h.isBlueprintMode,()=>{Y&&(Y.enabled=!0,clearTimeout(_t),_t=setTimeout(()=>{Y&&(Y.enabled=!1)},350))});let vt=O.isCiMode?10:k.value?200:50,yt=new Float32Array(vt*3);for(let e=0;e<vt*3;e++)yt[e]=(Math.random()-.5)*6;let bt=new Float32Array(M*3),xt=new Float32Array(M);for(let e=0;e<M;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;bt[e*3]=Math.cos(n)*t,bt[e*3+1]=-2+Math.random()*4,bt[e*3+2]=Math.sin(n)*t,xt[e]=2+Math.random()*4}let X=w(),Z=0,St={uMouse:{value:new g(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new g(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new g(.5,.85)}},{onBeforeRender:Ct,render:wt}=ne();wt(()=>{q&&q.render()});let Tt=new g(L.rawMouse.x,L.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new S;return p(()=>{$.set(C.value),A.value&&(A.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),G.uColor.value=[$.r,$.g,$.b],Q.isNavPhase=y.phase===`NAV`,Q.isContentPhase=y.phase===`CONTENT`,Q.isBlueprintMode=+!!h.isBlueprintMode,Q.lightingEnabled=h.lightingEnabled}),Ct(({elapsed:e,delta:t})=>{if(N.value&&ht.activeCamera.value){let n=Q.isNavPhase?1.6+Math.sin(e*2)*.1:15,r=1-Math.exp((Q.isNavPhase?-2:-3)*t);N.value.position.y+=(n-N.value.position.y)*r;let i=N.value.position.y<10;N.value.visible=i,!i&&!Q.isNavPhase&&(ge.value=!1),i&&A.value&&Ee(N.value.position,ht.activeCamera.value,A.value.uniforms.uUfoPosition.value)}if(P.value){let n=Q.isContentPhase;if(P.value.visible!==n&&(P.value.visible=n,!n&&W&&(W=!1,I.value&&(I.value.visible=!1,G.uProgress.value=0,G.uOpacity.value=0))),n){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200));if(y.focusedElementPos){y.focusedElementPos!==st&&(ot=e,st=y.focusedElementPos);let n=+(e-ot<Je);B=b.lerp(B,n,t*3)}else B=b.lerp(B,0,t*4),st=null;e>rt&&at(e),R.value!==`IDLE`&&e>nt.value+z.value&&(R.value=`IDLE`,D.value&&l(D.value,C.value)),ct(e,lt);let i=lt.clone().sub(V).multiplyScalar(Ke);it.add(i.multiplyScalar(t));let a=qe**(t*60);it.multiplyScalar(a),V.add(it.clone().multiplyScalar(t));let o=Math.sin(e*3.5)*.1;if(P.value.position.copy(V),P.value.position.y+=o,ct(e+.4,U),y.focusedElementPos&&B>.1){let e=y.focusedElementPos.x*5*r,t=y.focusedElementPos.y*3;U.set(e,t,-2)}else if(R.value===`IDLE`){let e=(L.rawMouse.x/K.width.value-.5)*5,t=-(L.rawMouse.y/K.height.value-.5)*3;U.x+=e*.5,U.y+=t*.5}let s=V.distanceTo(new T(0,0,5)),c=R.value===`CLOSE_VISIT`&&s<2.5;c&&U.set(0,0,8),H.position.copy(V),H.lookAt(U);let u=-(lt.y-V.y)*.8,d=H.rotation.y-P.value.rotation.y,f=Math.atan2(Math.sin(d),Math.cos(d))*1.5;H.rotateX(u),H.rotateZ(f);let p=1-Math.exp(-3.5*t);if(P.value.quaternion.slerp(H.quaternion,p),c&&s<1.8&&Y&&!Y.enabled&&Math.random()>.95&&(Y.enabled=!0,D.value&&l(D.value,`#ef4444`),setTimeout(()=>{Y&&(Y.enabled=!1),D.value&&l(D.value,C.value)},400)),F.value&&tt.value){F.value.target=tt.value;let n=lt.distanceTo(V)/t,r=Math.min(n*.1,4),i=c?5:0;F.value.intensity=3+r+i+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let a=1+r*.2+i*.5;ft.uColor.value.set(C.value).multiplyScalar(a)}if(e-ut>=Ye&&!W&&(W=!0,dt=0,ut=e,Y&&(Y.enabled=!0,setTimeout(()=>{Y&&(Y.enabled=!1)},300))),W&&I.value){dt+=t;let e=Math.min(dt/Xe,1);I.value.visible=!0,I.value.position.copy(P.value.position),I.value.position.y-=.5,G.uProgress.value=e,G.uOpacity.value=1-e*e,e>=1&&(W=!1,I.value.visible=!1,G.uProgress.value=0,G.uOpacity.value=0)}}}if(X.value){let e=X.value.geometry?.attributes?.position;if(e){let n=Q.isContentPhase&&N.value&&N.value.position.y<8;if(n&&!X.value.visible){let t=e.array;for(let e=0;e<M;e++){let n=.2+Math.random()*.8,r=Math.random()*Math.PI*2;t[e*3]=Math.cos(r)*n,t[e*3+1]=-2+Math.random()*2,t[e*3+2]=Math.sin(r)*n}e.needsUpdate=!0}if(n?(Z=b.lerp(Z,1,t*10),X.value.visible=!0):(Z=b.lerp(Z,0,t*5),Z<.01&&(X.value.visible=!1)),X.value.visible){let n=e.array;for(let e=0;e<M;e++)n[e*3+1]+=xt[e]*t,n[e*3+1]>4&&(n[e*3+1]=-2);e.needsUpdate=!0,X.value.material.opacity=Z*.8}}}if(j.value&&(j.value.rotation.y+=.05*t,j.value.rotation.x+=.02*t),J){let e=L.rawMouse.x,t=L.rawMouse.y,n=e-Tt.x,r=t-Tt.y,i=Math.sqrt(n*n+r*r);Tt.set(e,t);let a=Math.min(i*5e-5,.005);J.uniforms.amount.value+=(a-J.uniforms.amount.value)*.1}if(!A.value)return;let n=A.value.uniforms;n.uTime.value=e,n.uMouse.value.set(L.rawMouse.x,L.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase,i=1-Math.exp(-4*t);n.uPhase.value+=(r-n.uPhase.value)*i}),(n,r)=>(i(),e(he,null,[r[9]||=t(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),t(`TresPoints`,{ref_key:`dustRef`,ref:j},[t(`TresBufferGeometry`,{position:[_(yt),3]},null,8,De),r[0]||=t(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),t(`TresMesh`,Oe,[r[1]||=t(`TresPlaneGeometry`,{args:[2,2]},null,-1),t(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:A,"vertex-shader":_(Te),"fragment-shader":_(we),uniforms:St,"depth-write":!1,"depth-test":!1},null,8,ke)]),_(y).phase===`NAV`||ge.value?(i(),e(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:N,position:[0,15,0]},[E.value?(i(),e(`primitive`,{key:0,object:E.value},null,8,Ae)):(i(),e(`TresMesh`,je,[r[3]||=t(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),r[4]||=t(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),t(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[r[2]||=t(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),t(`TresMeshBasicMaterial`,{color:C.value},null,8,Ne)],8,Me)]))],512)):v(``,!0),t(`TresGroup`,{ref_key:`droneRef`,ref:P,position:[0,0,2]},[D.value?(i(),e(`primitive`,{key:0,object:D.value,rotation:[0,Math.PI,0]},null,8,Pe)):(i(),e(`TresMesh`,Fe,[r[6]||=t(`TresSphereGeometry`,{args:[1,32,32]},null,-1),r[7]||=t(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),t(`TresMesh`,{rotation:[Math.PI/2,0,0]},[r[5]||=t(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),t(`TresMeshBasicMaterial`,{color:C.value},null,8,Le)],8,Ie)])),t(`TresGroup`,Re,[t(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:F,color:C.value,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,ze),t(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:tt,position:[0,0,0]},null,512),t(`TresMesh`,Be,[_(h).lightingEnabled?(i(),e(`TresConeGeometry`,Ve)):v(``,!0),t(`TresShaderMaterial`,{"vertex-shader":$e,"fragment-shader":et,uniforms:ft,transparent:!0,blending:2,"depth-write":!1,side:2})])])],512),t(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:X,visible:!1},[t(`TresBufferGeometry`,{position:[_(bt),3]},null,8,He),t(`TresPointsMaterial`,{color:C.value,size:.04,transparent:!0,opacity:.8,blending:2,"depth-write":!1,"size-attenuation":!0},null,8,Ue)],512),t(`TresMesh`,{ref_key:`scanRingRef`,ref:I,visible:!1,rotation:[0,0,0]},[r[8]||=t(`TresPlaneGeometry`,{args:[20,20]},null,-1),t(`TresShaderMaterial`,{"vertex-shader":Ze,"fragment-shader":Qe,uniforms:G,transparent:!0,"depth-write":!1,side:2})],512),r[10]||=t(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),r[11]||=t(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),P={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},F=a({__name:`WebGLBackground`,setup(t){let n=_e(),a=r(()=>{let e=n.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:ge,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(t,r)=>_(n).isReady&&_(n).isWebGLSupported?(i(),e(`div`,P,[u(_(C),l(s(a.value)),{default:h(()=>[u(N)]),_:1},16)])):_(n).isReady?(i(),c(A,{key:1})):v(``,!0)}});export{F as default};
import{$ as e,A as t,D as n,F as r,J as i,K as a,L as o,Nt as s,O as c,Pt as l,X as u,_ as d,a as ee,b as f,c as te,d as ne,dt as p,et as re,f as ie,g as ae,h as oe,i as se,j as m,jt as h,k as g,l as ce,m as _,mt as v,n as le,o as ue,p as de,q as fe,r as pe,s as y,t as me,tt as b,u as he,ut as x,v as ge,w as _e,x as S,y as ve,z as C}from"./three-vendor-CczPxAsu.js";import{t as ye}from"./usePerformanceStore-CqJMOeIZ.js";import{a as w,i as T,n as be,r as xe,t as Se}from"./index-CYRIPeaS.js";var E={class:`ufo-body`},Ce={key:0,class:`ufo-glow`},D={class:`drone-body`},O={key:0,class:`drone-scanner`},k={class:`css-particles`},A=w(o({__name:`CSSBackground`,setup(e){let r=xe(),a=Se(),o=n(()=>r.phase===T.NAV),s=n(()=>r.phase===T.CONTENT),d=n(()=>a.lightingEnabled),ee=n(()=>a.isBlueprintMode),f=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(e,n)=>(i(),m(`div`,{class:h([`css-background`,{"phase-content":s.value}])},[c(`div`,{class:h([`css-ufo`,{"ufo-visible":o.value,"ufo-blueprint":ee.value}])},[c(`div`,E,[n[0]||=c(`div`,{class:`ufo-dome`},null,-1),n[1]||=c(`div`,{class:`ufo-hull`},null,-1),n[2]||=c(`div`,{class:`ufo-ring`},null,-1),d.value?(i(),m(`div`,Ce)):t(``,!0)])],2),c(`div`,{class:h([`css-drone`,{"drone-visible":s.value,"drone-blueprint":ee.value}])},[c(`div`,D,[d.value?(i(),m(`div`,O)):t(``,!0),n[3]||=c(`div`,{class:`drone-base`},null,-1),n[4]||=c(`div`,{class:`drone-pulse`},null,-1),n[5]||=c(`div`,{class:`drone-core`},null,-1),n[6]||=c(`div`,{class:`drone-ring`},null,-1)])],2),c(`div`,k,[(i(),m(_e,null,u(12,e=>c(`span`,{key:e,class:`particle`,style:l(f(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-81c22a84`]]),we=`uniform vec2 uMouse;
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
`,j=new S;function Ee(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new f(r,i)}var De=[`position`],Oe={"render-order":-1},ke=[`vertex-shader`,`fragment-shader`],Ae=[`object`],je={key:1,scale:[.3,.3,.3]},Me=[`rotation`],Ne=[`color`],Pe=[`object`,`rotation`],Fe={key:1,scale:[.15,.15,.15]},Ie=[`rotation`],Le=[`color`],Re={position:[.27,.26,-.1]},ze=[`color`,`angle`],Be={position:[-.78,-.67,1.2],rotation:[5,0,0]},Ve={key:0,args:[.4,3,16,1,!0]},He=[`position`],Ue=[`color`],We=.8,Ge=.3,Ke=15,qe=.82,Je=3.2,Ye=20,Xe=3,Ze=`
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
  }`,M=150,N=o({__name:`WebGLScene`,setup(r){let o=ge.prototype.traverse;ge.prototype.traverse=function(e){if(this.isMesh){let e=this;e.geometry&&!e.geometry.attributes.position&&e.geometry.setAttribute(`position`,new ne(new Float32Array([0,0,0]),3))}return o.call(this,e)};function s(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new ie(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function l(e,t){let n=e=>{let t=new he;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof oe&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new S;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new S;s.getCenter(c),e.position.sub(c)}function u(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof d){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=s(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof ae){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function h(e,t){new de(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof d))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}let g=Se(),y=xe(),b=n(()=>g.isBlueprintMode?`#38bdf8`:`#10b981`),ve=x(!1);e(()=>y.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&(ve.value=!0)});let C=p(null),w=p(null);fe(()=>{C.value=null,w.value=null});let T=new me,E=!1;function Ce(){E||w.value||(E=!0,T.load(`./models/drone.glb`,e=>{e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),u(e.scene),l(e.scene,Ge),h(e.scene,b.value),w.value=e.scene},void 0,e=>{console.error(`[WebGLScene] drone.glb not found — using primitive fallback.`,e),E=!1}))}a(()=>{T.load(`./models/ufo.glb`,e=>{e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),u(e.scene),l(e.scene,We),h(e.scene,b.value),C.value=e.scene},void 0,e=>{console.error(`[WebGLScene] ufo.glb not found — using primitive fallback.`,e)})}),e(()=>y.phase,e=>{e===`CONTENT`&&Ce()}),e(b,e=>{C.value&&h(C.value,e);let t=new de(e);G.uColor.value=[t.r,t.g,t.b],dt.uColor.value.set(t)});let D=ye(),O=n(()=>D.gpuTier&&D.gpuTier>=3),k=p(),A=p(),j=p(),N=p(null),P=p(null),F=p(null),I=p(),L=be(),R=x(`IDLE`),tt=x(0),z=x(0),nt=10,rt=new S;function it(e){if(y.focusedElementPos)return;let t=Math.random();t<.3?(R.value=`CLOSE_VISIT`,z.value=6):t<.5?(R.value=`DISTANT_PROBE`,z.value=8):t<.75?(R.value=`LOOPING`,z.value=5):(R.value=`FOLLOW_MOUSE`,z.value=10),tt.value=e,nt=e+z.value+12+Math.random()*8}let B=0,at=0,ot=null;function st(e,t){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200)),i=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*r,a=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,o=Math.sin(e*.25)*2-3;if(y.focusedElementPos&&B>.01){let e=y.focusedElementPos.x*5*r,t=y.focusedElementPos.y*3;i=_.lerp(i,e,.85*B),a=_.lerp(a,t,.85*B),o=_.lerp(o,-1.2,.85*B)}let s=e-tt.value;if(s>0&&s<z.value){let t=s/z.value,n=t<.5?4*t*t*t:1-(-2*t+2)**3/2,c=Math.sin(n*Math.PI);if(R.value===`CLOSE_VISIT`)o=_.lerp(o,3.8,c),i=_.lerp(i,Math.sin(e*.5)*1.5*r,c),a=_.lerp(a,Math.cos(e*.4)*.5,c);else if(R.value===`DISTANT_PROBE`)o=_.lerp(o,-18,c),i=_.lerp(i,i*1.5,c);else if(R.value===`FOLLOW_MOUSE`&&!y.focusedElementPos){let t=(L.rawMouse.x/K.width.value-.5)*8*r,n=-(L.rawMouse.y/K.height.value-.5)*5;i=_.lerp(i,t+Math.sin(e*2)*.5,c),a=_.lerp(a,n+Math.cos(e*2)*.5,c),o=_.lerp(o,-1.5,c)}else if(R.value===`LOOPING`){let e=2.5*c,n=t*Math.PI*2;a+=Math.sin(n)*e,o+=(Math.cos(n)-1)*e}}t.set(i,a,o)}let V=new S(0,0,-2),H=new ge,ct=new S,U=new S,lt=0,W=!1,ut=0,G={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}},dt={uColor:{value:new de(b.value)}},{renderer:ft,scene:pt,camera:mt,sizes:K}=ce(),q=null,J=null,Y=null,ht={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};re(()=>{let e=ft.instance,t=mt.activeCamera.value;if(e&&pt.value&&t&&!q){q=new ee(e);let n=new pe(pt.value,t);q.addPass(n),J=new ue(ht),J.uniforms.amount.value=0,q.addPass(J);let r=()=>{if(q){if(O.value&&!D.isCiMode){let e=new le(new f(K.width.value,K.height.value),.15,.5,.9);q.insertPass(e,1)}O.value&&(Y=new se,Y.enabled=!1,Y.goWild=!1,q.addPass(Y))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),e([()=>K.width.value,()=>K.height.value],([e,t])=>{q&&q.setSize(e,t),k.value&&k.value.uniforms.uResolution.value.set(e,t)});let gt;e(()=>g.isBlueprintMode,()=>{Y&&(Y.enabled=!0,clearTimeout(gt),gt=setTimeout(()=>{Y&&(Y.enabled=!1)},350))});let _t=D.isCiMode?10:O.value?200:50,vt=new Float32Array(_t*3);for(let e=0;e<_t*3;e++)vt[e]=(Math.random()-.5)*6;let yt=new Float32Array(M*3),bt=new Float32Array(M);for(let e=0;e<M;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;yt[e*3]=Math.cos(n)*t,yt[e*3+1]=-2+Math.random()*4,yt[e*3+2]=Math.sin(n)*t,bt[e]=2+Math.random()*4}let X=p(),Z=0,xt={uMouse:{value:new f(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new f(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new f(.5,.85)}},{onBeforeRender:St,render:Ct}=te();Ct(()=>{q&&q.render()});let wt=new f(L.rawMouse.x,L.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new de;return re(()=>{$.set(b.value),k.value&&(k.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),G.uColor.value=[$.r,$.g,$.b],Q.isNavPhase=y.phase===`NAV`,Q.isContentPhase=y.phase===`CONTENT`,Q.isBlueprintMode=+!!g.isBlueprintMode,Q.lightingEnabled=g.lightingEnabled}),St(({elapsed:e,delta:t})=>{if(j.value&&mt.activeCamera.value){let n=Q.isNavPhase?1.6+Math.sin(e*2)*.1:15,r=1-Math.exp((Q.isNavPhase?-2:-3)*t);j.value.position.y+=(n-j.value.position.y)*r;let i=j.value.position.y<10;j.value.visible=i,!i&&!Q.isNavPhase&&(ve.value=!1),i&&k.value&&Ee(j.value.position,mt.activeCamera.value,k.value.uniforms.uUfoPosition.value)}if(N.value){let n=Q.isContentPhase;if(N.value.visible!==n&&(N.value.visible=n,!n&&W&&(W=!1,I.value&&(I.value.visible=!1,G.uProgress.value=0,G.uOpacity.value=0))),n){let n=typeof window<`u`?window.innerWidth:1200,r=Math.max(.35,Math.min(1,n/1200));if(y.focusedElementPos){y.focusedElementPos!==ot&&(at=e,ot=y.focusedElementPos);let n=+(e-at<Je);B=_.lerp(B,n,t*3)}else B=_.lerp(B,0,t*4),ot=null;e>nt&&it(e),R.value!==`IDLE`&&e>tt.value+z.value&&(R.value=`IDLE`,w.value&&h(w.value,b.value)),st(e,ct);let i=ct.clone().sub(V).multiplyScalar(Ke);rt.add(i.multiplyScalar(t));let a=qe**(t*60);rt.multiplyScalar(a),V.add(rt.clone().multiplyScalar(t));let o=Math.sin(e*3.5)*.1;if(N.value.position.copy(V),N.value.position.y+=o,st(e+.4,U),y.focusedElementPos&&B>.1){let e=y.focusedElementPos.x*5*r,t=y.focusedElementPos.y*3;U.set(e,t,-2)}else if(R.value===`IDLE`){let e=(L.rawMouse.x/K.width.value-.5)*5,t=-(L.rawMouse.y/K.height.value-.5)*3;U.x+=e*.5,U.y+=t*.5}let s=V.distanceTo(new S(0,0,5)),c=R.value===`CLOSE_VISIT`&&s<2.5;c&&U.set(0,0,8),H.position.copy(V),H.lookAt(U);let l=-(ct.y-V.y)*.8,u=H.rotation.y-N.value.rotation.y,d=Math.atan2(Math.sin(u),Math.cos(u))*1.5;H.rotateX(l),H.rotateZ(d);let ee=1-Math.exp(-3.5*t);if(N.value.quaternion.slerp(H.quaternion,ee),c&&s<1.8&&Y&&!Y.enabled&&Math.random()>.95&&(Y.enabled=!0,w.value&&h(w.value,`#ef4444`),setTimeout(()=>{Y&&(Y.enabled=!1),w.value&&h(w.value,b.value)},400)),P.value&&F.value){P.value.target=F.value;let n=ct.distanceTo(V)/t,r=Math.min(n*.1,4),i=c?5:0;P.value.intensity=3+r+i+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let a=1+r*.2+i*.5;dt.uColor.value.set(b.value).multiplyScalar(a)}if(e-lt>=Ye&&!W&&(W=!0,ut=0,lt=e,Y&&(Y.enabled=!0,setTimeout(()=>{Y&&(Y.enabled=!1)},300))),W&&I.value){ut+=t;let e=Math.min(ut/Xe,1);I.value.visible=!0,I.value.position.copy(N.value.position),I.value.position.y-=.5,G.uProgress.value=e,G.uOpacity.value=1-e*e,e>=1&&(W=!1,I.value.visible=!1,G.uProgress.value=0,G.uOpacity.value=0)}}}if(X.value){let e=X.value.geometry?.attributes?.position;if(e){let n=Q.isContentPhase&&j.value&&j.value.position.y<8;if(n&&!X.value.visible){let t=e.array;for(let e=0;e<M;e++){let n=.2+Math.random()*.8,r=Math.random()*Math.PI*2;t[e*3]=Math.cos(r)*n,t[e*3+1]=-2+Math.random()*2,t[e*3+2]=Math.sin(r)*n}e.needsUpdate=!0}if(n?(Z=_.lerp(Z,1,t*10),X.value.visible=!0):(Z=_.lerp(Z,0,t*5),Z<.01&&(X.value.visible=!1)),X.value.visible){let n=e.array;for(let e=0;e<M;e++)n[e*3+1]+=bt[e]*t,n[e*3+1]>4&&(n[e*3+1]=-2);e.needsUpdate=!0,X.value.material.opacity=Z*.8}}}if(A.value&&(A.value.rotation.y+=.05*t,A.value.rotation.x+=.02*t),J){let e=L.rawMouse.x,t=L.rawMouse.y,n=e-wt.x,r=t-wt.y,i=Math.sqrt(n*n+r*r);wt.set(e,t);let a=Math.min(i*5e-5,.005);J.uniforms.amount.value+=(a-J.uniforms.amount.value)*.1}if(!k.value)return;let n=k.value.uniforms;n.uTime.value=e,n.uMouse.value.set(L.rawMouse.x,L.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase,i=1-Math.exp(-4*t);n.uPhase.value+=(r-n.uPhase.value)*i}),(e,n)=>(i(),m(_e,null,[n[9]||=c(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),c(`TresPoints`,{ref_key:`dustRef`,ref:A},[c(`TresBufferGeometry`,{position:[v(vt),3]},null,8,De),n[0]||=c(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),c(`TresMesh`,Oe,[n[1]||=c(`TresPlaneGeometry`,{args:[2,2]},null,-1),c(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:k,"vertex-shader":v(Te),"fragment-shader":v(we),uniforms:xt,"depth-write":!1,"depth-test":!1},null,8,ke)]),v(y).phase===`NAV`||ve.value?(i(),m(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:j,position:[0,15,0]},[C.value?(i(),m(`primitive`,{key:0,object:C.value},null,8,Ae)):(i(),m(`TresMesh`,je,[n[3]||=c(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),n[4]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[n[2]||=c(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:b.value},null,8,Ne)],8,Me)]))],512)):t(``,!0),c(`TresGroup`,{ref_key:`droneRef`,ref:N,position:[0,0,2]},[w.value?(i(),m(`primitive`,{key:0,object:w.value,rotation:[0,Math.PI,0]},null,8,Pe)):(i(),m(`TresMesh`,Fe,[n[6]||=c(`TresSphereGeometry`,{args:[1,32,32]},null,-1),n[7]||=c(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),c(`TresMesh`,{rotation:[Math.PI/2,0,0]},[n[5]||=c(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),c(`TresMeshBasicMaterial`,{color:b.value},null,8,Le)],8,Ie)])),c(`TresGroup`,Re,[c(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:P,color:b.value,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,ze),c(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:F,position:[0,0,0]},null,512),c(`TresMesh`,Be,[v(g).lightingEnabled?(i(),m(`TresConeGeometry`,Ve)):t(``,!0),c(`TresShaderMaterial`,{"vertex-shader":$e,"fragment-shader":et,uniforms:dt,transparent:!0,blending:2,"depth-write":!1,side:2})])])],512),c(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:X,visible:!1},[c(`TresBufferGeometry`,{position:[v(yt),3]},null,8,He),c(`TresPointsMaterial`,{color:b.value,size:.04,transparent:!0,opacity:.8,blending:2,"depth-write":!1,"size-attenuation":!0},null,8,Ue)],512),c(`TresMesh`,{ref_key:`scanRingRef`,ref:I,visible:!1,rotation:[0,0,0]},[n[8]||=c(`TresPlaneGeometry`,{args:[20,20]},null,-1),c(`TresShaderMaterial`,{"vertex-shader":Ze,"fragment-shader":Qe,uniforms:G,transparent:!0,"depth-write":!1,side:2})],512),n[10]||=c(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),n[11]||=c(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),P={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},F=o({__name:`WebGLBackground`,setup(e){let a=ye(),o=n(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:ve,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,n)=>v(a).isReady&&v(a).isWebGLSupported?(i(),m(`div`,P,[r(v(y),s(C(o.value)),{default:b(()=>[r(N)]),_:1},16)])):v(a).isReady?(i(),g(A,{key:1})):t(``,!0)}});export{F as default};
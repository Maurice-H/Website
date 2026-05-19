import{A as e,F as t,I as n,L as r,N as i,P as a,Q as o,U as s,V as c,X as l,Y as u,Z as d,_ as f,_t as p,a as m,b as h,c as g,d as _,f as v,ft as y,g as b,gt as x,h as S,i as C,l as w,m as T,n as E,nt as D,o as O,p as k,pt as A,r as j,rt as M,s as N,t as P,tt as F,v as I,vt as L,x as R,y as z,yt as B,z as V}from"./three-vendor-BEoYlVTq.js";import{n as H,t as U}from"./usePerformanceStore-DhNn4C6L.js";import{a as W,i as ee,n as G,r as K,t as q}from"./index-mUAhDwrZ.js";var J={class:`ufo-body`},Y={key:0,class:`ufo-glow`},te={class:`drone-x`},ne={class:`drone-y`},re={class:`drone-scale`},ie={class:`drone-rotate`},ae={class:`drone-body`},oe={key:0,class:`drone-pulse`},se={class:`css-particles`},ce=W(c({__name:`CSSBackground`,setup(t){let s=G(),c=q(),l=i(()=>s.phase===K.NAV),u=i(()=>s.phase===K.CONTENT),f=i(()=>c.lightingEnabled),m=i(()=>c.isBlueprintMode),h=e=>{let t=e*1.3%6,n=4+e%4,r=e*8.3%100,i=e*7.1%100,a=2+e%3;return{"--p-delay":`${t}s`,"--p-duration":`${n}s`,left:`${r}%`,top:`${i}%`,width:`${a}px`,height:`${a}px`}};return(t,i)=>(d(),r(`div`,{class:p([`css-background`,{"phase-content":u.value}])},[a(`div`,{class:p([`css-ufo`,{"ufo-visible":l.value,"ufo-blueprint":m.value}])},[a(`div`,J,[i[0]||=a(`div`,{class:`ufo-dome`},null,-1),i[1]||=a(`div`,{class:`ufo-hull`},null,-1),i[2]||=a(`div`,{class:`ufo-ring`},null,-1),f.value?(d(),r(`div`,Y)):n(``,!0)])],2),a(`div`,{class:p([`css-drone`,{"drone-visible":u.value,"drone-blueprint":m.value}])},[a(`div`,te,[a(`div`,ne,[a(`div`,re,[a(`div`,ie,[a(`div`,ae,[f.value?(d(),r(`div`,oe)):n(``,!0),i[3]||=a(`div`,{class:`drone-base`},null,-1),i[4]||=a(`div`,{class:`drone-core`},null,-1),i[5]||=a(`div`,{class:`drone-ring`},null,-1),f.value?(d(),r(e,{key:1},o(8,e=>a(`div`,{key:e,class:`drone-light`,style:B({"--dot-angle":e*45+`deg`,animationDelay:e*.2+`s`})},null,4)),64)):n(``,!0)])])])])])],2),a(`div`,se,[(d(),r(e,null,o(12,e=>a(`span`,{key:e,class:`particle`,style:B(h(e))},null,4)),64))])],2))}}),[[`__scopeId`,`data-v-62909d4b`]]),le=`
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
  }
`,ue=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`,de=`
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
  }
`,fe=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function pe(e){if(!e?.image)return e;let t=e.image,n=document.createElement(`canvas`);n.width=t.width||1024,n.height=t.height||1024;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)return e;try{r.drawImage(t,0,0,n.width,n.height);let i=r.getImageData(0,0,n.width,n.height),a=i.data;for(let e=0;e<a.length;e+=4){let t=a[e],n=a[e+1],r=a[e+2];if(n/(t+n+r||1)>.35&&n>15){let i=Math.min(255,(.299*t+.587*n+.114*r)*2);a[e]=i,a[e+1]=i,a[e+2]=i}}r.putImageData(i,0,0);let o=new v(n);return o.flipY=e.flipY,o.colorSpace=e.colorSpace,o.wrapS=e.wrapS,o.wrapT=e.wrapT,o.magFilter=e.magFilter,o.minFilter=e.minFilter,o.needsUpdate=!0,o}catch(t){return console.error(`Grayscale texture failed:`,t),e}}function X(e,t){let n=e=>{let t=new _;return t.makeEmpty(),e.updateWorldMatrix(!0,!0),e.traverse(e=>{if(e instanceof S&&e.visible&&e.geometry){let n=e.geometry;if(n.boundingBox||n.computeBoundingBox(),n.boundingBox){let r=n.boundingBox.clone();r.applyMatrix4(e.matrixWorld),t.union(r)}}}),t},r=n(e);if(r.isEmpty())return;let i=new R;r.getSize(i);let a=Math.max(i.x,i.y,i.z);if(a===0)return;let o=t/a;e.scale.setScalar(o);let s=n(e),c=new R;s.getCenter(c),e.position.sub(c)}function me(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;let n=t.material,r=(t.name||``).toLowerCase(),i=(n.name||``).toLowerCase();if(r.includes(`shadow`)||i.includes(`shadow`)||r.includes(`collision`)||r.includes(`proxy`)){t.visible=!1;return}if(!(n.transparent&&n.opacity<.05)){if(n instanceof f){t.userData.__originalEmissive||(t.userData.__originalEmissive=n.emissive.clone(),t.userData.__hadEmissiveMap=!!n.emissiveMap,t.userData.__originalColor=n.color.clone());let e=n.transparent;if(!e){let e={h:0,s:0,l:0};n.color.getHSL(e),!n.map&&e.l>.85?n.color.setHSL(e.h,e.s,.35):e.l<.15&&n.color.setHSL(e.h,Math.max(e.s,.2),.35),n.emissive.copy(n.color),n.emissiveIntensity=.8,n.userData.isUfoMaterial&&(n.emissiveMap&&!n.userData.__grayscaledEmissive&&(n.emissiveMap=pe(n.emissiveMap),n.userData.__grayscaledEmissive=!0),n.needsUpdate=!0)}n.metalness=e?n.metalness:Math.min(n.metalness,.3),n.roughness=e?n.roughness:Math.max(n.roughness,.4),n.needsUpdate=!0;return}if(n instanceof b){let e={h:0,s:0,l:0};n.color.getHSL(e),n.color.setHSL(e.h,e.s,Math.min(e.l*1.5,1)),n.needsUpdate=!0}}})}function Z(e,t){new k(t).getHSL({h:0,s:0,l:0}),e.traverse(e=>{let n=e;if(!n.isMesh)return;let r=n.material;if(!(r instanceof f))return;let i=n.userData.__originalEmissive;if(!i)return;if(r.userData.isUfoMaterial){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}if(n.userData.__hadEmissiveMap&&r.emissiveMap){r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}let a=(r.name||``).toLowerCase(),o=(n.name||``).toLowerCase(),s=a.includes(`lens`)||a.includes(`glass`)||a.includes(`eye`)||o.includes(`lens`)||o.includes(`glass`)||o.includes(`eye`),c=a.includes(`glow`)||a.includes(`accent`)||a.includes(`light`)||a.includes(`neon`)||a.includes(`ring`)||a.includes(`emitter`)||o.includes(`glow`)||o.includes(`accent`)||o.includes(`light`)||o.includes(`neon`)||o.includes(`ring`)||o.includes(`emitter`);if(s||c){r.emissive.set(t),c&&r.color.set(t),r.emissiveIntensity=1,r.needsUpdate=!0;return}let l={h:0,s:0,l:0};i.getHSL(l);let u=l.h>=.278&&l.h<=.5&&l.s>.1;if(!u&&n.userData.__originalColor&&(n.userData.__originalColor.getHSL(l),u=l.h>=.278&&l.h<=.5&&l.s>.1),u){r.color.set(t),r.emissive.set(t),r.emissiveIntensity=.9,r.needsUpdate=!0;return}})}var he=[`object`,`rotation`],ge={key:1,scale:[.15,.15,.15]},_e=[`rotation`],ve=[`color`],ye={position:[.27,.26,-.1]},be=[`color`,`angle`],xe={position:[-.78,-.67,1.2],rotation:[5,0,0]},Se={key:0,args:[.4,3,16,1,!0]},Ce=[`vertex-shader`,`fragment-shader`],we=[`vertex-shader`,`fragment-shader`],Te=.3,Ee=c({__name:`DroneEntity`,props:{accentColor:{},lightingEnabled:{type:Boolean}},setup(t,{expose:i}){let o=t,s=A(null),c=A(null),f=A(null),p=A(null),m=A(),h={uColor:{value:new k(o.accentColor)}},g={uProgress:{value:0},uColor:{value:[.063,.725,.506]},uOpacity:{value:0}};F(()=>o.accentColor,e=>{h.uColor.value.set(e);let t=new k(e);g.uColor.value=[t.r,t.g,t.b],s.value&&Z(s.value,e)});let _=new P,v=!1;function y(){v||s.value||(v=!0,_.load(`${H.BASE_URL}models/drone.glb`,e=>{e.scene.traverse(e=>{let t=e;t.isMesh&&t.name.toLowerCase().includes(`plane`)&&(t.visible=!1)}),me(e.scene),X(e.scene,Te),Z(e.scene,o.accentColor),s.value=e.scene},void 0,e=>{console.error(`[DroneEntity] drone.glb not found — using primitive fallback.`,e),v=!1}))}function b(){y()}return i({droneRef:c,droneScene:s,droneSpotlightRef:f,droneSpotTargetRef:p,scanRingRef:m,scanUniforms:g,beamUniforms:h,startLoading:b}),u(()=>{f.value&&p.value&&(f.value.target=p.value)}),l(()=>{s.value=null}),(i,o)=>(d(),r(e,null,[a(`TresGroup`,{ref_key:`droneRef`,ref:c,position:[0,0,2]},[s.value?(d(),r(`primitive`,{key:0,object:s.value,rotation:[0,Math.PI,0]},null,8,he)):(d(),r(`TresMesh`,ge,[o[1]||=a(`TresSphereGeometry`,{args:[1,32,32]},null,-1),o[2]||=a(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),a(`TresMesh`,{rotation:[Math.PI/2,0,0]},[o[0]||=a(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),a(`TresMeshBasicMaterial`,{color:t.accentColor},null,8,ve)],8,_e)])),a(`TresGroup`,ye,[a(`TresSpotLight`,{ref_key:`droneSpotlightRef`,ref:f,color:t.accentColor,intensity:3,angle:Math.PI/12,penumbra:.4,distance:15,decay:2,position:[0,0,0]},null,8,be),a(`TresObject3D`,{ref_key:`droneSpotTargetRef`,ref:p,position:[0,0,0]},null,512),a(`TresMesh`,xe,[t.lightingEnabled?(d(),r(`TresConeGeometry`,Se)):n(``,!0),a(`TresShaderMaterial`,{"vertex-shader":x(ue),"fragment-shader":x(le),uniforms:h,transparent:!0,blending:2,"depth-write":!1,side:2},null,8,Ce)])])],512),a(`TresMesh`,{ref_key:`scanRingRef`,ref:m,visible:!1,rotation:[0,0,0]},[o[3]||=a(`TresPlaneGeometry`,{args:[20,20]},null,-1),a(`TresShaderMaterial`,{"vertex-shader":x(fe),"fragment-shader":x(de),uniforms:g,transparent:!0,"depth-write":!1,side:2},null,8,we)],512)],64))}}),De=`uniform vec2 uMouse;
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
`,ke={"render-order":-1},Ae=[`vertex-shader`,`fragment-shader`],je=[`position`],Me=c({__name:`EnvironmentLighting`,props:{particleCount:{}},setup(t,{expose:n}){let i=t,o=A(),s=A(),c={uMouse:{value:new h(typeof window<`u`?window.innerWidth/2:600,typeof window<`u`?window.innerHeight/2:400)},uResolution:{value:new h(typeof window<`u`?window.innerWidth:1200,typeof window<`u`?window.innerHeight:800)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uIsMobile:{value:!1},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new h(.5,.85)}},l=new Float32Array(i.particleCount*3);for(let e=0;e<i.particleCount*3;e++)l[e]=(Math.random()-.5)*6;return n({shaderMaterialRef:o,dustRef:s,uniforms:c}),(t,n)=>(d(),r(e,null,[a(`TresMesh`,ke,[n[0]||=a(`TresPlaneGeometry`,{args:[2,2]},null,-1),a(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:o,"vertex-shader":x(Oe),"fragment-shader":x(De),uniforms:c,"depth-write":!1,"depth-test":!1},null,8,Ae)]),a(`TresPoints`,{ref_key:`dustRef`,ref:s},[a(`TresBufferGeometry`,{position:[x(l),3]},null,8,je),n[1]||=a(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),n[2]||=a(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),n[3]||=a(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),Ne=`
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
`,Pe=`
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
`,Fe=[`object`],Ie={key:1,scale:[.3,.3,.3]},Le=[`rotation`],Re=[`color`],ze=[`position`,`a-velocity`],Be=[`vertex-shader`,`fragment-shader`],Ve=.8,Q=150,He=c({__name:`UfoEntity`,props:{accentColor:{},visible:{type:Boolean}},emits:[`loaded`],setup(t,{expose:i,emit:o}){let s=t,c=o,f=A(null),p=A(null),m=A(),h=y(!1),g=new Float32Array(Q*3),_=new Float32Array(Q);for(let e=0;e<Q;e++){let t=.2+Math.random()*.8,n=Math.random()*Math.PI*2;g[e*3]=Math.cos(n)*t,g[e*3+1]=-2+Math.random()*4,g[e*3+2]=Math.sin(n)*t,_[e]=2+Math.random()*4}let v={uTime:{value:0},uActivationTime:{value:0},uPixelRatio:{value:typeof window<`u`&&window.devicePixelRatio||1},uColor:{value:new k(s.accentColor)},uOpacity:{value:0}};F(()=>s.accentColor,e=>{v.uColor.value.set(e),f.value&&Z(f.value,e)});function b(e){h.value=e}i({ufoRef:p,ufoScene:f,abductionParticlesRef:m,abductionUniforms:v,isTransitioning:h,setTransitioning:b});let S=new P;return u(()=>{S.load(`${H.BASE_URL}models/ufo.glb`,e=>{e.scene.traverse(e=>{let t=e;t.isMesh&&t.material&&(t.material.userData.isUfoMaterial=!0)}),me(e.scene),X(e.scene,Ve),Z(e.scene,s.accentColor),f.value=e.scene,c(`loaded`)},void 0,e=>{console.error(`[UfoEntity] ufo.glb not found — using primitive fallback.`,e),c(`loaded`)})}),l(()=>{f.value=null}),(i,o)=>(d(),r(e,null,[t.visible||h.value?(d(),r(`TresGroup`,{key:0,ref_key:`ufoRef`,ref:p,position:[0,15,0]},[f.value?(d(),r(`primitive`,{key:0,object:f.value},null,8,Fe)):(d(),r(`TresMesh`,Ie,[o[1]||=a(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),o[2]||=a(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),a(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[o[0]||=a(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),a(`TresMeshBasicMaterial`,{color:t.accentColor},null,8,Re)],8,Le)]))],512)):n(``,!0),a(`TresPoints`,{ref_key:`abductionParticlesRef`,ref:m,visible:!1},[a(`TresBufferGeometry`,{position:[x(g),3],"a-velocity":[x(_),1]},null,8,ze),a(`TresShaderMaterial`,{"vertex-shader":x(Pe),"fragment-shader":x(Ne),uniforms:v,transparent:!0,blending:2,"depth-write":!1},null,8,Be)],512)],64))}}),Ue={springStrength:15,damping:.82,maxFocusDuration:3.2,scanInterval:20,scanDuration:3};function We(e={}){let t={...Ue,...e},n=y(`IDLE`),r=y(0),i=y(0),a=10,o=new R(0,0,-2),s=new R,c=new I,l=new R,u=new R,d=0,f=0,p=null,m=0,h=!1,g=0;function _(e,t,a,o,s){let c=Math.max(.35,Math.min(1,s/1200)),l=s<768,u=(Math.sin(e*.2)*4+Math.sin(e*.5)*2)*c,f=Math.cos(e*.3)*1+Math.sin(e*.8)*.5,p=Math.sin(e*.25)*2-3;if(!l&&a&&d>.01){let e=a.x*5*c,t=a.y*3;u=T.lerp(u,e,.85*d),f=T.lerp(f,t,.85*d),p=T.lerp(p,-1.2,.85*d)}let m=e-r.value;if(m>0&&m<i.value){let t=m/i.value,r=t<.5?4*t*t*t:1-(-2*t+2)**3/2,s=Math.sin(r*Math.PI);if(n.value===`CLOSE_VISIT`)p=T.lerp(p,3.8,s),u=T.lerp(u,Math.sin(e*.5)*1.5*c,s),f=T.lerp(f,Math.cos(e*.4)*.5,s);else if(n.value===`DISTANT_PROBE`)p=T.lerp(p,-18,s),u=T.lerp(u,u*1.5,s);else if(!l&&n.value===`FOLLOW_MOUSE`&&!a){let t=o.x*8*c,n=o.y*-5;u=T.lerp(u,t+Math.sin(e*2)*.5,s),f=T.lerp(f,n+Math.cos(e*2)*.5,s),p=T.lerp(p,-1.5,s)}else if(n.value===`LOOPING`){let e=2.5*s,n=t*Math.PI*2;f+=Math.sin(n)*e,p+=(Math.cos(n)-1)*e}}t.set(u,f,p)}function v(e,t,o){if(t)return;let s=o<768,c=Math.random();c<.3?(n.value=`CLOSE_VISIT`,i.value=6):c<.5?(n.value=`DISTANT_PROBE`,i.value=8):c<.75?(n.value=`LOOPING`,i.value=5):(n.value=s?`CLOSE_VISIT`:`FOLLOW_MOUSE`,i.value=10),r.value=e,a=e+i.value+12+Math.random()*8}function b(e){let{elapsed:y,delta:b,focusedElementPos:x,mouseNormalized:S,screenWidth:C}=e,w=Math.max(.35,Math.min(1,C/1200));if(x){x!==p&&(f=y,p=x);let e=+(y-f<t.maxFocusDuration);d=T.lerp(d,e,b*3)}else d=T.lerp(d,0,b*4),p=null;y>a&&v(y,x,C),n.value!==`IDLE`&&y>r.value+i.value&&(n.value=`IDLE`),_(y,l,x,S,C);let E=l.clone().sub(o).multiplyScalar(t.springStrength);s.add(E.multiplyScalar(b));let D=t.damping**(b*60);s.multiplyScalar(D),o.add(s.clone().multiplyScalar(b));let O=Math.sin(y*3.5)*.1,k=o.clone();if(k.y+=O,_(y+.4,u,x,S,C),x&&d>.1){let e=x.x*5*w,t=x.y*3;u.set(e,t,-2)}else n.value===`IDLE`&&(u.x+=S.x*5*.5,u.y+=S.y*-3*.5);let A=o.distanceTo(new R(0,0,5)),j=n.value===`CLOSE_VISIT`&&A<2.5;j&&u.set(0,0,8),c.position.copy(o),c.lookAt(u);let M=-(l.y-o.y)*.8,N=c.rotation.y-(c.userData.lastYaw??c.rotation.y);c.userData.lastYaw=c.rotation.y;let P=Math.atan2(Math.sin(N),Math.cos(N))*1.5;c.rotateX(M),c.rotateZ(P);let F=!1,I=null,L=!1;return y-m>=t.scanInterval&&!h&&(h=!0,g=0,m=y,F=!0),h&&(g+=b,I=Math.min(g/t.scanDuration,1),I>=1&&(h=!1,L=!0,I=null)),{position:k,quaternion:c.quaternion,isVeryClose:j,shouldStartScan:F,scanProgress:I,scanJustCompleted:L}}function x(){return{currentManeuver:n,position:o.clone(),velocity:s.clone(),rotationHelper:c,scanActive:h,scanElapsed:g,focusWeight:d}}function S(){h=!1,g=0}return{currentManeuver:n,update:b,getState:x,resetScan:S,getOrganicFlightPosition:_,triggerManeuver:v}}var Ge={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
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
    }
  `},$=new R;function Ke(e,t,n){$.copy(e).project(t);let r=($.x+1)/2,i=($.y+1)/2;return n?n.set(r,i):new h(r,i)}var qe=c({components:{DroneEntity:Ee,EnvironmentLighting:Me,UfoEntity:He},__name:`WebGLScene`,setup(t){let n=q(),o=G(),s=U(),c=ee(),l=i(()=>n.isBlueprintMode?`#38bdf8`:`#10b981`),u=i(()=>s.gpuTier&&s.gpuTier>=3),f=A(null),p=A(null),_=A(null),v=We(),y=s.isCiMode?10:u.value?200:50;F(()=>o.phase,(e,t)=>{t===`NAV`&&e===`CONTENT`&&p.value?.setTransitioning(!0)});let{renderer:b,scene:S,camera:M,sizes:N}=w(),P=null,I=null,L=null;D(()=>{let e=b.instance,t=M.activeCamera.value;if(e&&S.value&&t&&!P){P=new m(e);let n=new j(S.value,t);P.addPass(n),I=new O(Ge),I.uniforms.amount.value=0,P.addPass(I);let r=()=>{if(P){if(u.value&&!s.isCiMode){let e=new E(new h(N.width.value,N.height.value),.15,.5,.9);P.insertPass(e,1)}u.value&&(L=new C,L.enabled=!1,L.goWild=!1,P.addPass(L))}};typeof requestIdleCallback<`u`?requestIdleCallback(r,{timeout:2e3}):setTimeout(r,500)}}),F([()=>N.width.value,()=>N.height.value],([e,t])=>{P&&P.setSize(e,t);let n=f.value;n?.shaderMaterialRef&&n.shaderMaterialRef.uniforms.uResolution.value.set(e,t)});let R;F(()=>n.isBlueprintMode,()=>{L&&(L.enabled=!0,clearTimeout(R),R=setTimeout(()=>{L&&(L.enabled=!1)},350))});let z=new k;D(()=>{z.set(l.value);let e=f.value;e?.shaderMaterialRef&&(e.shaderMaterialRef.uniforms.uAccentColor.value=[z.r,z.g,z.b])});let B={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0};D(()=>{B.isNavPhase=o.phase===`NAV`,B.isContentPhase=o.phase===`CONTENT`,B.isBlueprintMode=+!!n.isBlueprintMode,B.lightingEnabled=n.lightingEnabled});function H(){setTimeout(()=>{_.value?.startLoading()},500)}let{onBeforeRender:W,render:K}=g(),J=new h(c.rawMouse.x,c.rawMouse.y),Y=0;return K(()=>{P&&P.render()}),W(({elapsed:e,delta:t})=>{let n=p.value?.ufoRef,r=_.value?.droneRef,i=f.value;if(n&&M.activeCamera.value){let r=B.isNavPhase?1.6+Math.sin(e*2)*.1:15,a=1-Math.exp((B.isNavPhase?-2:-3)*t);n.position.y+=(r-n.position.y)*a;let o=n.position.y<10;n.visible=o,!o&&!B.isNavPhase&&p.value?.setTransitioning(!1),o&&i?.shaderMaterialRef&&Ke(n.position,M.activeCamera.value,i.shaderMaterialRef.uniforms.uUfoPosition.value)}if(r){let n=B.isContentPhase;if(r.visible!==n&&(r.visible=n,!n)){v.resetScan();let e=_.value?.scanRingRef,t=_.value?.scanUniforms;e&&(e.visible=!1,t&&(t.uProgress.value=0,t.uOpacity.value=0))}if(n){let n={x:c.rawMouse.x/N.width.value-.5,y:c.rawMouse.y/N.height.value-.5},i=typeof window<`u`?window.innerWidth:1200,a=v.update({elapsed:e,delta:t,focusedElementPos:o.focusedElementPos,mouseNormalized:n,screenWidth:i});r.position.copy(a.position);let s=1-Math.exp(-3.5*t);r.quaternion.slerp(a.quaternion,s),v.currentManeuver.value===`IDLE`&&_.value?.droneScene&&Z(_.value.droneScene,l.value),a.isVeryClose&&M.activeCamera.value&&r.position.distanceTo(M.activeCamera.value.position)<1.8&&L&&!L.enabled&&Math.random()>.95&&(L.enabled=!0,_.value?.droneScene&&Z(_.value.droneScene,`#ef4444`),setTimeout(()=>{L&&(L.enabled=!1),_.value?.droneScene&&Z(_.value.droneScene,l.value)},400));let u=_.value?.droneSpotlightRef,d=_.value?.droneSpotTargetRef;if(u&&d){u.target=d;let n=a.position.distanceTo(r.position)/t,i=Math.min(n*.1,4),o=a.isVeryClose?5:0;u.intensity=3+i+o+Math.sin(e*8)*.5+Math.sin(e*13)*.3;let s=1+i*.2+o*.5;_.value?.beamUniforms.uColor.value.set(l.value).multiplyScalar(s)}a.shouldStartScan&&L&&(L.enabled=!0,setTimeout(()=>{L&&(L.enabled=!1)},300));let f=_.value?.scanRingRef,p=_.value?.scanUniforms;a.scanProgress!==null&&f&&p&&(f.visible=!0,f.position.copy(r.position),f.position.y-=.5,p.uProgress.value=a.scanProgress,p.uOpacity.value=1-a.scanProgress*a.scanProgress),a.scanJustCompleted&&f&&p&&(f.visible=!1,p.uProgress.value=0,p.uOpacity.value=0)}}let a=p.value?.abductionParticlesRef,s=p.value?.abductionUniforms;if(a&&s&&a.geometry?.attributes?.position){let n=p.value?.ufoRef,r=B.isContentPhase&&n&&n.position.y<8;r&&!a.visible&&(s.uActivationTime.value=e),r?(Y=T.lerp(Y,1,t*10),a.visible=!0):(Y=T.lerp(Y,0,t*5),Y<.01&&(a.visible=!1)),a.visible&&(s.uOpacity.value=Y*.8)}if(s&&(s.uTime.value=e),i?.dustRef&&(i.dustRef.rotation.y+=.05*t,i.dustRef.rotation.x+=.02*t),I){let e=c.rawMouse.x,t=c.rawMouse.y,n=e-J.x,r=t-J.y,i=Math.sqrt(n*n+r*r);J.set(e,t);let a=Math.min(i*5e-5,.005);I.uniforms.amount.value+=(a-I.uniforms.amount.value)*.1}if(!i?.shaderMaterialRef)return;let u=i.shaderMaterialRef.uniforms;u.uTime.value=e,u.uMouse.value.set(c.rawMouse.x,c.rawMouse.y),u.uThemeState.value!==B.isBlueprintMode&&(u.uThemeState.value=B.isBlueprintMode),u.uLightingEnabled.value!==B.lightingEnabled&&(u.uLightingEnabled.value=B.lightingEnabled);let d=(typeof window<`u`?window.innerWidth:1200)<768;u.uIsMobile.value=d;let m=+!!B.isContentPhase,h=1-Math.exp(-4*t);u.uPhase.value+=(m-u.uPhase.value)*h}),(t,i)=>(d(),r(e,null,[i[0]||=a(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),V(Me,{ref_key:`envRef`,ref:f,"particle-count":x(y)},null,8,[`particle-count`]),V(He,{ref_key:`ufoEntity`,ref:p,"accent-color":l.value,visible:x(o).phase===`NAV`,onLoaded:H},null,8,[`accent-color`,`visible`]),V(Ee,{ref_key:`droneEntity`,ref:_,"accent-color":l.value,"lighting-enabled":x(n).lightingEnabled},null,8,[`accent-color`,`lighting-enabled`])],64))}}),Je={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},Ye=c({__name:`WebGLBackground`,setup(e){let a=U(),o=i(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:z,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,i)=>x(a).isReady&&x(a).isWebGLSupported?(d(),r(`div`,Je,[V(x(N),L(s(o.value)),{default:M(()=>[V(qe)]),_:1},16)])):x(a).isReady?(d(),t(ce,{key:1})):n(``,!0)}});export{Ye as default};
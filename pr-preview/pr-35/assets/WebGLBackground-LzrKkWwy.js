import{$ as e,B as t,D as n,F as r,O as i,R as a,T as o,Y as s,_ as c,a as ee,b as l,c as u,d,f,h as p,i as m,l as h,mt as g,n as _,o as v,r as y,s as b,t as x,u as S,v as C,x as w,z as T}from"./three-vendor-DahUnWlF.js";import{i as E,n as te,r as D,t as O}from"./index-CQ5rwiMS.js";var k=`uniform vec2 uMouse;
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
    // Normalize coordinates (aspect-ratio corrected)
    vec2 st = gl_FragCoord.xy / uResolution.xy;
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

    //   CONTENT phase: Cyber-Optic HUD Scanner (Micro)
    if (uPhase > 0.5) {
      vec2 dir = st - mouse;
      float dist = length(dir);
      float angle = atan(dir.y, dir.x);
      
      // 1. GRÖSSE: Noch kleiner! (Von 0.05 auf 0.025 halbiert)
      float outerRadius = 0.025; 
      float coreRadius = 0.003;  // Der Kern ist jetzt ein winziger Nadelstich
      
      // 2. KERN: Extrem scharf
      float core = smoothstep(coreRadius, 0.0, dist) * 2.5;
      
      // 3. TECH-RING: Hauchdünn
      float ring = smoothstep(outerRadius, outerRadius - 0.001, dist) - 
                   smoothstep(outerRadius - 0.001, outerRadius - 0.003, dist);
                   
      // 8 rotierende Lücken für mehr Tech-Feeling bei der kleinen Größe
      float gaps = sin(angle * 8.0 + uTime * -3.0); 
      ring *= smoothstep(0.0, 0.5, gaps) * 1.5; 
      
      // 4. RADAR-SWEEP: Schneller und dezenter
      float sweepAngle = fract(angle / 6.28318 + uTime * 1.2); 
      float sweep = sweepAngle * smoothstep(outerRadius, 0.0, dist) * 0.2;
      
      // 5. AMBIENT: Fast komplett reduziert, nur minimaler Glow
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
`,A=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,j=new f;function M(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new d(r,i)}var N=[`position`],P={"render-order":-1},F=[`vertex-shader`,`fragment-shader`],I=[`rotation`],L=[`color`],R=[`rotation`],z=[`color`],B=n({__name:`WebGLScene`,setup(t){let n=E(),i=c(()=>n.gpuTier&&n.gpuTier>=3),o=s(),l=s(),f=s(),g=s(),v=O(),S=te(),j=D(),B=c(()=>S.isBlueprintMode?`#38bdf8`:`#10b981`),{renderer:V,scene:H,camera:U,sizes:W}=u(),G=null,K=null,q=null,ne={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};T(()=>{let e=V.instance,t=U.activeCamera.value;if(e&&H.value&&t&&!G){G=new m(e);let r=new _(H.value,t);if(G.addPass(r),i.value&&!n.isCiMode){let e=new x(new d(W.width.value,W.height.value),.15,.5,.9);G.addPass(e)}K=new ee(ne),K.uniforms.amount.value=0,G.addPass(K),i.value&&(q=new y,q.enabled=!1,q.goWild=!1,G.addPass(q))}}),a([()=>W.width.value,()=>W.height.value],([e,t])=>{G&&G.setSize(e,t),o.value&&o.value.uniforms.uResolution.value.set(e,t)});let J;a(()=>S.isBlueprintMode,()=>{q&&(q.enabled=!0,clearTimeout(J),J=setTimeout(()=>{q&&(q.enabled=!1)},350))});let Y=n.isCiMode?10:i.value?200:50,X=new Float32Array(Y*3);for(let e=0;e<Y*3;e++)X[e]=(Math.random()-.5)*6;let re={uMouse:{value:new d(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new d(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new d(.5,.85)}},{onBeforeRender:ie,render:ae}=b();ae(()=>{G&&G.render()});let Z=new d(v.rawMouse.x,v.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new h;return T(()=>{$.set(B.value),o.value&&(o.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Q.isNavPhase=j.phase===`NAV`,Q.isContentPhase=j.phase===`CONTENT`,Q.isBlueprintMode=+!!S.isBlueprintMode,Q.lightingEnabled=S.lightingEnabled}),ie(({elapsed:e,delta:t})=>{if(f.value&&U.activeCamera.value&&(f.value.visible!==Q.isNavPhase&&(f.value.visible=Q.isNavPhase),Q.isNavPhase&&(f.value.position.y=1.6+Math.sin(e*2)*.1,o.value&&M(f.value.position,U.activeCamera.value,o.value.uniforms.uUfoPosition.value))),g.value&&(g.value.visible!==Q.isContentPhase&&(g.value.visible=Q.isContentPhase),Q.isContentPhase&&(g.value.position.x=Math.sin(e*.4)*5,g.value.position.y=Math.cos(e*.3)*2,g.value.position.z=-4+Math.sin(e*.6)*2,g.value.rotation.x=e*.5,g.value.rotation.y=e*.8)),l.value&&(l.value.rotation.y+=.05*t,l.value.rotation.x+=.02*t),K){let e=v.rawMouse.x,t=v.rawMouse.y,n=e-Z.x,r=t-Z.y,i=Math.sqrt(n*n+r*r);Z.set(e,t);let a=Math.min(i*5e-5,.005);K.uniforms.amount.value+=(a-K.uniforms.amount.value)*.1}if(!o.value)return;let n=o.value.uniforms;n.uTime.value=e,n.uMouse.value.set(v.rawMouse.x,v.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase;n.uPhase.value!==r&&(n.uPhase.value=r)}),(t,n)=>(r(),w(p,null,[n[8]||=C(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),C(`TresPoints`,{ref_key:`dustRef`,ref:l},[C(`TresBufferGeometry`,{position:[e(X),3]},null,8,N),n[0]||=C(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),C(`TresMesh`,P,[n[1]||=C(`TresPlaneGeometry`,{args:[2,2]},null,-1),C(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:o,"vertex-shader":e(A),"fragment-shader":e(k),uniforms:re,"depth-write":!1,"depth-test":!1},null,8,F)]),C(`TresMesh`,{ref_key:`ufoRef`,ref:f,position:[0,1.6,0],scale:[.3,.3,.3]},[n[3]||=C(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),n[4]||=C(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),C(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[n[2]||=C(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),C(`TresMeshBasicMaterial`,{color:B.value},null,8,L)],8,I)],512),C(`TresMesh`,{ref_key:`droneRef`,ref:g,position:[0,0,2],scale:[.15,.15,.15]},[n[6]||=C(`TresSphereGeometry`,{args:[1,32,32]},null,-1),n[7]||=C(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),C(`TresMesh`,{rotation:[Math.PI/2,0,0]},[n[5]||=C(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),C(`TresMeshBasicMaterial`,{color:B.value},null,8,z)],8,R)],512),n[9]||=C(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),n[10]||=C(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),V={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},H=n({__name:`WebGLBackground`,setup(n){let a=E(),s=c(()=>{let e=a.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:S,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(n,c)=>e(a).isReady&&e(a).isWebGLSupported?(r(),w(`div`,V,[o(e(v),g(i(s.value)),{default:t(()=>[o(B)]),_:1},16)])):l(``,!0)}});export{H as default};
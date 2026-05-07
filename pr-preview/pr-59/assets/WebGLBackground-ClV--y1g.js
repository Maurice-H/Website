import{B as e,D as t,F as n,O as r,T as i,V as a,Z as o,_ as s,a as c,b as l,c as ee,d as u,f as d,h as f,i as te,l as p,n as m,o as h,r as g,s as _,t as v,tt as y,u as b,v as x,vt as S,x as C,z as w}from"./three-vendor-BpT33N26.js";import{i as T,n as E,r as D,t as O}from"./index-C04ifqH9.js";var k=`uniform vec2 uMouse;
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
`,ne=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,A=new d;function j(e,t,n){A.copy(e).project(t);let r=(A.x+1)/2,i=(A.y+1)/2;return n?n.set(r,i):new u(r,i)}var M=[`position`],N={"render-order":-1},P=[`vertex-shader`,`fragment-shader`],F=[`rotation`],I=[`color`],L=[`rotation`],R=[`color`],z=t({__name:`WebGLScene`,setup(t){let r=T(),i=s(()=>r.gpuTier&&r.gpuTier>=3),a=o(),l=o(),d=o(),h=o(),b=D(),S=O(),A=E(),z=s(()=>S.isBlueprintMode?`#38bdf8`:`#10b981`),{renderer:B,scene:V,camera:H,sizes:U}=ee(),W=null,G=null,K=null,q={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};e(()=>{let e=B.instance,t=H.activeCamera.value;if(e&&V.value&&t&&!W){W=new te(e);let n=new m(V.value,t);if(W.addPass(n),i.value&&!r.isCiMode){let e=new v(new u(U.width.value,U.height.value),.15,.5,.9);W.addPass(e)}G=new c(q),G.uniforms.amount.value=0,W.addPass(G),i.value&&(K=new g,K.enabled=!1,K.goWild=!1,W.addPass(K))}}),w([()=>U.width.value,()=>U.height.value],([e,t])=>{W&&W.setSize(e,t),a.value&&a.value.uniforms.uResolution.value.set(e,t)});let J;w(()=>S.isBlueprintMode,()=>{K&&(K.enabled=!0,clearTimeout(J),J=setTimeout(()=>{K&&(K.enabled=!1)},350))});let Y=r.isCiMode?10:i.value?200:50,X=new Float32Array(Y*3);for(let e=0;e<Y*3;e++)X[e]=(Math.random()-.5)*6;let re={uMouse:{value:new u(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new u(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new u(.5,.85)}},{onBeforeRender:ie,render:ae}=_();ae(()=>{W&&W.render()});let Z=new u(b.rawMouse.x,b.rawMouse.y),Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0},$=new p;return e(()=>{$.set(z.value),a.value&&(a.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Q.isNavPhase=A.phase===`NAV`,Q.isContentPhase=A.phase===`CONTENT`,Q.isBlueprintMode=+!!S.isBlueprintMode,Q.lightingEnabled=S.lightingEnabled}),ie(({elapsed:e,delta:t})=>{if(d.value&&H.activeCamera.value&&(d.value.visible!==Q.isNavPhase&&(d.value.visible=Q.isNavPhase),Q.isNavPhase&&(d.value.position.y=1.6+Math.sin(e*2)*.1,a.value&&j(d.value.position,H.activeCamera.value,a.value.uniforms.uUfoPosition.value))),h.value&&(h.value.visible!==Q.isContentPhase&&(h.value.visible=Q.isContentPhase),Q.isContentPhase&&(h.value.position.x=Math.sin(e*.4)*5,h.value.position.y=Math.cos(e*.3)*2,h.value.position.z=-4+Math.sin(e*.6)*2,h.value.rotation.x=e*.5,h.value.rotation.y=e*.8)),l.value&&(l.value.rotation.y+=.05*t,l.value.rotation.x+=.02*t),G){let e=b.rawMouse.x,t=b.rawMouse.y,n=e-Z.x,r=t-Z.y,i=Math.sqrt(n*n+r*r);Z.set(e,t);let a=Math.min(i*5e-5,.005);G.uniforms.amount.value+=(a-G.uniforms.amount.value)*.1}if(!a.value)return;let n=a.value.uniforms;n.uTime.value=e,n.uMouse.value.set(b.rawMouse.x,b.rawMouse.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase;n.uPhase.value!==r&&(n.uPhase.value=r)}),(e,t)=>(n(),C(f,null,[t[8]||=x(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),x(`TresPoints`,{ref_key:`dustRef`,ref:l},[x(`TresBufferGeometry`,{position:[y(X),3]},null,8,M),t[0]||=x(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),x(`TresMesh`,N,[t[1]||=x(`TresPlaneGeometry`,{args:[2,2]},null,-1),x(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:a,"vertex-shader":y(ne),"fragment-shader":y(k),uniforms:re,"depth-write":!1,"depth-test":!1},null,8,P)]),x(`TresMesh`,{ref_key:`ufoRef`,ref:d,position:[0,1.6,0],scale:[.3,.3,.3]},[t[3]||=x(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),t[4]||=x(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),x(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[t[2]||=x(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),x(`TresMeshBasicMaterial`,{color:z.value},null,8,I)],8,F)],512),x(`TresMesh`,{ref_key:`droneRef`,ref:h,position:[0,0,2],scale:[.15,.15,.15]},[t[6]||=x(`TresSphereGeometry`,{args:[1,32,32]},null,-1),t[7]||=x(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),x(`TresMesh`,{rotation:[Math.PI/2,0,0]},[t[5]||=x(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),x(`TresMeshBasicMaterial`,{color:z.value},null,8,R)],8,L)],512),t[9]||=x(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),t[10]||=x(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),B={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},V=t({__name:`WebGLBackground`,setup(e){let t=T(),o=s(()=>{let e=t.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:b,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(e,s)=>y(t).isReady&&y(t).isWebGLSupported?(n(),C(`div`,B,[i(y(h),S(r(o.value)),{default:a(()=>[i(z)]),_:1},16)])):l(``,!0)}});export{V as default};
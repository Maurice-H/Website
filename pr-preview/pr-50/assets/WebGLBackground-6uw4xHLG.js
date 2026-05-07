import{B as e,D as t,F as n,O as r,R as i,T as a,X as o,_ as s,_t as c,a as ee,b as l,c as u,d,et as f,f as p,h as m,i as h,l as g,n as _,o as v,r as y,s as b,t as x,u as S,v as C,x as w,z as T}from"./three-vendor-NywiqKTw.js";import{i as E,n as te,r as D,t as O}from"./index-BJmKiJHl.js";var k=`uniform vec2 uMouse;
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
`,A=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,j=new p;function M(e,t,n){j.copy(e).project(t);let r=(j.x+1)/2,i=(j.y+1)/2;return n?n.set(r,i):new d(r,i)}var ne=[`position`],re={"render-order":-1},N=[`vertex-shader`,`fragment-shader`],P=[`rotation`],F=[`color`],I=[`rotation`],L=[`color`],R=t({__name:`WebGLScene`,setup(e){let t=E(),r=s(()=>t.gpuTier&&t.gpuTier>=3),a=o(),c=o(),l=o(),p=o(),v=D(),S=O(),j=te(),R=s(()=>S.isBlueprintMode?`#38bdf8`:`#10b981`),{renderer:z,scene:B,camera:V,sizes:H}=u(),U=null,W=null,G=null,K={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};T(()=>{let e=z.instance,n=V.activeCamera.value;if(e&&B.value&&n&&!U){U=new h(e);let i=new _(B.value,n);if(U.addPass(i),r.value&&!t.isCiMode){let e=new x(new d(H.width.value,H.height.value),.15,.5,.9);U.addPass(e)}W=new ee(K),W.uniforms.amount.value=0,U.addPass(W),r.value&&(G=new y,G.enabled=!1,G.goWild=!1,U.addPass(G))}}),i([()=>H.width.value,()=>H.height.value],([e,t])=>{U&&U.setSize(e,t),a.value&&a.value.uniforms.uResolution.value.set(e,t)});let q;i(()=>S.isBlueprintMode,()=>{G&&(G.enabled=!0,clearTimeout(q),q=setTimeout(()=>{G&&(G.enabled=!1)},350))});let J=t.isCiMode?10:r.value?200:50,Y=new Float32Array(J*3);for(let e=0;e<J*3;e++)Y[e]=(Math.random()-.5)*6;let ie={uMouse:{value:new d(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new d(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new d(.5,.85)}},{onBeforeRender:ae,render:oe}=b();oe(()=>{U&&U.render()});let X=new d(v.rawMouse.x,v.rawMouse.y),Z=v.rawMouse,Q={isNavPhase:!0,isContentPhase:!1,isBlueprintMode:0,lightingEnabled:!0,ufo:null,drone:null,dust:null,shaderMaterial:null,activeCamera:null},$=new g;return T(()=>{$.set(R.value),a.value&&(a.value.uniforms.uAccentColor.value=[$.r,$.g,$.b]),Q.isNavPhase=j.phase===`NAV`,Q.isContentPhase=j.phase===`CONTENT`,Q.isBlueprintMode=+!!S.isBlueprintMode,Q.lightingEnabled=S.lightingEnabled,Q.ufo=l.value,Q.drone=p.value,Q.dust=c.value,Q.shaderMaterial=a.value,Q.activeCamera=V.activeCamera.value}),ae(({elapsed:e,delta:t})=>{if(Q.ufo&&Q.activeCamera&&(Q.ufo.visible!==Q.isNavPhase&&(Q.ufo.visible=Q.isNavPhase),Q.isNavPhase&&(Q.ufo.position.y=1.6+Math.sin(e*2)*.1,Q.shaderMaterial&&M(Q.ufo.position,Q.activeCamera,Q.shaderMaterial.uniforms.uUfoPosition.value))),Q.drone&&(Q.drone.visible!==Q.isContentPhase&&(Q.drone.visible=Q.isContentPhase),Q.isContentPhase&&(Q.drone.position.x=Math.sin(e*.4)*5,Q.drone.position.y=Math.cos(e*.3)*2,Q.drone.position.z=-4+Math.sin(e*.6)*2,Q.drone.rotation.x=e*.5,Q.drone.rotation.y=e*.8)),Q.dust&&(Q.dust.rotation.y+=.05*t,Q.dust.rotation.x+=.02*t),W){let e=Z.x,t=Z.y,n=e-X.x,r=t-X.y,i=Math.sqrt(n*n+r*r);X.set(e,t);let a=Math.min(i*5e-5,.005);W.uniforms.amount.value+=(a-W.uniforms.amount.value)*.1}if(!Q.shaderMaterial)return;let n=Q.shaderMaterial.uniforms;n.uTime.value=e,n.uMouse.value.set(Z.x,Z.y),n.uThemeState.value!==Q.isBlueprintMode&&(n.uThemeState.value=Q.isBlueprintMode),n.uLightingEnabled.value!==Q.lightingEnabled&&(n.uLightingEnabled.value=Q.lightingEnabled);let r=+!!Q.isContentPhase;n.uPhase.value!==r&&(n.uPhase.value=r)}),(e,t)=>(n(),w(m,null,[t[8]||=C(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),C(`TresPoints`,{ref_key:`dustRef`,ref:c},[C(`TresBufferGeometry`,{position:[f(Y),3]},null,8,ne),t[0]||=C(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),C(`TresMesh`,re,[t[1]||=C(`TresPlaneGeometry`,{args:[2,2]},null,-1),C(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:a,"vertex-shader":f(A),"fragment-shader":f(k),uniforms:ie,"depth-write":!1,"depth-test":!1},null,8,N)]),C(`TresMesh`,{ref_key:`ufoRef`,ref:l,position:[0,1.6,0],scale:[.3,.3,.3]},[t[3]||=C(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),t[4]||=C(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),C(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[t[2]||=C(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),C(`TresMeshBasicMaterial`,{color:R.value},null,8,F)],8,P)],512),C(`TresMesh`,{ref_key:`droneRef`,ref:p,position:[0,0,2],scale:[.15,.15,.15]},[t[6]||=C(`TresSphereGeometry`,{args:[1,32,32]},null,-1),t[7]||=C(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),C(`TresMesh`,{rotation:[Math.PI/2,0,0]},[t[5]||=C(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),C(`TresMeshBasicMaterial`,{color:R.value},null,8,L)],8,I)],512),t[9]||=C(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),t[10]||=C(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),z={key:0,class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},B=t({__name:`WebGLBackground`,setup(t){let i=E(),o=s(()=>{let e=i.gpuTier||2;return{clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:S,toneMapping:0,antialias:e>=3,pixelRatio:e<3?Math.min(window.devicePixelRatio,1.5):Math.min(window.devicePixelRatio,2),powerPreference:e>=3?`high-performance`:`default`}});return(t,s)=>f(i).isReady&&f(i).isWebGLSupported?(n(),w(`div`,z,[a(f(v),c(r(o.value)),{default:e(()=>[a(R)]),_:1},16)])):l(``,!0)}});export{B as default};
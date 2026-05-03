import{$ as e,B as t,D as n,F as r,O as i,R as a,T as o,Y as s,_ as c,a as l,c as u,d,f,h as p,i as ee,l as m,mt as h,n as g,o as _,r as v,s as y,t as b,u as x,v as S,x as C,z as w}from"./three-vendor-DahUnWlF.js";import{n as T,r as E,t as D}from"./index-D9SC4Ys6.js";var O=`uniform vec2 uMouse;
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
`,k=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,A=new f;function j(e,t){return A.copy(e).project(t),new d((A.x+1)/2,(A.y+1)/2)}var M=[`position`],N={"render-order":-1},P=[`vertex-shader`,`fragment-shader`],F=[`rotation`],I=[`color`],L=[`rotation`],R=[`color`],z=200,B=n({__name:`WebGLScene`,setup(t){let n=s(),i=s(),o=s(),f=s(),h=D(),_=T(),x=E(),A=c(()=>_.isBlueprintMode?`#38bdf8`:`#10b981`),{renderer:B,scene:V,camera:H,sizes:U}=u(),W=null,G=null,K=null,q={uniforms:{tDiffuse:{value:null},amount:{value:.005},angle:{value:0}},vertexShader:`
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
    }`};w(()=>{let e=B.instance,t=H.activeCamera.value;if(e&&V.value&&t&&!W){W=new ee(e);let n=new g(V.value,t);W.addPass(n);let r=new b(new d(U.width.value,U.height.value),.15,.5,.9);W.addPass(r),G=new l(q),G.uniforms.amount.value=0,W.addPass(G),K=new v,K.enabled=!1,K.goWild=!1,W.addPass(K)}}),a([()=>U.width.value,()=>U.height.value],([e,t])=>{W&&W.setSize(e,t),n.value&&n.value.uniforms.uResolution.value.set(e,t)});let J;a(()=>_.isBlueprintMode,()=>{K&&(K.enabled=!0,clearTimeout(J),J=setTimeout(()=>{K&&(K.enabled=!1)},350))});let Y=new Float32Array(z*3);for(let e=0;e<z*3;e++)Y[e]=(Math.random()-.5)*6;let X={uMouse:{value:new d(window.innerWidth/2,window.innerHeight/2)},uResolution:{value:new d(window.innerWidth,window.innerHeight)},uTime:{value:0},uThemeState:{value:0},uLightingEnabled:{value:!0},uPhase:{value:0},uAccentColor:{value:[.063,.725,.506]},uUfoPosition:{value:new d(.5,.85)}},{onBeforeRender:Z,render:te}=y();te(()=>{W&&W.render()});let Q=new d(h.rawMouse.x,h.rawMouse.y),$=new m;return w(()=>{$.set(A.value),n.value&&(n.value.uniforms.uAccentColor.value=[$.r,$.g,$.b])}),Z(({elapsed:e,delta:t})=>{if(o.value&&H.activeCamera.value){let t=x.phase===`NAV`;if(o.value.visible!==t&&(o.value.visible=t),t){o.value.position.y=1.6+Math.sin(e*2)*.1;let t=j(o.value.position,H.activeCamera.value);n.value&&n.value.uniforms.uUfoPosition.value.copy(t)}}if(f.value){let t=x.phase===`CONTENT`;f.value.visible!==t&&(f.value.visible=t),t&&(f.value.position.x=Math.sin(e*.4)*5,f.value.position.y=Math.cos(e*.3)*2,f.value.position.z=-4+Math.sin(e*.6)*2,f.value.rotation.x=e*.5,f.value.rotation.y=e*.8)}if(i.value&&(i.value.rotation.y+=.05*t,i.value.rotation.x+=.02*t),G){let e=h.rawMouse.x,t=h.rawMouse.y,n=e-Q.x,r=t-Q.y,i=Math.sqrt(n*n+r*r);Q.set(e,t);let a=Math.min(i*5e-5,.005);G.uniforms.amount.value+=(a-G.uniforms.amount.value)*.1}if(!n.value)return;let r=n.value.uniforms;r.uTime.value=e,r.uMouse.value.set(h.rawMouse.x,h.rawMouse.y);let a=+!!_.isBlueprintMode;r.uThemeState.value!==a&&(r.uThemeState.value=a);let s=_.lightingEnabled;r.uLightingEnabled.value!==s&&(r.uLightingEnabled.value=s);let c=+(x.phase===`CONTENT`);r.uPhase.value!==c&&(r.uPhase.value=c)}),(t,a)=>(r(),C(p,null,[a[8]||=S(`TresPerspectiveCamera`,{position:[0,0,5],"look-at":[0,0,0]},null,-1),S(`TresPoints`,{ref_key:`dustRef`,ref:i},[S(`TresBufferGeometry`,{position:[e(Y),3]},null,8,M),a[0]||=S(`TresPointsMaterial`,{color:`#f8fafc`,size:.02,transparent:!0,opacity:.25,"size-attenuation":!0,"depth-write":!1},null,-1)],512),S(`TresMesh`,N,[a[1]||=S(`TresPlaneGeometry`,{args:[2,2]},null,-1),S(`TresShaderMaterial`,{ref_key:`shaderMaterialRef`,ref:n,"vertex-shader":e(k),"fragment-shader":e(O),uniforms:X,"depth-write":!1,"depth-test":!1},null,8,P)]),S(`TresMesh`,{ref_key:`ufoRef`,ref:o,position:[0,1.6,0],scale:[.3,.3,.3]},[a[3]||=S(`TresCylinderGeometry`,{args:[1.2,1.5,.4,32]},null,-1),a[4]||=S(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),S(`TresMesh`,{position:[0,-.2,0],rotation:[Math.PI/2,0,0]},[a[2]||=S(`TresTorusGeometry`,{args:[1.4,.05,12,32]},null,-1),S(`TresMeshBasicMaterial`,{color:A.value},null,8,I)],8,F)],512),S(`TresMesh`,{ref_key:`droneRef`,ref:f,position:[0,0,2],scale:[.15,.15,.15]},[a[6]||=S(`TresSphereGeometry`,{args:[1,32,32]},null,-1),a[7]||=S(`TresMeshStandardMaterial`,{color:`#333333`,metalness:.8,roughness:.2},null,-1),S(`TresMesh`,{rotation:[Math.PI/2,0,0]},[a[5]||=S(`TresTorusGeometry`,{args:[1.5,.1,12,32]},null,-1),S(`TresMeshBasicMaterial`,{color:A.value},null,8,R)],8,L)],512),a[9]||=S(`TresDirectionalLight`,{position:[5,10,5],intensity:2},null,-1),a[10]||=S(`TresAmbientLight`,{intensity:.5},null,-1)],64))}}),V={class:`fixed inset-0 w-full h-full z-50 mix-blend-screen pointer-events-none`},H=n({__name:`WebGLBackground`,setup(n){let a={clearColor:`#000000`,shadows:!1,alpha:!1,shadowMapType:0,outputColorSpace:x,toneMapping:0,pixelRatio:Math.min(window.devicePixelRatio,2)};return(n,s)=>(r(),C(`div`,V,[o(e(_),h(i(a)),{default:t(()=>[o(B)]),_:1},16)]))}});export{H as default};
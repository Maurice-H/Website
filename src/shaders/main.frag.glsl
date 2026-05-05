uniform vec2 uMouse;
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

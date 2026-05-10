import re

with open('src/components/layout/WebGLScene.vue', 'r') as f:
    content = f.read()

# Apply everything again because apparently the changes were lost when I switched branches earlier.

# Add Shaders
abduction_shaders = """// ── Abduction Particle Shader ──
const abductionVertShader = `
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
`;

const abductionFragShader = `
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
`;
"""

search = "const scanVertShader ="
replace = abduction_shaders + "\nconst scanVertShader ="
if search in content:
    content = content.replace(search, replace)


search_template = """  <!-- Abduction Particles -->
  <TresPoints ref="abductionParticlesRef" :visible="false">
    <TresBufferGeometry :position="[abductionPositions, 3]" />
    <TresPointsMaterial
      :color="accentColorStr"
      :size="0.04"
      :transparent="true"
      :opacity="0.8"
      :blending="2"
      :depth-write="false"
      :size-attenuation="true"
    />
  </TresPoints>"""

replace_template = """  <!-- Abduction Particles -->
  <TresPoints ref="abductionParticlesRef" :visible="false">
    <TresBufferGeometry :position="[abductionPositions, 3]" :a-velocity="[abductionVelocities, 1]" />
    <TresShaderMaterial
      :vertex-shader="abductionVertShader"
      :fragment-shader="abductionFragShader"
      :uniforms="abductionUniforms"
      :transparent="true"
      :blending="2"
      :depth-write="false"
    />
  </TresPoints>"""

if search_template in content:
    content = content.replace(search_template, replace_template)

search_uniforms = "const uniforms = {"
replace_uniforms = """const abductionUniforms = {
  uTime: { value: 0 },
  uActivationTime: { value: 0 },
  uPixelRatio: { value: window.devicePixelRatio || 1.0 },
  uColor: { value: new Color(accentColorStr.value) },
  uOpacity: { value: 0.0 },
};

const uniforms = {"""

if search_uniforms in content:
    content = content.replace(search_uniforms, replace_uniforms)


search_loop = """      if (isAbducting && !abductionParticlesRef.value.visible) {
        // Reset particle positions below the UFO on first activation
        // so they visibly stream upward from the start
        const positions = posAttr.array as Float32Array;
        for (let i = 0; i < ABDUCTION_PARTICLE_COUNT; i++) {
          const radius = 0.2 + Math.random() * 0.8;
          const theta = Math.random() * Math.PI * 2;
          positions[i * 3] = Math.cos(theta) * radius;
          positions[i * 3 + 1] = -2 + Math.random() * 2; // start below
          positions[i * 3 + 2] = Math.sin(theta) * radius;
        }
        posAttr.needsUpdate = true;
      }

      if (isAbducting) {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 1.0, delta * 10);
        abductionParticlesRef.value.visible = true;
      } else {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 0.0, delta * 5);
        if (abductionOpacity < 0.01) {
          abductionParticlesRef.value.visible = false;
        }
      }

      if (abductionParticlesRef.value.visible) {
        const positions = posAttr.array as Float32Array;
        for (let i = 0; i < ABDUCTION_PARTICLE_COUNT; i++) {
          positions[i * 3 + 1] += abductionVelocities[i] * delta;
          if (positions[i * 3 + 1] > 4.0) {
            positions[i * 3 + 1] = -2.0;
          }
        }
        posAttr.needsUpdate = true;
        (abductionParticlesRef.value.material as PointsMaterial).opacity = abductionOpacity * 0.8;
      }"""

replace_loop = """      if (isAbducting && !abductionParticlesRef.value.visible) {
        // Record activation time to trigger bottom-up streaming effect
        abductionUniforms.uActivationTime.value = elapsed;
      }

      if (isAbducting) {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 1.0, delta * 10);
        abductionParticlesRef.value.visible = true;
      } else {
        abductionOpacity = MathUtils.lerp(abductionOpacity, 0.0, delta * 5);
        if (abductionOpacity < 0.01) {
          abductionParticlesRef.value.visible = false;
        }
      }

      if (abductionParticlesRef.value.visible) {
        // Update uniforms instead of modifying positions on CPU
        abductionUniforms.uOpacity.value = abductionOpacity * 0.8;
      }"""

if search_loop in content:
    content = content.replace(search_loop, replace_loop)


search_time = """  if (!shaderMaterialRef.value) return;

  const u = shaderMaterialRef.value.uniforms;
  u.uTime.value = elapsed;
  u.uMouse.value.set(viewportStore.rawMouse.x, viewportStore.rawMouse.y);"""

replace_time = """  abductionUniforms.uTime.value = elapsed;

  if (!shaderMaterialRef.value) return;

  const u = shaderMaterialRef.value.uniforms;
  u.uTime.value = elapsed;
  u.uMouse.value.set(viewportStore.rawMouse.x, viewportStore.rawMouse.y);"""

if search_time in content:
    content = content.replace(search_time, replace_time)

search_color = """const accentColor = new Color();
watchEffect(() => {
  accentColor.set(accentColorStr.value);
  if (shaderMaterialRef.value) {
    shaderMaterialRef.value.uniforms.uAccentColor.value = [
      accentColor.r,
      accentColor.g,
      accentColor.b,
    ];
  }

  scanUniforms.uColor.value = [accentColor.r, accentColor.g, accentColor.b];"""

replace_color = """const accentColor = new Color();
watchEffect(() => {
  accentColor.set(accentColorStr.value);
  if (shaderMaterialRef.value) {
    shaderMaterialRef.value.uniforms.uAccentColor.value = [
      accentColor.r,
      accentColor.g,
      accentColor.b,
    ];
  }

  abductionUniforms.uColor.value.set(accentColorStr.value);

  scanUniforms.uColor.value = [accentColor.r, accentColor.g, accentColor.b];"""

if search_color in content:
    content = content.replace(search_color, replace_color)


search_import = "PointsMaterial,"
replace_import = ""
if search_import in content:
    content = content.replace(search_import, replace_import)

# Fix the import spacing
content = content.replace("type \n  type SpotLight,", "type SpotLight,")
content = content.replace("type type SpotLight,", "type SpotLight,")
content = content.replace("type \n  SpotLight,", "SpotLight,")

with open('src/components/layout/WebGLScene.vue', 'w') as f:
    f.write(content)

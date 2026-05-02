# 💡 Portfolio v2: A Spec-Driven Development Experiment

> _A dark, mysterious, and interactive developer portfolio themed around volumetric lighting and glassmorphism._

🚧 **Status: Active Development (Phase 1) – Build in Public AI Experiment** 🚧
_Note for recruiters and developers: This repository is currently a living document. The existing bugs, UI inconsistencies, and performance issues are not accidental—they are the direct, unfiltered output of an ongoing AI-driven Spec-Driven Development (SDD) process. They are left in this state intentionally to demonstrate the current limits of autonomous AI coding before human intervention (Phase 2) begins._

---

This project is more than just a personal portfolio. It serves as a real-world case study and playground for exploring the limits of **Spec-Driven Development (SDD)** and full-scale **"Vibe Coding"** using autonomous AI agents.

The primary goal of this repository is to test how far a completely hands-off, AI-driven development process can be pushed before the models break down. The strict rule **during Phase 1**: The code should, as much as possible, never be touched by a human.

Instead of writing code, my role is restricted to that of a Software Architect:

1. Writing detailed specifications via a custom **OpenSpec workflow suite** (7 workflows: `propose`, `explore`, `apply`, `continue`, `verify`, `sync`, `archive`).
2. Injecting context using **Stitch MCP servers** and local visual mockups.
3. Defining strict, model-agnostic agent guidelines via a **modular Skills architecture** (`SKILLS_INDEX.md` → `project-bridge.md`, `creative-design/`, `development/`, `web-development/`).
4. Enforcing quality gates through a **3-stage CI pipeline** (Type Check → Biome → Unit Tests → E2E → Deploy), strict typing, and a custom **Anti-Evasion Script** (`check:avoidance`) that detects `biome-ignore`, `@ts-ignore`, `.skip()`, and other bypass patterns in the codebase.

### 🛠️ The Tech & AI Stack

- **Core:** Vue 3 (Composition API), TypeScript, Pinia.
- **Styling:** Tailwind CSS v4 (layout only) + Strict Native CSS Variables (theming/colors).
- **WebGL/3D:** TresJS, Three.js, custom GLSL Shaders.
- **Testing:** Vitest (unit), Playwright (E2E).
- **CI/CD:** GitHub Actions → GitHub Pages (auto-deploy on `main`).
- **AI Agents (Antigravity IDE):** Gemini 3.1 Pro, Claude 4.6 Opus, Gemini 3 Flash.
- **AI Agents (Async):** Google Jules (autonomous background agent for GitHub issue resolution, fix recommendations, and scheduled tasks).

---

## 🛑 Current Observations & Learnings

While the theory of SDD sounds flawless, the reality of relying on current top-tier AI models reveals fascinating bottlenecks. I am currently documenting these issues as part of the experiment:

### 1. Context Degradation & Token Limits

The development is severely hampered by context limitations. As the project grows, the reasoning capabilities of models like Gemini 3.1 Pro and Claude Opus degrade. The AI begins to hallucinate CSS, lose the reference between components (like disconnecting the volumetric flashlight from the spotlight mask), and ignores architectural rules.

### 2. The Illusion of Autonomous UI Debugging

A major realization: **isolating complex architectural or visual bugs is still actual work.** When the AI fails at a layout or WebGL positioning issue, the human architect must find the exact file and line causing the issue. Once the error is isolated that specifically, spending tokens on an AI "Explore/Apply" cycle becomes redundant—a human could fix it faster manually.

### 3. Inconsistent Skill Adherence

Despite a modular knowledge base and strict rules in the `project-bridge.md`, agent adherence remains poor without constant micro-prompting.
_Example:_ The AI was strictly instructed to use CSS variables for colors and shadows. Yet, files like `ProjectsSection.vue` are filled with hallucinated, hardcoded Tailwind utilities (e.g., `text-white/30`), treating strict guidelines more like loose suggestions.

### 4. The Translation Gap: DOM Limits vs. WebGL

Translating visual mockups into functional UI revealed severe limitations when relying purely on the DOM.

- **Generic Clichés:** The AI often defaults to generic "Mac-style" UI patterns instead of the intended technical wireframe aesthetic.
- **Performance Blindness:** The AI implemented lighting effects using heavy native CSS filters (like `blur(50px)`), causing severe GPU load and layout thrashing (~15-20 FPS).
- **The Solution:** Pivoting to **TresJS/WebGL** proved that complex lighting effects are far more stable when handled on the GPU. Transitioning to a custom shader-based architecture allowed for mathematical precision and a locked 60-144 FPS framerate.

### 5. Quality Gate Evasion & The "Jules" Effect

Even with strict automated workflows explicitly commanding the AI to run tests, the models actively try to bypass these checks as context degrades (e.g., hallucinating successful test runs or suppressing errors with `// biome-ignore`).

- **The Fix:** We implemented a two-pronged defense. First, a custom **Anti-Evasion Script** (`npm run check:avoidance`) acts as a hard quality gate, actively scanning and blocking commits that contain unauthorized `@ts-ignore` or `biome-ignore` bypasses. Second, because creative UI generation still leaves "dirty" or dead code, introducing a secondary, asynchronous agent (Google Jules) for **proactive cleanup cycles** proved essential. Jules retroactively implements missing tests and fixes logical errors, saving the architecture from context-induced decay.

---

## 🔮 Next Steps (Phase 2)

As this ongoing experiment transitions into its second phase, the current findings clearly indicate that "Vibe Coding" alone is currently insufficient for high-fidelity UI. Our strategy is pivoting accordingly:

1. **Context & Workflow Hardening:** The current OpenSpec workflows fail because the context window becomes too noisy. The next step is experimenting with harder context-isolation to force the models to respect Biome, Vitest, and Playwright pipelines without hallucinating bypasses.
2. **Refinement & Polish:** Finalizing the "Awwwards" grade WebGL shaders (Cyber-Optic HUD Scanner, Volumetric Beams) and completely removing leftover DOM-lighting artifacts.
3. **Lighthouse Validation:** Confirming the 100/100 performance score enabled by offloading filters to the GPU.
4. **The Human Takeover:** Since a fully autonomous "self-healing" loop remains a myth for complex UI/UX architectures at this stage, I am stepping back in as a developer. My focus will be to clean up the architectural damage, properly enforce the testing suites, and implement the actual design specs to bring this portfolio to completion.

**Interim Conclusion:** AI is a highly capable assistant, but not a replacement for a Senior Architect. "Vibe Coding" provides a fast start, but a human must still hold the wheel to ensure the project doesn't collapse under its own weight and bypass its own security gates.

---

## 🚀 Running the Project Locally

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run full Quality Gate suite (mirrors CI pipeline)
npx vue-tsc --noEmit        # Type checking
npm run lint                 # Biome linting
npm run test:unit            # Vitest unit tests
npm run test:e2e             # Playwright E2E tests
npm run check:avoidance      # Anti-evasion pattern detection

# Production build
npm run build
```

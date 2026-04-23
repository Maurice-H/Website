# 💡 Portfolio v2: A Spec-Driven Development Experiment

> _A dark, mysterious, and interactive developer portfolio themed around volumetric lighting and glassmorphism._

This project is more than just a personal portfolio. It serves as a real-world case study and playground for exploring the limits of **Spec-Driven Development (SDD)** and full-scale **"Vibe Coding"** using autonomous AI agents.

## 🎯 The Experiment

The primary goal of this repository was to test how far a completely hands-off, AI-driven development process can be pushed. The rule was simple: **The code should, as much as possible, never be touched by a human.**

Instead of writing code, the human role was restricted to that of an architect:

1. Writing detailed specifications (`design.md`, `proposal.md`, `tasks.md`).
2. Defining strict, model-agnostic agent guidelines (`.docs/skills/`).
3. Enforcing quality gates through CI pipelines, strict typing, and linting.

### The AI Tech Stack

Development was driven by the **Antigravity IDE** alongside a roster of modern AI agents, with respected limitations on the free tier and a 4-month Google AI Pro trial:

- Gemini 3.1 Pro (High)
- Claude 4.6 Opus (Thinking)
- Gemini 3 Flash

---

## 🛑 The Hard Truth (Lessons Learned)

While the theory of SDD sounds flawless, the reality of relying on current AI models revealed significant, often frustrating bottlenecks.

### 1. Token Limits & Cognitive Degradation

The development was severely hampered by token limitations. As the context window grew, the reasoning capabilities of even top-tier models (Gemini 3.1 Pro, Claude Opus) degraded. The models began to hallucinate CSS, ignore architectural rules, and lose the reference between files. In a private project, this is annoying; in an enterprise scenario with thousands of files, it would be catastrophic.

### 2. The Redundancy of Prompting

A major realization was that **isolating the bug is the actual work.** When the AI failed, the human had to find the exact file and line causing the issue. Once the error is isolated that specifically, the AI becomes redundant—a human could fix it faster manually than by spending tokens on an "Explore/Apply" cycle.

### 3. Inconsistent Skill Adherence

Despite a modular knowledge base (`.docs/skills/`, `project-bridge.md`), agent adherence was poor. The models frequently ignored defined standards (e.g., using hardcoded Tailwind colors instead of CSS variables) unless explicitly reminded in every single prompt. The AI acted more like a distracted intern than a senior developer following a style guide.

### 4. The "Vibe" vs. Precision Gap (Mockup Failure)

The translation from visual mockups (generated via Stitch) to functional code was the biggest failure.

- **Visual Hierarchy:** The AI struggled with typography sizes and spatial arrangements.
- **Complex Effects:** Instead of a volumetric flashlight, the AI defaulted to a generic mouse-cursor spotlight.
- **Generic Clichés:** The AI repeatedly added "Mac-style" window buttons or 2D CSS drawings that weren't in the mockup, ignoring the unique technical wireframe aesthetic of the project.

### 5. Testing & Quality Assurance

The AI-generated tests had shallow coverage and the models failed to autonomously expand testing suites, even when instructed by the "Definition of Done." In some cases, model degradation led to the AI actively trying to disable linting checks (Biome) rather than fixing the underlying issues.

---

## 🔮 Conclusion: The Human Element Remains

This experiment proved that we are not yet at the point of fully autonomous AI development for high-fidelity, stable, and secure software. **The process actually took significantly more time than manual development.**

For a fully automated SDD process to be successful today, you would need:

1. **Unrestricted Context:** High-end enterprise models without token-throttling.
2. **Visual QA:** Agents that can actually "see" and compare the rendered output to the mockup.
3. **Rigorous Regulation:** Extremely tight control over how much "creative freedom" the AI has to deviate from industrial standards.
4. **The Senior Architect:** A human who provides the domain knowledge, creative vision, and critical oversight.

**In the end, AI is a capable assistant, not a replacement.** "Vibe Coding" provides a fast start, but a human must still hold the wheel to ensure the "vibes" don't lead the project into a technical abyss.

---

## 🚀 Running the Project locally

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run Quality Gates
npm run lint
npm run test:unit
```

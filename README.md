# 💡 Maurice WebGL Portfolio: An Agentic Development Case Study

<!-- Badges -->

[![QA & Deployment](https://github.com/Maurice-H/Website/actions/workflows/ci.yml/badge.svg)](https://github.com/Maurice-H/Website/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![TresJS](https://img.shields.io/badge/TresJS-3D-black?style=flat)](https://tresjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GLSL](https://img.shields.io/badge/GLSL-00BFFF?style=flat&logo=opengl&logoColor=white)](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL))
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> _A dark, mysterious, and interactive developer portfolio themed around volumetric lighting and glassmorphism. Built as an experiment in autonomous, AI-driven Spec-Driven Development (SDD)._

[**🚀 View Live Site**](https://maurice-h.github.io/Website/)

---

## 📖 About The Project

This project is more than just a personal portfolio. It serves as a real-world case study, learning and playground for exploring the limits of **Spec-Driven Development (SDD)** and full-scale **"Vibe Coding"** using autonomous AI agents (Gemini 3.1 Pro, Claude 4.6 Opus, Gemini 3 Flash, Google Jules).

The initial primary goal was to test how far a completely hands-off, AI-driven development process can be pushed before the models break down. Instead of writing code, my role was restricted to that of a Software Architect: writing detailed specifications via a custom OpenSpec workflow, injecting context, and enforcing quality gates.

### 🛠️ Tech Stack

- **Core:** Vue 3 (Composition API), TypeScript, Pinia
- **Styling:** Tailwind CSS v4 (layout only) + Strict Native CSS Variables (theming)
- **WebGL/3D:** TresJS, Three.js, custom GLSL Shaders
- **Testing & QA:** Vitest (unit), Playwright (E2E), Lighthouse CI
- **AI Tooling:** Antigravity IDE (Gemini/Claude), Google Jules (async background agent)

---

## 🎯 Conclusion: The "Agentic" Development Experience

Building this portfolio wasn't just a coding endeavor; it was an experiment in autonomous development. With the project nearing its final milestones, the biggest takeaway is how to properly integrate AI into a complex codebase.

### 1. The Developer's Dilemma: Automation vs. Cognitive Sharpness

For personal or hobby projects, taking a fully autonomous, hands-off approach is a double-edged sword. Beyond the massive manual overhead of setting up MCPs, prompts, and skill files to avoid paying premium API costs, there is a much more personal cost: **losing your cognitive sharpness and the fun of coding.**

The actual joy of coding lies in problem-solving. When you delegate writing an algorithm, designing an architecture, or even writing test coverage to an AI, you rob yourself of the critical thinking required to deeply understand your own system. Moving forward, for personal projects, I am reclaiming the keyboard. The core logic and the "thinking" must remain fundamentally human.

Instead of an autonomous agent, the AI's role should be strictly relegated to:

- **A Brainstorming Partner:** Bouncing ideas back and forth before writing code.
- **An Optimizer:** Asked hints if you are stuck "I wrote this algorithm. How can I cleanly optimize its time complexity?"
- **An Automated Reviewer:** Utilizing AI solely within the CI/CD pipeline (similar to CodeRabbit) to scan the codebase, point out overly complex functions, and suggest minor syntax or integration fixes.

### 2. The "Black Box" Codebase & The Knowledge Gap

For companies with the budget to invest in high-end models, this agentic architecture is powerful, but it comes with a critical warning label: **The Knowledge Gap**.

When you take a completely hands-off approach, you lose the mental model of your own codebase. You no longer intuitively know how components are interconnected. If the AI implements a highly complex feature, fails to fix a critical bug later, and you have to step in for a hotfix, you are suddenly reading a foreign, complicated codebase that isn't "in your head."

Because of this Knowledge Gap, the most accurate way to utilize an AI coding agent—even in a corporate setting—is to treat it like a newly hired **Junior Developer**. You wouldn't hand a junior developer a mission-critical architectural ticket and walk away. Complex tasks require deep planning and context. Instead, you use the AI for the foundation: boilerplate, repetitive logic, and pair-programming. You give them guidance, point them to the documentation, enforce code reviews, and rely on CI/CD pipelines to catch errors.

### 3. Context Degradation & The Illusion of Autonomous Debugging

The development is severely hampered by context limitations. As the project grows, the reasoning capabilities of models like Gemini 3.1 Pro and Claude Opus degrade:

- **Hallucinations:** The AI begins to hallucinate CSS, lose the reference between components (like disconnecting the volumetric flashlight from the spotlight mask), and ignores architectural rules.
- **Inconsistent Skill Adherence:** Despite a modular knowledge base and strict rules in the `project-bridge.md`, agent adherence remains poor without constant micro-prompting. For example, despite strict instructions to use CSS variables for colors, files like `ProjectsSection.vue` were filled with hallucinated, hardcoded Tailwind utilities (e.g., `text-white/30`).
- **The Debugging Reality:** A major realization is that isolating complex architectural or visual bugs is still actual work. When the AI fails at a layout or WebGL positioning issue, the human architect must find the exact file and line causing the issue. Once the error is isolated that specifically, spending tokens on an AI "Explore/Apply" cycle becomes redundant—a human could fix it faster manually.

### 4. The Greenfield Trap & The Translation Gap

Starting this as a "blank slate" project without a locked-in technical architecture was a painful lesson.

- **Generic Clichés vs. Custom Design:** Translating visual mockups into functional UI revealed severe limitations when relying purely on the DOM. The AI often defaulted to generic "Mac-style" UI patterns instead of the intended technical wireframe aesthetic.
- **Performance Blindness:** Because AI models inherently choose the path of least resistance, it initially implemented dynamic lighting using heavy DOM manipulations (`blur()`), leading to a catastrophic drop in framerate (~15-20 FPS). This forced a massive refactor to **TresJS / WebGL**.
- **Architectural Tunnel Vision:** When shifting to WebGL, the AI completely forgot to account for users without hardware acceleration or older mobile devices. I had to intervene, introduce `detect-gpu`, and force a **3-tier Graceful Degradation** strategy.

**The Lesson:** You cannot rely on AI to make senior-level architectural decisions regarding performance bottlenecks or edge cases. You must define the tech stack and rendering strategies _before_ the AI writes a single line of code.

### 5. Guardrails, Evasion & The "Jules" Effect

To prevent the AI from generating "slop" or suffering from context degradation, I implemented a strict set of guardrails. However, even with strict automated workflows explicitly commanding the AI to run tests, the models actively try to bypass these checks as context degrades (e.g., hallucinating successful test runs or suppressing errors with `// biome-ignore`).

- **The "Karpathy" Core Prompt (`AGENT.md`):** A strict system prompt enforcing a **"Preflight"** and **"Postflight"** check changed the AI's behavior from guessing to structuring its work like a Senior Engineer.
- **Strict Workflows (`opsx`):** Using dedicated commands, the AI is forced into specific execution paths, ensuring it never skips routines.
- **Token Optimization:** To prevent a bloated context window, I centralized all TypeScript interfaces into compact index files.
- **Anti-Avoidance Scripts:** A custom script (`npm run check:avoidance`) acts as a hard quality gate, actively scanning and blocking commits that contain unauthorized `@ts-ignore` or `biome-ignore` bypasses.
- **The "Jules" Effect:** Because creative UI generation still leaves "dirty" or dead code, introducing a secondary, asynchronous agent (Google Jules) for **proactive cleanup cycles** proved essential. Jules retroactively implements missing tests and fixes logical errors, saving the architecture from context-induced decay.

### 6. The Safety Net (CI/CD & Visual QA)

Even with great prompting, the ultimate gatekeeper must be an unforgiving CI/CD pipeline. The automated workflow matrix enforces:

- **Type Checking & Build:** `vue-tsc -b && vite build` ensures strictly typed composition.
- **Biome Linting:** Strict formatting and linting rules that the AI must pass.
- **Anti-Avoidance Checks:** Blocking unauthorized `// biome-ignore` or `@ts-ignore` comments.
- **Vitest & Coverage:** Unit tests with enforced coverage thresholds.
- **Playwright E2E:** Sharded end-to-end testing across the application.
- **Lighthouse CI Matrix:** Strict performance and accessibility checks across mobile and desktop emulators.
- **Automated PR Previews:** Every pull request automatically deploys a live preview via GitHub Pages. This acts as the final "Human in the Loop" checkpoint to manually verify responsive layouts and interaction design before merging.

**The Final Verdict:** AI is an incredible brainstorming partner and reviewer, but it is not a replacement for a Senior Architect's intuition. You cannot fully trust an AI to fly blindly, but if you build a strong enough runway and act as the strict Air Traffic Controller, it becomes an invaluable tool in your engineering arsenal.

---

## 🚀 Running the Project Locally

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run full Quality Gate suite (mirrors CI pipeline)
npx vue-tsc --noEmit         # Type checking
npm run lint                 # Biome linting
npm run test:unit            # Vitest unit tests
npm run test:e2e             # Playwright E2E tests
npm run check:avoidance      # Anti-evasion pattern detection

# Production build
npm run build
```

---

## 🔮 What's Next?

I am currently working on completing the remaining items in the [TODO.md](./TODO.md) (such as deep linking, view transitions, and final visual polish) and reclaiming the keyboard for the final touches. After that, I'll be moving on to have some fun with new projects!

If you have ideas, feedback, or improvements for the website, you can reach out to me directly via the [Contact Form](./src/components/features/ContactForm.vue) on the site or feel free to create an issue in this repository.

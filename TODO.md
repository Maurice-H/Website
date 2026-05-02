# 📋 Project Roadmap & TODOs

## 🏠 Landing Page (UFO Phase)

### 1. Tabs & Navigation

- [ ] Improve Navigation tabs content (NavConveyor labels)
- [ ] Make Navigation of tabs snap to center of UFO/Beam
- [ ] Ensure navigation from tabs (e.g., "Experience", "Get in Touch") scrolls directly down to the respective Bento card.
- [ ] Include keyboard navigation (WASD and arrow keys to move, ESC to go back)

### 2. WebGL Lighting (GPU Accelerated)

- [x] **Pivot:** Move lighting from CSS Filters to TresJS/WebGL for 60+ FPS.
- [x] **Asset Update:** Procedural UFO/Drone geometry implemented (zero-latency loading).
- [x] **Tractor Beam:** Project 3D UFO position to 2D Screen Space for pixel-perfect shader tracking.

### 3. Ideas

- [ ] Add subtle "abduction" particle effect when switching to CONTENT phase.

---

## 📄 Subpages (Cockpit / Drone Phase)

### 1. Visuals

- [x] Fix layout interaction buttons (theme toggle and navigation)
- [x] Fix outlines of bentoCards to have the depth outlines on the bottom and left instead of top and right
- [x] Remove white outline of project cards
- [x] Remove scrollbar (custom themed scrollbar or hidden)
- [x] Refined Contact Form button into a high-contrast Sci-Fi Ghost Button.

### 2. Lighting (Cockpit Mode)

- [x] **Companion Drone:** Autopilot "Acht-Figur" animation during Content phase.
- [x] **HUD Scanner:** Micro-optic cursor effect following the drone/mouse.
- [x] **State Sync:** Centralized lighting store syncing `uPhase` and `uAccentColor` across all components.

### 3. Projects Section

- [ ] Consider fetching projects dynamically from GitHub instead of hardcoding them.

---

## 🌍 Global

### 1. Theming

- [x] Fix theming not being applied correctly and consistently.
- [x] Ensure Blue and Green theming is constantly applied everywhere (WebGL Uniform Sync).

### 2. Code Quality (The "Jules" Standard)

- [x] Fix biome issues
- [x] **Test Coverage:** Added unit tests for WebGL projection math and Lighting Store.
- [x] **SEO Fix:** Add a `<meta name="description" content="...">` tag to `index.html`.
- [x] Anti-Evasion: Implemented check:avoidance script to block AI bypasses.

### 3. Performance & Stability

- [x] **GPU Load:** Swapped heavy CSS `blur(50px)` for WebGL Shaders — Performance stabilized at 60+ FPS.
- [ ] **Production Check:** Run a final Lighthouse audit against built production files.

### 4. Extra Features & QoL

- [ ] **Page Transitions:** Add smooth page transitions (View Transitions API).
- [x] **Custom Cursor:** WebGL-based HUD scanner active in CONTENT phase.
- [ ] **Subtle Sound Effects:** Satisfaction clicks for theme toggle and phase shifts.
      ver buttons.
- [x] Custom Cursor: WebGL-based HUD scanner active in CONTENT phase (system cursor hidden dynamically).

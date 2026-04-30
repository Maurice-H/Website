# 📋 Project Roadmap & TODOs

## 🏠 Landing Page

### 1. Tabs & Navigation

- [ ] Improve Navigation tabs content
- [ ] Make Navigation of tabs snap to center of lamp
- [ ] Make tabs more interactive and navigate to the right pages
- [ ] Ensure navigation from tabs (e.g., "Experience", "Get in Touch") scrolls directly down to the respective Bento card or page section.
- [ ] Include keyboard navigation (WASD and arrow keys to move, ESC to go back)

### 2. Lighting

- [ ] Make Landing Page lighting more realistic
- [ ] **Asset Update:** Replace the `src/assets/hero.png` placeholder with a real 3D render/image of the lamp model to anchor the light source.

### 3. Ideas

- [ ] Try out a Parallax effect on some elements (?)

---

## 📄 Subpages

### 1. Visuals

- [ ] Fix layout interaction buttons (theme toggle and navigation)
- [ ] Fix outlines of bentoCards to have the depth outlines on the bottom and left instead of top and right
- [ ] Remove white outline of project cards
- [ ] Remove scrollbar

### 2. Lighting

- [ ] Think of a new way to incorporate the flashlight mechanic (make flashlight moveable or reposition) (improves lighting and UX)
- [ ] Fix light position of flashlight being outside the beam on the top
- [ ] **State Sync:** Centralize the tracking logic so `VolumetricBeam` and `SpotlightMask` are perfectly synchronized (prevents the beam from visually disconnecting from the illuminated "hole").

### 3. Projects Section

- [ ] Consider fetching projects dynamically from GitHub instead of hardcoding them.
- [ ] Automatically display Title, Name, Description, and analyze/display the applied technologies for each repository.

### 4. Get in Touch Section

- [ ] Add multiple contact methods (e.g., classic email via form/mailto).
- [ ] Include links to external profiles (Discord, LinkedIn, Xing).

---

## 🌍 Global

### 1. Theming

- [ ] Fix theming not being applied correctly and consistently. _(Ensure strict use of CSS variables over hardcoded Tailwind classes)._
- [ ] Ensure Blue and Green theming is constantly applied everywhere (currently resets when toggling or pressing Escape).

### 2. Code Quality & SEO

- [ ] Fix biome issues
- [ ] Check coverage of tests and checks
- [ ] **SEO Fix:** Add a `<meta name="description" content="...">` tag to `index.html`.
- [ ] **SEO Fix:** Add a basic `robots.txt` to the `public/` folder to resolve crawler warnings.

### 3. Performance (Rendering)

- [ ] **GPU Load:** Evaluate CSS Filter Performance. Consider swapping extremely heavy `blur(50px)` filters for native CSS `radial-gradient` or optimizing the `<SpotlightMask>` to improve render times on weaker devices.
- [ ] **Production Check:** Run a final Lighthouse audit against the built production files (`npm run build` & `npm run preview`) to confirm 100/100 performance without Vite dev-server overhead.

### 4. Responsiveness

- [ ] Fix fixed values for large screens (e.g., 4K monitors/HDR) so that elements like light rays extend far enough.
- [ ] Implement responsive alternatives and layouts for mobile devices.

### 5. Content & Data

- [ ] Update icons and HTML naming (e.g., `<title>`).
- [ ] Update placeholder texts and data globally (e.g., change "Hi I'm Alex" to "Hi I'm Maurice" and similar content).

### 6. Extra Features & Quality of Life (QoL)

- [ ] **Page Transitions:** Add smooth page transitions (e.g., View Transitions API or Framer Motion) when navigating between the landing page and subpages.
- [ ] **Loading States & Skeletons:** Add a stylized initial loader (e.g., a lamp turning on) for 3D assets and skeleton loaders for the GitHub projects.
- [ ] **Custom Cursor:** Enhance the flashlight mechanic by making it follow the cursor with a smooth trailing spring effect, hiding the default cursor.
- [ ] **Scroll Progress Indicator:** Add a subtle scroll progress bar (like a glowing line) at the top of the screen or along the side.
- [ ] **Smart Contact Actions:** For the "Get in Touch" buttons, either directly open the profile link in a new tab (LinkedIn, Xing) or copy the username/address to the clipboard with a nice success toast (Discord, Email).
- [ ] **Back to Top Button:** A floating action button that appears after scrolling down, styled consistently with the theme.
- [ ] **Bento Card Hover Effects:** Add a subtle 3D tilt or glare effect on the Bento cards when hovering over them to make them feel more tactile.
- [ ] **Subtle Sound Effects (Optional):** Add very quiet, satisfying UI sounds for actions like toggling the theme (light switch click) or hovering over buttons.

Order to do the Core changes with /opsx-apply:

1. [x] theming-responsiveness
2. [ ] core-navigation-layout
3. [ ] lighting-mechanics
4. [ ] dynamic-content-integration
5. [ ] performance-seo

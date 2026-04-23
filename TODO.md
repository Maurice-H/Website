# 📋 Project Roadmap & TODOs

## 🏠 Landing Page

### 1. Tabs & Navigation

- [ ] Improve Navigation tabs content
- [ ] Make Navigation of tabs snap to center of lamp
- [ ] Make tabs more interactive and navigate to the right pages
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

---

## 🌍 Global

### 1. Theming

- [ ] Fix theming not being applied correctly and consistently. _(Ensure strict use of CSS variables over hardcoded Tailwind classes)._

### 2. Code Quality & SEO

- [ ] Fix biome issues
- [ ] Check coverage of tests and checks
- [ ] **SEO Fix:** Add a `<meta name="description" content="...">` tag to `index.html`.
- [ ] **SEO Fix:** Add a basic `robots.txt` to the `public/` folder to resolve crawler warnings.

### 3. Performance (Rendering)

- [ ] **GPU Load:** Evaluate CSS Filter Performance. Consider swapping extremely heavy `blur(50px)` filters for native CSS `radial-gradient` or optimizing the `<SpotlightMask>` to improve render times on weaker devices.
- [ ] **Production Check:** Run a final Lighthouse audit against the built production files (`npm run build` & `npm run preview`) to confirm 100/100 performance without Vite dev-server overhead.

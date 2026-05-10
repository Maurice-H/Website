# 🚀 Project Roadmap: Maurice WebGL Portfolio

## 📱 Milestone 1: Mobile Fine-tuning & UX (Current Priority)
*Fokus: Stabilität und visuelle Korrektheit auf mobilen Endgeräten.*

- [x] **Mobile Layout Fixes:** Überprüfung von Paddings, Z-Indizes und Breakpoints im Bento-Grid.
- [x] **Touch Cursor Tracking:** WebGL-Projektion für Touch-Events optimieren (Hover-Ersatz).
- [x] **Mobile Immersion:** Sicherstellen, dass das "Fused"-Gefühl auch auf kleinen Screens erhalten bleibt.

## 🕹️ Milestone 2: Navigation Intelligence & Contact
*Fokus: Ein immersives Steuerungs-Gefühl, nahtlose Übergänge und echte Kommunikation.*

- [x] **Navigation Snapping:** Karten im `NavConveyor` exakt im Zentrum des UFO-Beams einrasten lassen.
- [x] **Keyboard Navigation:** Pfeiltasten zur Steuerung, ESC zum Zurückkehren (WASD dropped).
- [x] **Deep Linking:** Navigation von Tabs (z.B. "Experience") direkt zu den Bento-Sektionen scrollen lassen.
- [x] **View Transitions API:** Prüfung und ggf. Implementierung weicher Phasen-Übergänge.
- [x] **Nav Labels:** Content der Navigation-Tabs im `NavConveyor` verbessern.
- [x] **Back-to-Top Button:** Floating-Button zum Zurückscrollen in der CONTENT-Phase.
- [x] **Contact Social Channels:** Sub-Tabs im ContactForm für Discord, Xing und LinkedIn.
- [x] **Contact Email Backend:** Echte E-Mail-Übermittlung mit Validierung und Anti-Spam.

## 🔊 Milestone 3: Audio-Visuelle Immersion
*Fokus: Satisfaction und High-Fidelity Assets.*

- [x] **Asset Upgrade:** Suche und Integration coolerer 3D-Modelle für das UFO und die Drohne.
- [x] **Subtle Sound Effects:** Satisfaction-Clicks für Theme-Toggle, Hover und Phasen-Wechsel.
- [x] **Particle Effects:** Dezenter "Abduction"-Effekt beim Wechsel in die CONTENT-Phase.

## 📊 Milestone 4: Data & Final Polish
*Fokus: Dynamische Inhalte und Performance-Tuning.*

- [ ] **Update existing Data:** Update project data of personal infos.
- [ ] **Dynamic Projects:** Projekte via GitHub API laden statt Hardcoding.
- [x] **LHCI Optimization:** Reduzierung auf 1-Run-Tests und Überspringen redundanter Tiers in der CI (Build-Zeit-Optimierung).

---

## ✅ Completed / History

### 🏰 Architecture & State
- [x] **Lighting Store:** Zentrales State Management für `uPhase` und `uAccentColor`.
- [x] **Viewport Store:** Globaler Service für responsive Breakpoints ohne redundante Listener.
- [x] **Performance Store:** Hardware-Benchmarking via `detect-gpu` für Tiered Rendering.
- [x] **State Sync:** Konsistente Anwendung von Blue/Green Themes über WebGL Uniforms.

### 🛸 WebGL & Rendering
- [x] **Engine Pivot:** Migration von CSS-Filtern zu TresJS/WebGL (Performance-Boost auf 60+ FPS).
- [x] **UFO & Drone:** Prozedurale Geometrie und "Acht-Figur" Animationen implementiert.
- [x] **Tractor Beam:** 3D-zu-2D Projektion für pixelperfektes Shader-Tracking.
- [x] **Custom Cursor:** WebGL-basierter HUD-Scanner in der CONTENT-Phase.
- [x] **Resilience:** Sauberes WebGL-Fallback für Low-End Geräte ohne Hardwarebeschleunigung.

### 🖼️ UI & Interactions
- [x] **Bento-Grid:** Refined Bento-Layout mit korrigierten Tiefen-Outlines.
- [x] **Nav-Conveyor:** Refactoring auf reine Mathematik (Scroll-Performance).
- [x] **Ghost Buttons:** High-Contrast Sci-Fi Styling für Interaktionselemente.
- [x] **Scrollbar:** Custom-Themed oder Hidden Scrollbar für immersiven Look.

### 🛡️ Quality & Ops
- [x] **Anti-Evasion:** `check:avoidance` Skript gegen AI-Bypasses.
- [x] **Test Coverage:** Unit-Tests für WebGL-Projektion und Lighting-Store.
- [x] **SEO:** Meta-Tags und Lighthouse-Optimierung (>95 Scores).
- [x] **CI Strategy:** Mobile (Strict) vs. Desktop (Advisory) Checks etabliert.
- [x] **Biome:** Alle Linting- und Formatting-Issues behoben.

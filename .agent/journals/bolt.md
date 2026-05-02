## 2024-05-02 - Layout Thrashing in CSS Animations
 **Learning:** Animating `color`, `text-shadow`, `border-color`, and `box-shadow` properties on Vue components triggers `non-composited-animations` warnings and causes severe layout thrashing on the main thread.
 **Action:** Refactored CSS to use hardware-accelerated properties. Instead of animating the complex properties directly, create overlapping pseudo-elements (or extra wrapper elements) that hold the final styled state, and animate their `opacity` from 0 to 1 during state transitions.

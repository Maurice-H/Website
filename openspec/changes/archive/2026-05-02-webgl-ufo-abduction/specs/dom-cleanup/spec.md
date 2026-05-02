## ADDED Requirements

### Requirement: DOM Isolation for Navigation
The `NavConveyor.vue` component must only render the scrolling track and its window components. It must not contain any HTML elements or CSS classes related to the industrial lamp lighting effect.

#### Scenario: Inspecting NavConveyor DOM
- **WHEN** the user inspects the DOM for `NavConveyor.vue`
- **THEN** no elements with classes `.lamp-fixture`, `.lamp-wire`, `.lamp-head`, `.lamp-dome`, `.lamp-rim`, or `.lamp-bulb` should exist.

### Requirement: Zero Layout Thrashing from Lighting
The lighting mechanics must not trigger browser layout recalculations or paints related to CSS gradients, masks, or DOM filters during normal operation.

#### Scenario: Running Performance Profiler
- **WHEN** the user interacts with the application and scrolls the NavConveyor
- **THEN** the browser performance profiler should show no layout thrashing or style recalculations caused by lighting elements.

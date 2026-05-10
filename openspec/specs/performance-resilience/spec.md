# Performance Resilience

## Purpose
This capability defines the rules for tier-based resource allocation and ensuring that the application remains functional and performant even on low-end devices or during slow system initialization.

## Requirements

### Requirement: Tier-Based Component Mounting
The system SHALL only mount and initialize heavy components (e.g., WebGL backgrounds) if the determined performance tier supports them.

#### Scenario: Low-End Hardware
- **WHEN** the system identifies the device as Tier 1
- **THEN** it SHALL prevent the mounting of the `WebGLBackground` component.
- **AND** it SHALL instead render the `ResilienceLayer` for fallback visual effects.

### Requirement: Non-Blocking Initialization
The system initialization (e.g., GPU benchmarking, state hydration) SHALL NOT block the rendering of the core UI elements.

#### Scenario: Slow GPU Benchmark
- **WHEN** the `detect-gpu` process takes more than 500ms
- **THEN** the main content and text elements MUST still be visible to the user.
- **AND** the LCP metric SHOULD NOT be delayed by more than 100ms beyond the initial script execution.

### Requirement: performance-switching
The application shall dynamically choose the rendering engine at runtime based on the detected GPU tier.

#### Scenario: Tier 1 Detection
- **WHEN** `gpuTier` is 1 or `isWebGLSupported` is false.
- **THEN** the `WebGLBackground` component shall render `CSSBackground` instead of `TresCanvas`.

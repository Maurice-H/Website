## Why

The "Blueprint/Finished" toggle currently suffers from structural asymmetry between its two states. Specifically, the "Finished" layer includes a navigation header and flex spacing that are absent in the "Blueprint" layer. This results in a vertical offset (shift) between the illuminated content and the underlying technical drawing, which destroys the "physical discovery" illusion by making the two layers look misaligned.

## What Changes

- **Structural Mirroring**: Refactor the main content slots in `App.vue` to use identical wrapper components and spacing for both Blueprint and Finished layers.
- **Architectural Symmetry**: Implement a "Blueprint Header" placeholder that matches the dimensions and layout of the Navigation Header to ensure pixel-perfect vertical alignment.
- **Unified Flex Context**: Standardize the use of `flex flex-col gap-6` wrappers across both state-driven templates to prevent layout drift.
- **Non-Goals**: This change does not aim to add new content, only to re-align existing components.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `theme-engine`: Correctly align the multi-state layers to ensure 1:1 overlap during the spotlight reveal interaction.

## Impact

- **Affected Components**: `App.vue`, `BentoLayout.vue`.
- **UI Logic**: Masking coordinate logic becomes more accurate as the underlying element positions now match perfectly.

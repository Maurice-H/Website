const fs = require('fs');
let code = fs.readFileSync('src/components/layout/CSSBackground.vue', 'utf8');

// ufo
code = code.replace(
  '  perspective: 600px;\n}',
  '  perspective: 600px;\n  will-change: transform, opacity;\n}'
);

code = code.replace(
  '  animation: ufo-hover 3s ease-in-out infinite;\n}',
  '  animation: ufo-hover 3s ease-in-out infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: ufo-ring-pulse 2s ease-in-out infinite;\n}',
  '  animation: ufo-ring-pulse 2s ease-in-out infinite;\n  will-change: transform, opacity;\n}'
);

code = code.replace(
  '  animation: ufo-beam 3s ease-in-out infinite;\n}',
  '  animation: ufo-beam 3s ease-in-out infinite;\n  will-change: opacity;\n}'
);

// drone
code = code.replace(
  '  transition: opacity 0.8s ease;\n}',
  '  transition: opacity 0.8s ease;\n  will-change: opacity;\n}'
);

code = code.replace(
  '  animation: drone-move-x 29s ease-in-out infinite;\n}',
  '  animation: drone-move-x 29s ease-in-out infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-move-y 37s ease-in-out infinite;\n}',
  '  animation: drone-move-y 37s ease-in-out infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-scale-anim 19s ease-in-out infinite;\n}',
  '  animation: drone-scale-anim 19s ease-in-out infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-spin 43s ease-in-out infinite;\n}',
  '  animation: drone-spin 43s ease-in-out infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-hover 5s ease-in-out infinite alternate;\n}',
  '  animation: drone-hover 5s ease-in-out infinite alternate;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-core-glow 4s ease-in-out infinite alternate;\n}',
  '  animation: drone-core-glow 4s ease-in-out infinite alternate;\n  will-change: opacity;\n}'
);

code = code.replace(
  '  animation: drone-ring-spin 4s linear infinite;\n}',
  '  animation: drone-ring-spin 4s linear infinite;\n  will-change: transform;\n}'
);

code = code.replace(
  '  animation: drone-status-blink 1.5s ease-in-out infinite alternate;\n  z-index: 5;\n}',
  '  animation: drone-status-blink 1.5s ease-in-out infinite alternate;\n  z-index: 5;\n  will-change: opacity;\n}'
);

code = code.replace(
  '  pointer-events: none;\n  z-index: -1;\n}',
  '  pointer-events: none;\n  z-index: -1;\n  will-change: transform, opacity;\n}'
);

// particles
code = code.replace(
  '  animation: particle-float var(--p-duration) var(--p-delay) ease-in-out\n    infinite;\n}',
  '  animation: particle-float var(--p-duration) var(--p-delay) ease-in-out\n    infinite;\n  will-change: transform, opacity;\n}'
);

fs.writeFileSync('src/components/layout/CSSBackground.vue', code);

import { execSync } from 'node:child_process';

const FORBIDDEN_PATTERNS = [
  'biome-ignore',
  '@ts-ignore',
  '@ts-expect-error',
  '@ts-nocheck',
  '\\.skip\\(',
  '\\.only\\('
];

const patternString = FORBIDDEN_PATTERNS.join('|');

try {
  // We use git grep. If it finds something, it returns exit code 0.
  // If it finds nothing, it returns exit code 1.
  // We want to FAIL if it finds something.
  const result = execSync(`git grep -n -E "${patternString}" -- ":!package.json" ":!.agent/scripts/check-avoidance.js" ":!.agent/AGENT.md" ":!openspec/**" ":!README.md"`);
  
  const output = result.toString().trim();
  if (output) {
    console.error('\n❌ ERROR: Code avoidance comments or test skips found! ❌\n');
    console.error('Please fix the underlying issues instead of bypassing them.\n');
    console.error(output);
    console.error('\nFor more details on this policy, see .agent/AGENT.md');
    process.exit(1);
  }
} catch (error) {
  // git grep returns 1 when NO matches are found, which is what we want!
  if (error.status === 1) {
    console.log('✅ Strict checks passed: No avoidance keywords found.');
    process.exit(0);
  } else {
    // Some other error occurred
    console.error('An error occurred while running check:avoidance', error);
    process.exit(1);
  }
}

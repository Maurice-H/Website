import fs from 'node:fs';
import path from 'node:path';

/**
 * Playwright E2E Summary Generator
 * This script reads the Playwright JSON report and outputs a Markdown summary to GitHub Actions.
 */

const RESULTS_DIR = path.join(process.cwd(), 'test-results');
const resultsPath = path.join(RESULTS_DIR, 'results.json');

if (!fs.existsSync(resultsPath)) {
  console.log('Playwright results not found. Skipping summary.');
  process.exit(0);
}

try {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const { stats } = results;

  if (!stats) {
    console.log('No stats found in Playwright report.');
    process.exit(0);
  }

  const total = stats.expected + stats.unexpected + stats.skipped + stats.flaky;
  const passed = stats.expected + stats.flaky;
  const failed = stats.unexpected;
  const skipped = stats.skipped;

  let summaryMd = '## 🎭 Playwright E2E Test Report\n\n';
  summaryMd += '### Summary\n\n';

  const statusEmoji = failed === 0 ? '✅' : '❌';

  summaryMd += `- **Test Results**: ${statusEmoji} **${passed} passes** · ${total} total\n`;
  
  if (failed > 0) {
    summaryMd += `- **Failures**: ❌ **${failed} failed**\n`;
  }
  if (stats.flaky > 0) {
    summaryMd += `- **Flaky**: ⚠️ **${stats.flaky} flaky tests**\n`;
  }
  if (skipped > 0) {
    summaryMd += `- **Skipped**: ⏭️ **${skipped} skipped**\n`;
  }
  
  summaryMd += `- **Duration**: ${(stats.duration / 1000).toFixed(2)}s\n`;

  // Add detailed table if there are failures
  if (failed > 0 && results.suites) {
    summaryMd += '\n### ❌ Failed Tests\n\n';
    summaryMd += '| Test | Error |\n';
    summaryMd += '| :--- | :--- |\n';

    const findFailures = (suite) => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            if (test.status === 'unexpected') {
              const error = test.results[0]?.error?.message?.split('\n')[0] || 'Unknown error';
              summaryMd += `| ${spec.title} | ${error} |\n`;
            }
          });
        });
      }
      if (suite.suites) {
        suite.suites.forEach(findFailures);
      }
    };

    results.suites.forEach(findFailures);
  }

  // Write to GitHub Step Summary
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd);
    console.log('Playwright summary appended to GITHUB_STEP_SUMMARY');
  } else {
    console.log('--- Playwright Summary (Preview) ---');
    console.log(summaryMd);
  }
} catch (error) {
  console.error('Error generating Playwright summary:', error);
  process.exit(1);
}

import fs from 'node:fs';
import path from 'node:path';

/**
 * Lighthouse CI Summary Generator
 * This script reads the LHCI manifest and outputs a Markdown summary to GitHub Actions.
 */

const MANIFEST_DIR = path.join(process.cwd(), '.lighthouseci');
const manifestPath = path.join(MANIFEST_DIR, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`Lighthouse manifest not found at: ${manifestPath}`);
  process.exit(0); // Exit gracefully in case LHCI didn't run
}

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!Array.isArray(manifest) || manifest.length === 0) {
    console.log('Lighthouse manifest is empty.');
    process.exit(0);
  }

  let summaryMd = '## ⚡ Lighthouse Audit Report\n\n';
  summaryMd += '| URL | Performance | Accessibility | Best Practices | SEO | Report |\n';
  summaryMd += '| :--- | :---: | :---: | :---: | :---: | :---: |\n';

  manifest.forEach((run) => {
    const { url, summary, reportUrl } = run;
    
    // Helper to format scores with status emojis
    const formatScore = (val) => {
      if (val === undefined || val === null) return 'N/A';
      const s = Math.round(val * 100);
      if (s >= 90) return `✅ **${s}**`;
      if (s >= 50) return `⚠️ **${s}**`;
      return `❌ **${s}**`;
    };

    // Note: LHCI manifest summary keys can vary slightly; checking common variants
    const perf = summary.performance;
    const acc = summary.accessibility;
    const bp = summary['best-practices'] || summary.bestPractices;
    const seo = summary.seo;

    summaryMd += `| ${url} | ${formatScore(perf)} | ${formatScore(acc)} | ${formatScore(bp)} | ${formatScore(seo)} | [View Report](${reportUrl || '#'}) |\n`;
  });

  // Write to GitHub Step Summary if in CI environment, otherwise log to console
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd);
    console.log('Lighthouse summary appended to GITHUB_STEP_SUMMARY');
  } else {
    console.log('--- Lighthouse Summary (Preview) ---');
    console.log(summaryMd);
  }
} catch (error) {
  console.error('Error generating Lighthouse summary:', error);
  process.exit(1);
}

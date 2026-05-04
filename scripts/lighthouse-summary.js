import fs from 'node:fs';
import path from 'node:path';

/**
 * Lighthouse CI Summary Generator
 * This script reads the LHCI manifest and individual JSON reports to output 
 * a detailed Markdown summary to GitHub Actions.
 */

const MANIFEST_DIR = path.join(process.cwd(), '.lighthouseci');
const manifestPath = path.join(MANIFEST_DIR, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`Lighthouse manifest not found at: ${manifestPath}`);
  process.exit(0);
}

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!Array.isArray(manifest) || manifest.length === 0) {
    console.log('Lighthouse manifest is empty.');
    process.exit(0);
  }

  const title = process.env.LHCI_TITLE || 'Lighthouse Audit Report';
  let summaryMd = `## ⚡ ${title}\n\n`;

  
  // 1. Overview Table
  summaryMd += '### 📊 Overview\n\n';
  summaryMd += '| URL | Perf | Acc | BP | SEO | Report |\n';
  summaryMd += '| :--- | :---: | :---: | :---: | :---: | :---: |\n';

  // Filter for representative runs to avoid 9-row tables
  const representativeRuns = manifest.filter(run => run.isRepresentativeRun);
  
  representativeRuns.forEach((run) => {
    const { url, summary, reportUrl } = run;
    const perf = summary.performance;
    const acc = summary.accessibility;
    const bp = summary['best-practices'] || summary.bestPractices;
    const seo = summary.seo;

    // Custom threshold logic based on URL pattern (Tier 1 requires 95, others 85)
    const isTier1 = url.includes('forceTier=1');
    const threshold = isTier1 ? 95 : 85;
    
    const formatScoreWithThreshold = (val, t) => {
      if (val === undefined || val === null) return 'N/A';
      const s = Math.round(val * 100);
      if (s >= t) return `✅ **${s}**`;
      if (s >= 50) return `⚠️ **${s}**`;
      return `❌ **${s}**`;
    };

    summaryMd += `| ${url} | ${formatScoreWithThreshold(perf, threshold)} | ${formatScoreWithThreshold(acc, 95)} | ${formatScoreWithThreshold(bp, 95)} | ${formatScoreWithThreshold(seo, 95)} | [View](${reportUrl || '#'}) |\n`;
  });

  summaryMd += '\n---\n\n';

  // 2. Detailed Failures (from the representative run)
  const representativeRun = representativeRuns[0] || manifest[0];
  const jsonReportPath = path.resolve(path.dirname(manifestPath), representativeRun.jsonPath);

  if (fs.existsSync(jsonReportPath)) {
    const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
    const audits = report.audits;
    
    summaryMd += '### 🔍 Optimization Opportunities & Issues\n\n';
    summaryMd += 'Found several areas for improvement. Here are the most critical ones:\n\n';

    // Group audits by category (simplified logic)
    const categories = report.categories;
    const categoriesToReport = ['performance', 'accessibility', 'best-practices', 'seo'];

    categoriesToReport.forEach(catId => {
      const category = categories[catId];
      if (!category || category.score >= 0.95) return;

      summaryMd += `#### ${category.title} (${Math.round(category.score * 100)}%)\n\n`;
      
      const failedAudits = category.auditRefs
        .map(ref => audits[ref.id])
        .filter(audit => audit && audit.score !== null && audit.score < 0.9)
        .sort((a, b) => (a.score || 0) - (b.score || 0));

      if (failedAudits.length > 0) {
        failedAudits.slice(0, 5).forEach(audit => {
          const displayValue = audit.displayValue ? ` - \`${audit.displayValue}\`` : '';
          summaryMd += `- **${audit.title}**${displayValue}\n`;
          const desc = audit.description.split('[')[0].trim();
          summaryMd += `  > ${desc}\n`;
        });
      } else {
        summaryMd += `- All critical audits passed, but check the full report for minor improvements.\n`;
      }
      summaryMd += '\n';
    });
  } else {
    summaryMd += '⚠️ Detailed JSON report not found. Please check the full HTML report for optimization details.\n';
  }

  // Write to GitHub Step Summary
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

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

    // Custom threshold logic based on URL pattern and category
    const isTier1 = url.includes('forceTier=1');
    
    const formatScore = (val, isPerf = false, isSeo = false) => {
      if (val === undefined || val === null) return 'N/A';
      const s = Math.round(val * 100);
      const threshold = isSeo ? 90 : 95;
      
      if (s >= threshold) return `✅ **${s}**`;
      // Only Performance is allowed to warn (Yellow) on Tier 2/3. 
      // Others are always Error (Red) if below threshold.
      if (isPerf && !isTier1) return `⚠️ **${s}**`;
      return `❌ **${s}**`;
    };

    summaryMd += `| ${url} | ${formatScore(perf, true)} | ${formatScore(acc)} | ${formatScore(bp)} | ${formatScore(seo, false, true)} | [View](${reportUrl || '#'}) |\n`;
  });

  summaryMd += '\n---\n\n';

  // 2. Detailed Failures
  summaryMd += '### 🔍 Optimization Opportunities & Issues\n\n';
  
  let issuesFound = false;

  representativeRuns.forEach((run) => {
    const jsonReportPath = path.resolve(path.dirname(manifestPath), run.jsonPath);

    if (fs.existsSync(jsonReportPath)) {
      const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
      const categories = report.categories;
      const audits = report.audits;
      
      const categoriesToReport = ['performance', 'accessibility', 'best-practices', 'seo'];
      const failedCategories = categoriesToReport.filter(catId => {
        const threshold = catId === 'seo' ? 0.90 : 0.95;
        return categories[catId] && categories[catId].score < threshold;
      });

      if (failedCategories.length > 0) {
        issuesFound = true;
        const urlLabel = run.url.split('?')[1] || run.url;
        summaryMd += `<details>\n<summary><b>Details for ${urlLabel}</b></summary>\n\n`;

        failedCategories.forEach(catId => {
          const category = categories[catId];
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

        summaryMd += `</details>\n\n`;
      }
    }
  });

  if (!issuesFound) {
    summaryMd += '✨ All categories reached the 95% threshold! Great job.\n\n';
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

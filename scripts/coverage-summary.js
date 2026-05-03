import fs from 'node:fs';
import path from 'node:path';

/**
 * Vitest Coverage Summary Generator
 * Reads the json-summary from Vitest and outputs a Markdown summary.
 */

const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

if (!fs.existsSync(coveragePath)) {
  console.log('Coverage summary not found. Skipping coverage report.');
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const { total } = data;

  if (!total) {
    console.log('No total stats found in coverage summary.');
    process.exit(0);
  }

  let summaryMd = '## 🧪 Vitest Coverage Report\n\n';
  summaryMd += '| Category | Percentage | Covered / Total |\n';
  summaryMd += '| :--- | :---: | :--- |\n';

  const formatRow = (name, stats) => {
    const { total: t, covered: c, pct } = stats;
    let status = '❌';
    if (pct >= 80) status = '✅';
    else if (pct >= 50) status = '⚠️';
    
    return `| ${name} | ${status} **${pct}%** | ${c} / ${t} |\n`;
  };

  summaryMd += formatRow('Statements', total.statements);
  summaryMd += formatRow('Branches', total.branches);
  summaryMd += formatRow('Functions', total.functions);
  summaryMd += formatRow('Lines', total.lines);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd);
    console.log('Coverage summary appended to GITHUB_STEP_SUMMARY');
  } else {
    console.log('--- Coverage Summary (Preview) ---');
    console.log(summaryMd);
  }
} catch (error) {
  console.error('Error generating coverage summary:', error);
  process.exit(1);
}

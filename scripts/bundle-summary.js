import fs from 'node:fs';
import path from 'node:path';

/**
 * Build Bundle Summary Generator
 * Analyzes the dist directory and reports on asset sizes (raw, gzip, brotli).
 */

const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  console.log('Dist directory not found. Skipping bundle summary.');
  process.exit(0);
}

const getFiles = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

try {
  const allFiles = getFiles(distDir);
  const assets = allFiles.filter(f => f.match(/\.(js|css)$/));

  if (assets.length === 0) {
    console.log('No JS or CSS assets found in dist.');
    process.exit(0);
  }

  let summaryMd = '## 📦 Build Bundle Summary\n\n';
  summaryMd += '| Asset | Raw Size | Gzip | Brotli |\n';
  summaryMd += '| :--- | :---: | :---: | :---: |\n';

  let totalRaw = 0;
  let totalBr = 0;

  // Sort assets by size (largest first)
  const sortedAssets = assets.map(f => ({
    path: f,
    size: fs.statSync(f).size
  })).sort((a, b) => b.size - a.size);

  sortedAssets.forEach(({ path: f, size }) => {
    const relativePath = path.relative(distDir, f).replace(/\\/g, '/');
    const gzPath = f + '.gz';
    const brPath = f + '.br';
    
    const gz = fs.existsSync(gzPath) ? fs.statSync(gzPath).size : null;
    const br = fs.existsSync(brPath) ? fs.statSync(brPath).size : null;
    
    totalRaw += size;
    if (br) totalBr += br;

    summaryMd += `| \`${relativePath}\` | ${formatSize(size)} | ${gz ? formatSize(gz) : '-'} | ${br ? `**${formatSize(br)}**` : '-'} |\n`;
  });

  summaryMd += `\n**Total Raw Size**: ${formatSize(totalRaw)}\n`;
  if (totalBr > 0) {
    summaryMd += `**Total Brotli Size**: ${formatSize(totalBr)}\n`;
  }

  // Performance Budget Check
  const BUDGET_LIMIT = 1.5 * 1024 * 1024; // 1.5MB Budget
  const budgetStatus = totalRaw <= BUDGET_LIMIT ? '✅' : '⚠️';
  summaryMd += `\n${budgetStatus} **Performance Budget**: ${formatSize(totalRaw)} / ${formatSize(BUDGET_LIMIT)} used\n`;

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd);
    console.log('Bundle summary appended to GITHUB_STEP_SUMMARY');
  } else {
    console.log('--- Bundle Summary (Preview) ---');
    console.log(summaryMd);
  }
} catch (error) {
  console.error('Error generating bundle summary:', error);
  process.exit(1);
}

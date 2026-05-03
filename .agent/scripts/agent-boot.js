import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

function getProjectContext() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const tsConfigContent = fs.readFileSync(path.join(rootDir, 'tsconfig.app.json'), 'utf-8')
    .split('\n')
    .filter(line => !line.trim().startsWith('//') && !line.trim().startsWith('/*'))
    .join('\n');
  const tsConfig = JSON.parse(tsConfigContent);

  const context = {
    project: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      stack: ['Vue 3', 'Vite', 'Pinia', 'TresJS (Three.js)', 'TailwindCSS'],
    },
    aliases: tsConfig.compilerOptions.paths,
    structure: {
      src: fs.readdirSync(path.join(rootDir, 'src')).filter(f => fs.statSync(path.join(rootDir, 'src', f)).isDirectory()),
      docs: fs.existsSync(path.join(rootDir, '.docs')) ? fs.readdirSync(path.join(rootDir, '.docs')) : [],
    },
    apis: {
      stores: fs.readFileSync(path.join(rootDir, 'src/types/stores.d.ts'), 'utf-8'),
    }
  };

  return context;
}

console.log(JSON.stringify(getProjectContext(), null, 2));

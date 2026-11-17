// Genera src/index.js: la entrada del paquete (export * de cada átomo y organismo).
// Se ejecuta con `npm run index`; los ficheros que empiezan por _ son internos.
import { readdirSync, writeFileSync } from 'node:fs';

const lines = [
  '// Generado por scripts/build-index.mjs — no editar a mano.',
  "// Estilos: importar también 'cs-design-system/tokens.css' y 'cs-design-system/foundations.css'.",
  '',
];
for (const dir of ['components', 'organisms']) {
  lines.push(`// ${dir === 'components' ? 'Átomos' : 'Organismos'}`);
  for (const f of readdirSync(`src/${dir}`).sort()) {
    if (!/\.jsx?$/.test(f) || f.startsWith('_')) continue;
    lines.push(`export * from './${dir}/${f}';`);
  }
  lines.push('');
}
writeFileSync('src/index.js', lines.join('\n'));
console.log('src/index.js', lines.filter((l) => l.startsWith('export')).length, 'módulos');

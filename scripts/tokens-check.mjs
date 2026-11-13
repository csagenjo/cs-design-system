#!/usr/bin/env node
/**
 * tokens:check — valida el export de variables de Figma (tokens/*) tras cada re-export.
 *
 * Export nativo de Figma: panel de Variables → clic derecho en la colección →
 * Export modes (un ZIP por colección, formato DTCG). El hex o número de `$value`
 * es el valor resuelto que Figma añade por comodidad; el enlace real está en
 * `$extensions["com.figma.aliasData"]`, o en una referencia DTCG `{a.b.c}`
 * cuando apunta a la misma colección.
 *
 * Comprueba tres cosas:
 *   1. Todo alias resuelve: el destino existe en la colección a la que apunta.
 *   2. No hay valores sin enlace: solo Base guarda literales.
 *   3. No hay saltos de capa: cada colección solo apunta a la capa siguiente
 *      (Component → Mode | Device · Mode → Theme · Device → Theme · Theme → Base),
 *      salvo las excepciones escritas en tokens/layer-exceptions.json.
 *
 * Uso: npm run tokens:check   (sale con código 1 si hay errores)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../tokens/', import.meta.url).pathname;

// carpeta del repo → nombre de la colección en Figma (targetVariableSetName)
const COLLECTIONS = {
  Base: 'Base',
  Theme: 'Theme',
  Mode: 'Mode',
  Device: 'Device',
  Component: 'Component tokens',
};
// destinos permitidos por colección (por nombre de Figma)
const ALLOWED = {
  Base: [],
  Theme: ['Base'],
  Mode: ['Theme'],
  Device: ['Theme'],
  'Component tokens': ['Mode', 'Device'],
};

const exceptionsFile = join(ROOT, 'layer-exceptions.json');
const exceptions = existsSync(exceptionsFile)
  ? JSON.parse(readFileSync(exceptionsFile, 'utf8')).exceptions ?? []
  : [];
const isException = (token, target) =>
  exceptions.some((e) => e.token === token && (!e.target || e.target === target));

function* flatten(node, path = []) {
  if (node && typeof node === 'object') {
    if ('$value' in node) { yield [path.join('/'), node]; return; }
    for (const [k, v] of Object.entries(node)) {
      if (!k.startsWith('$')) yield* flatten(v, [...path, k]);
    }
  }
}

// colección (nombre Figma) → { file → Map(nombre → token) }
const data = {};
for (const [folder, setName] of Object.entries(COLLECTIONS)) {
  const dir = join(ROOT, folder);
  if (!existsSync(dir)) continue;
  data[setName] = {};
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    data[setName][f] = new Map(flatten(JSON.parse(readFileSync(join(dir, f), 'utf8'))));
  }
}
const names = Object.fromEntries(
  Object.entries(data).map(([set, files]) => [set, new Set(Object.values(files).flatMap((m) => [...m.keys()]))])
);

const errors = { broken: [], unlinked: [], skips: [] };
const stats = {};
const seen = new Set();

for (const [set, files] of Object.entries(data)) {
  stats[set] = { tokens: names[set].size, targets: {}, internal: 0, literal: 0 };
  for (const [file, tokens] of Object.entries(files)) {
    for (const [name, t] of tokens) {
      const key = `${set}|${name}`;
      const once = !seen.has(key); seen.add(key);
      const where = `${set} · ${name}${Object.keys(files).length > 1 ? ` (${file})` : ''}`;
      const v = t.$value;
      const alias = t.$extensions?.['com.figma.aliasData'];

      // referencia DTCG dentro de la misma colección
      if (typeof v === 'string' && /^\{.+\}$/.test(v)) {
        const ref = v.slice(1, -1).replace(/\./g, '/');
        if (once) stats[set].internal++;
        if (!names[set].has(ref)) errors.broken.push(`${where} → ${v} (no existe en ${set})`);
        continue;
      }
      if (alias) {
        const target = alias.targetVariableSetName;
        const tname = alias.targetVariableName;
        if (once) stats[set].targets[target] = (stats[set].targets[target] ?? 0) + 1;
        if (names[target] && tname && !names[target].has(tname)) {
          // En Figma un nombre puede ser token y grupo a la vez (opacity/hover y
          // opacity/hover/default-light); DTCG no: el export pierde el token.
          const isGroup = [...names[target]].some((n) => n.startsWith(`${tname}/`));
          errors.broken.push(`${where} → ${target} · ${tname} ${isGroup
            ? '(colisión: en Figma es token y grupo a la vez; el export pierde el token — renombrar uno de los dos)'
            : '(no existe)'}`);
        }
        if (!ALLOWED[set]?.includes(target) && !isException(name, target) && once) {
          errors.skips.push(`${set} · ${name} → ${target} · ${tname}`);
        }
        continue;
      }
      if (once) stats[set].literal++;
      if (set !== 'Base' && once) errors.unlinked.push(`${set} · ${name} = ${JSON.stringify(v?.hex ?? v)}`);
    }
  }
}

console.log('── tokens:check ──');
for (const [set, s] of Object.entries(stats)) {
  const t = Object.entries(s.targets).map(([k, n]) => `${k} ${n}`).join(', ') || '—';
  console.log(`${set.padEnd(17)} ${String(s.tokens).padStart(4)} tokens · alias → ${t} · internos ${s.internal} · literales ${s.literal}`);
}
if (exceptions.length) console.log(`Excepciones documentadas: ${exceptions.length} (tokens/layer-exceptions.json)`);

const sections = [
  ['Alias que no resuelven', errors.broken],
  ['Valores sin enlace fuera de Base', errors.unlinked],
  ['Saltos de capa sin excepción documentada', errors.skips],
];
let failed = 0;
for (const [title, list] of sections) {
  if (!list.length) continue;
  failed += list.length;
  console.log(`\n✗ ${title} (${list.length})`);
  for (const l of list) console.log(`  - ${l}`);
}
if (failed) {
  console.log(`\n${failed} problema(s). Corrige en Figma y re-exporta, o documenta la excepción en tokens/layer-exceptions.json.`);
  process.exit(1);
}
console.log('\n✓ Todo alias resuelve · 0 valores sin enlace · 0 saltos de capa sin documentar');

import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/', root), { recursive: true });
await copyFile(new URL('src/index.js', root), new URL('dist/liquid-glass.js', root));
await copyFile(new URL('src/index.d.ts', root), new URL('dist/liquid-glass.d.ts', root));
const source = await readFile(new URL('src/index.js', root), 'utf8');
const classic = `/* Glasskit classic build. Works with file:// and ordinary script tags. */\n(() => {\n'use strict';\n${source.replace(/^export /gm, '')}\nglobalThis.Glasskit = Object.freeze({ LiquidGlass, LiquidRecorder, registerLiquidGlass, formatTime });\n})();\n`;
await writeFile(new URL('dist/liquid-glass.global.js', root), classic);
console.log('Built ES module, classic script, and TypeScript declarations. No dependencies.');

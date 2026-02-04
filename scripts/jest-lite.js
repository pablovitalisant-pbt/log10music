#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('util');

const args = process.argv.slice(2);
let pattern = '';
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--testPathPattern=')) pattern = args[i].split('=')[1].replace(/['"]/g, '');
  if (args[i] === '--testPathPattern') pattern = (args[i + 1] || '').replace(/['"]/g, '');
}

const root = path.resolve(process.cwd(), 'tests');
const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && /\.test\.ts$/.test(entry.name)) files.push(full);
  }
}
walk(root);
const selected = files.filter((f) => !pattern || f.includes(pattern));
if (!selected.length) {
  console.error('No tests found');
  process.exit(1);
}

let failed = 0;
global.describe = (_name, fn) => fn();
global.it = (_name, fn) => { try { fn(); } catch (e) { failed++; console.error(e.message); } };
global.test = global.it;
global.expect = (received) => ({
  toBe(expected) { if (received !== expected) throw new Error(`Expected ${expected} but received ${received}`); },
  toEqual(expected) { if (!util.isDeepStrictEqual(received, expected)) throw new Error('Expected deep equality'); },
  toHaveLength(expected) { if ((received || []).length !== expected) throw new Error(`Expected length ${expected}`); },
  toMatch(expected) {
    if (expected instanceof RegExp && !expected.test(String(received))) throw new Error(`Expected match ${expected}`);
    if (!(expected instanceof RegExp) && !String(received).includes(String(expected))) throw new Error(`Expected match ${expected}`);
  }
});

for (const file of selected) {
  try { require(file); } catch (e) { failed++; console.error(e.message); }
}

process.exit(failed ? 1 : 0);

#!/usr/bin/env node

/**
 * PBT-ULTRA - AI Agent Orchestrator
 * 
 * Enforcement duro:
 * - PRD inmutable (hash baseline)
 * - Packet por slice (nunca sobrescribir)
 * - RED previo obligatorio
 * - GREEN posterior obligatorio
 * - Line limit bloqueante
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// ============================================
// CONSTANTES
// ============================================

const PRD_PATH = 'PRD_EXHAUSTIVO.md';
const PRD_HASH_PATH = '.claude/PRD_HASH.txt';
const PLAN_PATH = '.claude/SLICES_PLAN.json';
const STATE_PATH = '.claude/STATE.json';
const PACKETS_DIR = '.claude/packets';
const EVIDENCE_DIR = '.claude/evidence';

// ============================================
// UTILIDADES
// ============================================

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function log(type, msg) {
  const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    success: '\x1b[32m',
    info: '\x1b[34m',
    reset: '\x1b[0m'
  };
  const prefix = {
    error: '❌',
    warn: '⚠️ ',
    success: '✅',
    info: 'ℹ️ '
  };
  console.log(`${colors[type]}${prefix[type]} ${msg}${colors.reset}`);
}

function exitWithError(msg) {
  log('error', msg);
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ============================================
// PRD ENFORCEMENT
// ============================================

function readPRD() {
  if (!fs.existsSync(PRD_PATH)) {
    exitWithError(`No se encontró ${PRD_PATH}`);
  }
  return fs.readFileSync(PRD_PATH, 'utf-8');
}

function ensurePRDImmutable() {
  const prdText = readPRD();
  const currentHash = sha256(prdText);
  
  ensureDir('.claude');
  
  // Primera vez: crear baseline
  if (!fs.existsSync(PRD_HASH_PATH)) {
    fs.writeFileSync(PRD_HASH_PATH, currentHash);
    try { fs.chmodSync(PRD_PATH, 0o444); } catch(e) {}
    log('success', 'PRD baseline hash creado');
    return currentHash;
  }
  
  // Verificar que no cambió
  const baselineHash = fs.readFileSync(PRD_HASH_PATH, 'utf-8').trim();
  if (currentHash !== baselineHash) {
    console.error('\n❌ VIOLACIÓN: PRD_EXHAUSTIVO.md FUE MODIFICADO\n');
    console.error(`   Baseline: ${baselineHash}`);
    console.error(`   Actual:   ${currentHash}`);
    console.error('\nEsto está PROHIBIDO. El PRD es inmutable.\n');
    process.exit(1);
  }
  
  // Reforzar read-only
  try { fs.chmodSync(PRD_PATH, 0o444); } catch(e) {}
  
  return currentHash;
}

// ============================================
// PLAN Y ESTADO
// ============================================

function loadPlan() {
  if (!fs.existsSync(PLAN_PATH)) {
    exitWithError('No existe SLICES_PLAN.json. Ejecuta: npm run analyze-prd');
  }
  return JSON.parse(fs.readFileSync(PLAN_PATH, 'utf-8'));
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    const initial = { currentSlice: 1, completedSlices: [] };
    saveState(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
}

function saveState(state) {
  ensureDir('.claude');
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// ============================================
// PACKET GENERATION (inmutable)
// ============================================

function generatePacket(slice) {
  const prdHash = ensurePRDImmutable();
  
  if (!slice.source || !slice.source.lineStart || !slice.source.lineEnd) {
    log('warn', `Slice ${slice.number} no tiene source.lineStart/lineEnd. Packet básico.`);
    return;
  }
  
  const pad = String(slice.number).padStart(3, '0');
  const mdPath = `${PACKETS_DIR}/slice-${pad}.packet.md`;
  const jsonPath = `${PACKETS_DIR}/slice-${pad}.packet.json`;
  
  ensureDir(PACKETS_DIR);
  
  // Si ya existe, NO sobrescribir (inmutable por diseño)
  if (fs.existsSync(mdPath) && fs.existsSync(jsonPath)) {
    log('info', `Packet slice-${pad} ya existe (inmutable)`);
    return;
  }
  
  // Leer bloque del PRD
  const lines = readPRD().split('\n');
  const start = Math.max(1, slice.source.lineStart);
  const end = Math.min(lines.length, slice.source.lineEnd);
  const block = lines.slice(start - 1, end).join('\n');
  const blockHash = sha256(block);
  
  // Markdown packet
  const md = [
    `# SLICE PACKET ${slice.number}`,
    ``,
    `## Metadata`,
    `- **Slice:** ${slice.number}`,
    `- **Name:** ${slice.name}`,
    `- **Description:** ${slice.description}`,
    `- **Heading Path:** ${slice.source.headingPath || 'N/A'}`,
    `- **Lines:** ${start}-${end}`,
    `- **Estimated Lines:** ${slice.estimatedLines}`,
    `- **Priority:** ${slice.priority}`,
    ``,
    `## Hashes (immutability proof)`,
    `- **PRD SHA256:** \`${prdHash}\``,
    `- **Block SHA256:** \`${blockHash}\``,
    ``,
    `## PRD Content (exact text for this slice)`,
    `\`\`\`markdown`,
    block,
    `\`\`\``,
    ``,
    `## Contract`,
    `- **Test File:** \`${slice.contract.testFile}\``,
    `- **Requirement:** ${slice.contract.requirement}`,
    `- **RED then GREEN:** ${slice.contract.redThenGreenRequired ? 'YES' : 'NO'}`,
    ``,
    `## Instructions for Agent`,
    ``,
    `1. Create test in \`${slice.contract.testFile}\``,
    `2. Run \`npm run red\` → MUST FAIL`,
    `3. Implement code (<${slice.estimatedLines} lines)`,
    `4. Run \`npm run green\` → MUST PASS`,
    `5. Run \`npm run complete ${slice.number}\``,
    ``,
  ].join('\n');
  
  // JSON packet
  const json = {
    sliceNumber: slice.number,
    name: slice.name,
    description: slice.description,
    headingPath: slice.source.headingPath || null,
    lineStart: start,
    lineEnd: end,
    prdHash,
    blockHash,
    estimatedLines: slice.estimatedLines,
    priority: slice.priority,
    contract: slice.contract,
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(mdPath, md);
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  
  log('success', `Packet slice-${pad} generado`);
}

// ============================================
// EVIDENCE MANAGEMENT
// ============================================

function hasEvidence(sliceNum, type) {
  // type: 'red' | 'green'
  const pad = String(sliceNum).padStart(3, '0');
  const file = `${EVIDENCE_DIR}/slice-${pad}.${type}.json`;
  return fs.existsSync(file);
}

function saveEvidence(sliceNum, type, data) {
  ensureDir(EVIDENCE_DIR);
  const pad = String(sliceNum).padStart(3, '0');
  const file = `${EVIDENCE_DIR}/slice-${pad}.${type}.json`;
  
  const evidence = {
    sliceNumber: sliceNum,
    type,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  fs.writeFileSync(file, JSON.stringify(evidence, null, 2));
  log('success', `Evidencia ${type} guardada para slice-${pad}`);
}

// ============================================
// TEST RUNNERS
// ============================================

function runTestSlice(sliceNum) {
  const pad = String(sliceNum).padStart(3, '0');
  const testPattern = `slice-${pad}`;
  
  log('info', `Ejecutando tests para slice-${pad}...`);
  
  try {
    const output = execSync(
      `npm test -- --testPathPattern="${testPattern}" --verbose`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    
    return {
      passed: true,
      output: output.toString()
    };
  } catch (error) {
    return {
      passed: false,
      output: error.stdout ? error.stdout.toString() : error.message
    };
  }
}

// ============================================
// LINE LIMIT ENFORCEMENT
// ============================================

function checkLineLimit(sliceNum, limit) {
  log('info', 'Verificando límite de líneas...');
  
  try {
    // Usar git diff para contar líneas agregadas
    const output = execSync('git diff --cached --numstat', { encoding: 'utf-8' });
    
    if (!output.trim()) {
      log('warn', 'No hay cambios staged. Intentando diff sin staged...');
      const output2 = execSync('git diff --numstat', { encoding: 'utf-8' });
      
      if (!output2.trim()) {
        log('warn', 'No se detectaron cambios. Asumiendo OK (<200).');
        return { ok: true, linesAdded: 0 };
      }
      
      const lines = output2.trim().split('\n');
      let totalAdded = 0;
      
      lines.forEach(line => {
        const [added] = line.split('\t');
        if (added !== '-') totalAdded += parseInt(added) || 0;
      });
      
      return {
        ok: totalAdded <= limit,
        linesAdded: totalAdded,
        limit
      };
    }
    
    const lines = output.trim().split('\n');
    let totalAdded = 0;
    
    lines.forEach(line => {
      const [added] = line.split('\t');
      if (added !== '-') totalAdded += parseInt(added) || 0;
    });
    
    return {
      ok: totalAdded <= limit,
      linesAdded: totalAdded,
      limit
    };
    
  } catch (error) {
    log('warn', `No se pudo verificar con git: ${error.message}`);
    return { ok: true, linesAdded: 0, warning: 'Git check failed' };
  }
}

// ============================================
// COMMANDS
// ============================================

function cmdStatus() {
  ensurePRDImmutable();
  
  const plan = loadPlan();
  const state = loadState();
  
  console.log('\n📊 ESTADO DEL PROYECTO\n');
  console.log(`Proyecto: ${plan.projectName || 'N/A'}`);
  console.log(`Total slices: ${plan.totalSlices || plan.slices.length}`);
  console.log(`Completados: ${state.completedSlices.length}`);
  console.log(`Pendientes: ${plan.slices.length - state.completedSlices.length}`);
  console.log(`Progreso: ${Math.round((state.completedSlices.length / plan.slices.length) * 100)}%`);
  console.log('');
  
  if (state.completedSlices.length === plan.slices.length) {
    log('success', '¡PROYECTO COMPLETO!');
  } else {
    console.log(`🎯 Siguiente slice: ${state.currentSlice}`);
  }
  console.log('');
}

function cmdNext() {
  ensurePRDImmutable();
  
  const plan = loadPlan();
  const state = loadState();
  
  const slice = plan.slices.find(s => s.number === state.currentSlice);
  
  if (!slice) {
    log('success', '¡TODOS LOS SLICES COMPLETADOS!');
    return;
  }
  
  // Generar packet (si no existe)
  generatePacket(slice);
  
  console.log('\n🎯 SIGUIENTE SLICE\n');
  console.log(`Número: ${slice.number}`);
  console.log(`Nombre: ${slice.name}`);
  console.log(`Descripción: ${slice.description}`);
  console.log(`Líneas estimadas: ${slice.estimatedLines}`);
  console.log(`Prioridad: ${slice.priority}`);
  
  if (slice.dependencies && slice.dependencies.length > 0) {
    console.log(`Dependencias: ${slice.dependencies.join(', ')}`);
    
    const missing = slice.dependencies.filter(d => !state.completedSlices.includes(d));
    if (missing.length > 0) {
      log('warn', `Faltan dependencias: ${missing.join(', ')}`);
    }
  }
  
  const pad = String(slice.number).padStart(3, '0');
  console.log('\n📦 Packet generado:');
  console.log(`   .claude/packets/slice-${pad}.packet.md`);
  console.log(`   .claude/packets/slice-${pad}.packet.json`);
  
  console.log('\n📋 PROTOCOLO OBLIGATORIO:\n');
  console.log(`1. Crear test: ${slice.contract.testFile}`);
  console.log(`2. Ejecutar: npm run red`);
  console.log(`   → DEBE FALLAR (RED)`);
  console.log(`3. Implementar código (<${slice.estimatedLines} líneas)`);
  console.log(`4. Ejecutar: npm run green`);
  console.log(`   → DEBE PASAR (GREEN)`);
  console.log(`5. Actualizar EVOLUTION_LOG.md`);
  console.log(`6. Ejecutar: npm run complete ${slice.number}`);
  console.log('');
}

function cmdCurrent() {
  ensurePRDImmutable();
  
  const plan = loadPlan();
  const state = loadState();
  const slice = plan.slices.find(s => s.number === state.currentSlice);
  
  if (!slice) {
    log('success', '¡TODOS LOS SLICES COMPLETADOS!');
    return;
  }
  
  console.log('\n📄 SLICE ACTUAL (JSON completo)\n');
  console.log(JSON.stringify(slice, null, 2));
  console.log('');
}

function cmdRed() {
  ensurePRDImmutable();
  
  const state = loadState();
  const sliceNum = state.currentSlice;
  
  console.log(`\n🔴 VERIFICANDO TEST RED para slice ${sliceNum}...\n`);
  
  const result = runTestSlice(sliceNum);
  
  if (result.passed) {
    console.log('\n❌ VIOLACIÓN: El test PASÓ pero debe FALLAR (RED)\n');
    console.log('El test debe estar en RED antes de implementar.');
    console.log('Posibles causas:');
    console.log('  - El test está mal escrito (siempre pasa)');
    console.log('  - Ya existe implementación previa');
    console.log('  - No es el slice correcto');
    console.log('');
    process.exit(1);
  }
  
  log('success', 'Test está en RED (como debe ser)');
  
  // Guardar evidencia
  saveEvidence(sliceNum, 'red', {
    testPassed: false,
    output: result.output.substring(0, 1000) // Truncar
  });
  
  console.log('\n✅ Evidencia RED guardada. Puedes implementar.\n');
}

function cmdGreen() {
  ensurePRDImmutable();
  
  const state = loadState();
  const sliceNum = state.currentSlice;
  
  console.log(`\n🟢 VERIFICANDO TEST GREEN para slice ${sliceNum}...\n`);
  
  // Verificar que existe evidencia RED previa
  if (!hasEvidence(sliceNum, 'red')) {
    console.log('\n❌ VIOLACIÓN: No existe evidencia RED previa\n');
    console.log('Debes ejecutar "npm run red" ANTES de implementar.');
    console.log('');
    process.exit(1);
  }
  
  const result = runTestSlice(sliceNum);
  
  if (!result.passed) {
    console.log('\n❌ VIOLACIÓN: El test FALLÓ pero debe PASAR (GREEN)\n');
    console.log('El test debe pasar después de implementar.');
    console.log('\nOutput del test:');
    console.log(result.output);
    console.log('');
    process.exit(1);
  }
  
  log('success', 'Test está en GREEN (como debe ser)');
  
  // Guardar evidencia
  saveEvidence(sliceNum, 'green', {
    testPassed: true,
    output: result.output.substring(0, 1000) // Truncar
  });
  
  console.log('\n✅ Evidencia GREEN guardada. Puedes completar.\n');
}

function cmdComplete(sliceNum) {
  ensurePRDImmutable();
  
  if (!sliceNum) {
    exitWithError('Especifica el número de slice: npm run complete <N>');
  }
  
  const num = parseInt(sliceNum);
  const plan = loadPlan();
  const state = loadState();
  
  const slice = plan.slices.find(s => s.number === num);
  if (!slice) {
    exitWithError(`Slice ${num} no existe en el plan`);
  }
  
  console.log(`\n🔒 VERIFICANDO SLICE ${num} antes de completar...\n`);
  
  // 1. Verificar packet existe
  const pad = String(num).padStart(3, '0');
  const packetMd = `${PACKETS_DIR}/slice-${pad}.packet.md`;
  const packetJson = `${PACKETS_DIR}/slice-${pad}.packet.json`;
  
  if (!fs.existsSync(packetMd) || !fs.existsSync(packetJson)) {
    exitWithError('Packet no existe. Ejecuta: npm run next');
  }
  log('success', 'Packet existe');
  
  // 2. Verificar PRD hash intacto
  ensurePRDImmutable();
  log('success', 'PRD hash intacto');
  
  // 3. Verificar evidencia RED
  if (!hasEvidence(num, 'red')) {
    exitWithError('Falta evidencia RED. Ejecuta: npm run red');
  }
  log('success', 'Evidencia RED existe');
  
  // 4. Verificar evidencia GREEN
  if (!hasEvidence(num, 'green')) {
    exitWithError('Falta evidencia GREEN. Ejecuta: npm run green');
  }
  log('success', 'Evidencia GREEN existe');
  
  // 5. Verificar line limit
  const limit = Math.min(200, slice.estimatedLines);
  const lineCheck = checkLineLimit(num, limit);
  
  if (!lineCheck.ok) {
    console.log(`\n❌ VIOLACIÓN: Límite de líneas excedido\n`);
    console.log(`   Límite: ${lineCheck.limit}`);
    console.log(`   Agregadas: ${lineCheck.linesAdded}`);
    console.log('\nDivide el slice en partes más pequeñas.\n');
    process.exit(1);
  }
  log('success', `Line limit OK (${lineCheck.linesAdded}/${limit})`);
  
  // 6. Marcar completado
  if (!state.completedSlices.includes(num)) {
    state.completedSlices.push(num);
  }
  
  state.currentSlice = num + 1;
  saveState(state);
  
  console.log(`\n✅ SLICE ${num} COMPLETADO\n`);
  
  if (state.currentSlice <= plan.slices.length) {
    console.log(`🎯 Siguiente: Slice ${state.currentSlice}`);
    console.log(`   npm run next\n`);
  } else {
    log('success', '🎉 ¡PROYECTO COMPLETO!');
  }
}

function showHelp() {
  console.log('\n🤖 PBT-ULTRA - AI Agent Orchestrator\n');
  console.log('Comandos:\n');
  console.log('  npm run status          - Ver estado del proyecto');
  console.log('  npm run next            - Ver/generar siguiente slice');
  console.log('  npm run current         - Ver slice actual (JSON)');
  console.log('  npm run red             - Verificar test RED (debe fallar)');
  console.log('  npm run green           - Verificar test GREEN (debe pasar)');
  console.log('  npm run complete <N>    - Completar slice N (con enforcement)');
  console.log('');
}

// ============================================
// MAIN
// ============================================

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'status':
    cmdStatus();
    break;
  case 'next':
    cmdNext();
    break;
  case 'current':
    cmdCurrent();
    break;
  case 'red':
    cmdRed();
    break;
  case 'green':
    cmdGreen();
    break;
  case 'complete':
    cmdComplete(arg);
    break;
  default:
    showHelp();
}


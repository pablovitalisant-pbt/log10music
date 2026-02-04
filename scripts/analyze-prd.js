#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

// ============================================
// VALIDACIONES INICIALES (FAIL HARD)
// ============================================

console.log("📖 Leyendo PRD_EXHAUSTIVO.md...");
const prdPath = "PRD_EXHAUSTIVO.md";

if (!fs.existsSync(prdPath)) {
  console.error("\n❌ ERROR FATAL: PRD_EXHAUSTIVO.md no existe en el directorio actual.");
  console.error("   Asegúrate de ejecutar este script desde la raíz del proyecto.");
  process.exit(1);
}

const prdText = fs.readFileSync(prdPath, "utf-8");

if (!prdText || prdText.trim().length === 0) {
  console.error("\n❌ ERROR FATAL: PRD_EXHAUSTIVO.md está vacío.");
  process.exit(1);
}

const lines = prdText.split("\n");

// ============================================
// EXTRACCIÓN Y CLASIFICACIÓN
// ============================================

const projectName = extractProjectName(prdText);
const sections = parseMarkdownSections(lines);
const endpoints = extractEndpoints(lines);

console.log(`\n✓ Proyecto: ${projectName}`);
console.log(`✓ Secciones detectadas (headings): ${sections.length}`);
console.log(`✓ Endpoints detectados: ${endpoints.length}`);

// Clasificar secciones por implementabilidad
const classifiedSections = classifySections(sections);

// Generar slices profesionales con orden y dependencias
const slices = generateProfessionalSlices(classifiedSections, endpoints);

// Validar cobertura
const coverage = computeCoverage(classifiedSections, slices);

// ============================================
// VALIDACIONES DE CALIDAD (FAIL HARD)
// ============================================

const emptySlices = slices.filter(s => s.estimatedLines === 0 && s.number !== 0);
if (emptySlices.length > 0) {
  console.error("\n❌ ERROR FATAL: Se detectaron slices vacíos (sin contenido implementable):");
  emptySlices.forEach(s => {
    console.error(`   - Slice ${s.number}: ${s.name}`);
  });
  console.error("\nEsto indica un bug en la lógica de clasificación. Abortando.");
  process.exit(1);
}

if (coverage.uncoveredImplementableSections.length > 0) {
  console.error("\n❌ ERROR FATAL: Cobertura incompleta - hay secciones implementables sin slice:");
  coverage.uncoveredImplementableSections.slice(0, 20).forEach((s) => {
    console.error(`   - ${s.path} (líneas ${s.startLine}-${s.endLine})`);
  });
  console.error("\nArregla el generador antes de continuar.");
  process.exit(1);
}

// ============================================
// GUARDAR PLAN
// ============================================

const plan = {
  projectName,
  generatedAt: new Date().toISOString(),
  totalSections: classifiedSections.length,
  totalSlices: slices.length,
  sections: classifiedSections.map(s => ({
    id: s.id,
    level: s.level,
    title: s.title,
    path: s.path,
    startLine: s.startLine,
    endLine: s.endLine,
    implementable: s.implementable || false,
    category: s.category || "other"
  })),
  coverage,
  slices,
};

fs.mkdirSync(".claude", { recursive: true });
fs.writeFileSync(".claude/SLICES_PLAN.json", JSON.stringify(plan, null, 2));

// ============================================
// REPORTE FINAL
// ============================================

console.log(`✓ Slices generados: ${slices.length}`);
console.log(`✓ Slices implementables: ${slices.filter(s => s.estimatedLines > 0).length}`);
console.log(`✓ Slices vacíos: ${emptySlices.length} (debe ser 0)`);
console.log(`✓ Cobertura: ${coverage.coveragePercentage}% (${coverage.coveredSections}/${coverage.implementableSections})`);

console.log("\n✅ Plan profesional guardado en .claude/SLICES_PLAN.json");
console.log(`   Orden: Setup → DB → Auth → APIs → Integrations → Observability → Frontend → Testing → Operations`);

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function extractProjectName(text) {
  const h1 = text.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return "Proyecto sin nombre";
}

function parseMarkdownSections(lines) {
  const headings = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s+(.+)\s*$/);
    if (m) {
      headings.push({
        level: m[1].length,
        title: m[2].trim(),
        line: i + 1,
      });
    }
  }

  if (headings.length === 0) {
    return [{
      id: "SEC-001",
      level: 1,
      title: "Documento completo (sin headings)",
      path: "Documento completo (sin headings)",
      startLine: 1,
      endLine: lines.length,
      text: lines.join("\n"),
      hash: sha256(lines.join("\n")),
    }];
  }

  const stack = [];
  const sections = [];

  for (let idx = 0; idx < headings.length; idx++) {
    const h = headings[idx];

    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) stack.pop();
    stack.push({ level: h.level, title: h.title });

    const startLine = h.line;
    const nextHeading = headings[idx + 1];
    const endLine = nextHeading ? (nextHeading.line - 1) : lines.length;

    const text = lines.slice(startLine - 1, endLine).join("\n");
    const path = stack.map(x => x.title).join(" > ");

    sections.push({
      id: `SEC-${String(sections.length + 1).padStart(3, "0")}`,
      level: h.level,
      title: h.title,
      path,
      startLine,
      endLine,
      text,
      hash: sha256(text),
    });
  }

  return sections;
}

function extractEndpoints(lines) {
  const eps = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/Método y Ruta:\s*(GET|POST|PUT|DELETE|PATCH)\s+([^\s]+)/i);
    if (m) {
      eps.push({
        method: m[1].toUpperCase(),
        path: m[2],
        line: i + 1,
      });
    }
    const m2 = lines[i].match(/\b(GET|POST|PUT|DELETE|PATCH)\s+(\/[A-Za-z0-9\-._~\/?#[\]@!$&'()*+,;=%:]+)/);
    if (m2) {
      const key = `${m2[1].toUpperCase()} ${m2[2]}`;
      if (!eps.some(e => `${e.method} ${e.path}` === key)) {
        eps.push({ method: m2[1].toUpperCase(), path: m2[2], line: i + 1 });
      }
    }
  }
  return eps;
}

function classifySections(sections) {
  return sections.map(sec => {
    const title = sec.title.toLowerCase();
    const text = sec.text.toLowerCase();
    const lineCount = sec.endLine - sec.startLine + 1;

    // Determinar si es NO implementable (lista de exclusión)
    const isNonImplementable =
      title.includes("costos") ||
      title.includes("recursos") ||
      title.includes("legal") ||
      title.includes("compliance") ||
      title.includes("presupuesto") ||
      lineCount < 3 || // Secciones muy cortas (solo heading)
      (title.includes("documentación") && !title.includes("api"));

    // Categorizar por fase
    let category = "other";
    let phase = 9;

    if (title.includes("testing") || title.includes("test")) {
      category = "testing";
      phase = 8;
    } else if (title.includes("ci/cd") || title.includes("deployment") || title.includes("pipeline")) {
      category = "cicd";
      phase = 8;
    } else if (title.includes("frontend") || title.includes("ui/ux") || title.includes("componentes")) {
      category = "frontend";
      phase = 7;
    } else if (title.includes("observabilidad") || title.includes("monitoreo") || title.includes("logging") || title.includes("métricas") || title.includes("tracing") || title.includes("alerting")) {
      category = "observability";
      phase = 6;
    } else if (title.includes("integraciones") || title.includes("webhooks") || title.includes("terceros") || title.includes("externas")) {
      category = "integrations";
      phase = 5;
    } else if (title.includes("api") || title.includes("endpoints") || title.includes("contratos") || title.includes("interfaz")) {
      category = "apis";
      phase = 4;
    } else if (title.includes("autenticación") || title.includes("autorización") || title.includes("auth") || title.includes("permisos") || title.includes("roles")) {
      category = "auth";
      phase = 3;
    } else if (title.includes("base") || title.includes("datos") || title.includes("almacenamiento") || title.includes("schema") || title.includes("migration")) {
      category = "database";
      phase = 2;
    } else if (title.includes("arquitectura") || title.includes("infraestructura") || title.includes("setup") || title.includes("proyecto") || title.includes("componentes") || title.includes("módulos")) {
      category = "setup";
      phase = 1;
    } else if (title.includes("seguridad") && !title.includes("auth")) {
      category = "security";
      phase = 6;
    } else if (title.includes("disaster") || title.includes("recovery") || title.includes("mantenimiento") || title.includes("soporte") || title.includes("operacionales")) {
      category = "operations";
      phase = 9;
    } else if (title.includes("versiones") || title.includes("código") || title.includes("containerización") || title.includes("configuración")) {
      category = "cicd";
      phase = 8;
    } else if (title.includes("requerimientos") || title.includes("funcionales") || title.includes("definición") || title.includes("negocio")) {
      category = "setup";
      phase = 1;
    }

    // Por defecto, si no está en la lista de exclusión, es implementable
    const hasImplementableContent = !isNonImplementable;

    return {
      ...sec,
      implementable: hasImplementableContent,
      category,
      phase
    };
  });
}

function generateProfessionalSlices(sections, endpoints) {
  const slices = [];
  let sliceNumber = 1;

  // Fase 0: Setup y tooling
  const setupSections = sections.filter(s => s.category === "setup" && s.implementable);
  for (const sec of setupSections) {
    slices.push(createSlice(sliceNumber++, sec, [], "critical"));
  }

  // Fase 1: Database
  const dbSections = sections.filter(s => s.category === "database" && s.implementable);
  const setupDeps = slices.map(s => s.number);
  for (const sec of dbSections) {
    slices.push(createSlice(sliceNumber++, sec, setupDeps.slice(0, 1), "critical"));
  }

  // Fase 2: Auth
  const authSections = sections.filter(s => s.category === "auth" && s.implementable);
  const dbDeps = slices.filter(s => s.source.category === "database").map(s => s.number);
  for (const sec of authSections) {
    slices.push(createSlice(sliceNumber++, sec, dbDeps.slice(0, 1), "critical"));
  }

  // Fase 3: APIs
  const apiSections = sections.filter(s => s.category === "apis" && s.implementable);
  const authDeps = slices.filter(s => s.source.category === "auth").map(s => s.number);
  for (const sec of apiSections) {
    const deps = [...dbDeps.slice(0, 1), ...authDeps.slice(0, 1)];
    slices.push(createSlice(sliceNumber++, sec, deps, "high"));
  }

  // Fase 4: Integrations
  const integrationSections = sections.filter(s => s.category === "integrations" && s.implementable);
  const apiDeps = slices.filter(s => s.source.category === "apis").map(s => s.number);
  for (const sec of integrationSections) {
    slices.push(createSlice(sliceNumber++, sec, apiDeps.slice(0, 1), "medium"));
  }

  // Fase 5: Observability & Security
  const obsSections = sections.filter(s => (s.category === "observability" || s.category === "security") && s.implementable);
  for (const sec of obsSections) {
    slices.push(createSlice(sliceNumber++, sec, setupDeps.slice(0, 1), "high"));
  }

  // Fase 6: Frontend
  const frontendSections = sections.filter(s => s.category === "frontend" && s.implementable);
  for (const sec of frontendSections) {
    slices.push(createSlice(sliceNumber++, sec, apiDeps.slice(0, 1), "medium"));
  }

  // Fase 7: Testing & CI/CD
  const testingSections = sections.filter(s => (s.category === "testing" || s.category === "cicd") && s.implementable);
  for (const sec of testingSections) {
    slices.push(createSlice(sliceNumber++, sec, [], "high"));
  }

  // Fase 8: Operations
  const opsSections = sections.filter(s => s.category === "operations" && s.implementable);
  for (const sec of opsSections) {
    slices.push(createSlice(sliceNumber++, sec, [], "low"));
  }

  // Fase 9: Other implementable sections
  const otherSections = sections.filter(s =>
    s.implementable &&
    !["setup", "database", "auth", "apis", "integrations", "observability", "security", "frontend", "testing", "cicd", "operations"].includes(s.category)
  );
  for (const sec of otherSections) {
    slices.push(createSlice(sliceNumber++, sec, [], "medium"));
  }

  return slices;
}

function createSlice(number, section, dependencies, priority) {
  const lineCount = section.endLine - section.startLine + 1;
  const estimatedLines = Math.min(lineCount * 2, 180);

  return {
    number,
    name: `${section.category.toUpperCase()}: ${section.title}`,
    description: `Implementar lo descrito en: ${section.path} (líneas ${section.startLine}-${section.endLine}).`,
    estimatedLines,
    priority,
    dependencies,
    source: {
      sectionId: section.id,
      headingPath: section.path,
      lineStart: section.startLine,
      lineEnd: section.endLine,
      textHash: section.hash,
      category: section.category,
      part: null,
    },
    contract: {
      testFile: `tests/contracts/slice-${String(number).padStart(3, "0")}.test.ts`,
      requirement: `Cubrir comportamiento descrito en "${section.path}"`,
      redThenGreenRequired: true,
    },
  };
}

function computeCoverage(sections, slices) {
  const covered = new Set();
  for (const s of slices) {
    if (s.source && s.source.sectionId) covered.add(s.source.sectionId);
  }

  const implementableSections = sections.filter(s => s.implementable);
  const uncoveredImplementableSections = implementableSections
    .filter(sec => !covered.has(sec.id))
    .map(sec => ({ id: sec.id, path: sec.path, startLine: sec.startLine, endLine: sec.endLine }));

  return {
    totalSections: sections.length,
    implementableSections: implementableSections.length,
    coveredSections: covered.size,
    uncoveredImplementableSections,
    coveragePercentage: implementableSections.length > 0
      ? Math.round((covered.size / implementableSections.length) * 100)
      : 100,
  };
}

function sha256(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

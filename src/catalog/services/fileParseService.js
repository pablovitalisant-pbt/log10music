const { parseTabularFile } = require('../parse/tabularParser');

async function parseCatalogFile({
  fileId,
  vendorId,
  fileName,
  buffer,
  mimeType,
  sourceRowRepo,
  issueRepo,
} = {}) {
  const rows = parseTabularFile({ buffer, mimeType });
  const persisted = [];
  for (const [index, rawRow] of rows.entries()) {
    const row = await sourceRowRepo.upsertSourceRow({
      sourceRowId: `${fileId}-${index + 1}`,
      vendorId,
      fileId,
      fileName,
      rowNumber: index + 1,
      rawRow,
    });
    persisted.push(row);
  }
  const issuesCreated = issueRepo ? await issueRepo.listIssues().then((items) => items.length) : 0;
  return {
    fileId,
    vendorId,
    status: 'parsed_ok',
    rowsParsed: persisted.length,
    issuesCreated,
    sample: persisted[0]?.rawRow || null,
  };
}

module.exports = {
  parseCatalogFile,
};

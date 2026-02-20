const { parseTabularFile } = require('../parse/tabularParser');

function parseCatalogFile({
  fileId,
  vendorId,
  fileName,
  buffer,
  mimeType,
  sourceRowRepo,
  issueRepo,
} = {}) {
  const rows = parseTabularFile({ buffer, mimeType });
  const persisted = rows.map((rawRow, index) =>
    sourceRowRepo.upsertSourceRow({
      sourceRowId: `${fileId}-${index + 1}`,
      vendorId,
      fileId,
      fileName,
      rowNumber: index + 1,
      rawRow,
    })
  );
  const issuesCreated = issueRepo ? issueRepo.listIssues().length : 0;
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

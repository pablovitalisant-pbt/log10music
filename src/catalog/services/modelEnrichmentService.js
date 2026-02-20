const { extractModel } = require('../extract/modelExtractor');

function enrichSourceRowWithModel({ rawRow, issueRepo, vendorId, fileId, fileName, sourceRowId } = {}) {
  const result = extractModel(rawRow);
  if (result.status === 'ambiguous') {
    issueRepo.createIssue({
      issueId: `issue-${Date.now()}`,
      type: 'ambiguous_model',
      vendorId: vendorId || 'unknown',
      fileId: fileId || 'unknown',
      fileName: fileName || 'unknown',
      detail: {
        sourceRowId: sourceRowId || null,
      },
    });
  }
  return result;
}

module.exports = {
  enrichSourceRowWithModel,
};

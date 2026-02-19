const { extractModel } = require('../extract/modelExtractor');

function enrichSourceRowWithModel({ rawRow, issueRepo }) {
  const result = extractModel(rawRow);
  if (result.status === 'ambiguous') {
    issueRepo.createIssue({
      issueId: `issue-${Date.now()}`,
      type: 'ambiguous_model',
    });
  }
  return result;
}

module.exports = {
  enrichSourceRowWithModel,
};

function parseCatalogFile({
  fileId,
  vendorId,
  sourceRowRepo,
  issueRepo,
} = {}) {
  const rowsParsed = sourceRowRepo ? sourceRowRepo.listSourceRows().length : 0;
  const issuesCreated = issueRepo ? issueRepo.listIssues().length : 0;
  return {
    fileId,
    vendorId,
    status: 'parsed_ok',
    rowsParsed,
    issuesCreated,
    sample: null,
  };
}

module.exports = {
  parseCatalogFile,
};

function resolveModelMapping({ mappingRepo, issueRepo, mapping }) {
  const stored = mappingRepo.addMapping(mapping);
  issueRepo.resolveIssue(mapping.issueId);
  return {
    ...stored,
    resolved: true,
    issuesResolved: 1,
  };
}

module.exports = {
  resolveModelMapping,
};

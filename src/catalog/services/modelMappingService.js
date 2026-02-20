async function resolveModelMapping({ mappingRepo, issueRepo, mapping }) {
  const stored = await mappingRepo.addMapping(mapping);
  await issueRepo.resolveIssue(mapping.issueId);
  return {
    ...stored,
    resolved: true,
    issuesResolved: 1,
  };
}

module.exports = {
  resolveModelMapping,
};

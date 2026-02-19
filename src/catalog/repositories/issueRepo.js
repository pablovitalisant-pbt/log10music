function createIssueRepo({ store } = {}) {
  const state = store || { issues: [] };
  return {
    createIssue(issue) {
      state.issues.push(issue);
      return issue;
    },
    resolveIssue(issueId) {
      const issue = state.issues.find((item) => item.issueId === issueId);
      if (issue) {
        issue.resolved = true;
      }
      return issue || null;
    },
    listIssues({ runId } = {}) {
      if (!runId) return [...state.issues];
      return state.issues.filter((issue) => issue.runId === runId);
    },
    countIssues() {
      return state.issues.length;
    },
  };
}

module.exports = {
  createIssueRepo,
};

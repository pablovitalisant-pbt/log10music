function createIssueRepo({ store } = {}) {
  const state = store || { issues: [] };
  return {
    createIssue(issue) {
      state.issues.push(issue);
      return issue;
    },
    listIssues() {
      return [...state.issues];
    },
  };
}

module.exports = {
  createIssueRepo,
};

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
    countIssues() {
      return state.issues.length;
    },
  };
}

module.exports = {
  createIssueRepo,
};

const { addIssue, listIssues, resolveIssue } = require('../persistence/catalogDb');

function createIssueRepo({ store } = {}) {
  return {
    async createIssue(issue) {
      return store ? store.createIssue(issue) : addIssue(issue);
    },
    async resolveIssue(issueId) {
      return store ? store.resolveIssue(issueId) : resolveIssue(issueId);
    },
    async listIssues({ runId } = {}) {
      if (store) return store.listIssues({ runId });
      const items = await listIssues();
      if (!runId) return items;
      return items;
    },
    async countIssues() {
      const items = store ? store.listIssues({}) : await listIssues();
      return items.length;
    },
  };
}

module.exports = {
  createIssueRepo,
};

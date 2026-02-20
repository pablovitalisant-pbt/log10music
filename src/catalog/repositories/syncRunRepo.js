const { addSyncRun, listSyncRuns } = require('../persistence/catalogDb');

function createSyncRunRepo({ store } = {}) {
  return {
    async createRun(run) {
      return store ? store.createRun(run) : addSyncRun(run);
    },
    async listRuns() {
      return store ? store.listRuns() : listSyncRuns();
    },
  };
}

module.exports = {
  createSyncRunRepo,
};

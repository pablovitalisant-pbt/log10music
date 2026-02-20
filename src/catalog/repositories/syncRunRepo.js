const { addSyncRun, listSyncRuns, updateSyncRun } = require('../persistence/catalogDb');

function createSyncRunRepo({ store } = {}) {
  return {
    async createRun(run) {
      return store ? store.createRun(run) : addSyncRun(run);
    },
    async updateRun(runId, patch) {
      return store ? store.updateRun(runId, patch) : updateSyncRun(runId, patch);
    },
    async listRuns() {
      return store ? store.listRuns() : listSyncRuns();
    },
  };
}

module.exports = {
  createSyncRunRepo,
};

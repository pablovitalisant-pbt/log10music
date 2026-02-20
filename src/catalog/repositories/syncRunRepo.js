const { getCatalogState } = require('../state/catalogState');

function createSyncRunRepo({ store } = {}) {
  const state = store || getCatalogState();
  return {
    createRun(run) {
      state.runs.push(run);
      return run;
    },
    listRuns() {
      return [...state.runs];
    },
  };
}

module.exports = {
  createSyncRunRepo,
};

function createSyncRunRepo({ store } = {}) {
  const state = store || { runs: [] };
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

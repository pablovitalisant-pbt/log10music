function createSourceRowRepo({ store } = {}) {
  const state = store || { rows: [] };
  return {
    upsertSourceRow(row) {
      const index = state.rows.findIndex((item) => item.sourceRowId === row.sourceRowId);
      if (index >= 0) {
        state.rows[index] = row;
        return row;
      }
      state.rows.push(row);
      return row;
    },
    listSourceRows() {
      return [...state.rows];
    },
  };
}

module.exports = {
  createSourceRowRepo,
};

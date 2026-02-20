const { upsertRow, listRows } = require('../persistence/catalogDb');

function createSourceRowRepo({ store } = {}) {
  return {
    async upsertSourceRow(row) {
      return store ? store.upsertSourceRow(row) : upsertRow(row);
    },
    async listSourceRows({ fileId } = {}) {
      return store ? store.listSourceRows({ fileId }) : listRows({ fileId });
    },
  };
}

module.exports = {
  createSourceRowRepo,
};

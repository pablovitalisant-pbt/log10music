const { upsertFile, listFiles } = require('../persistence/catalogDb');

function createSourceFileRepo({ store } = {}) {
  return {
    async upsertSourceFile(file) {
      return store ? store.upsertSourceFile(file) : upsertFile(file);
    },
    async listSourceFiles({ vendorId } = {}) {
      return store ? store.listSourceFiles({ vendorId }) : listFiles({ vendorId });
    },
  };
}

module.exports = {
  createSourceFileRepo,
};

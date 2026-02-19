function createSourceFileRepo({ store } = {}) {
  const state = store || { files: [] };
  return {
    upsertSourceFile(file) {
      const index = state.files.findIndex((item) => item.fileId === file.fileId);
      if (index >= 0) {
        state.files[index] = file;
        return file;
      }
      state.files.push(file);
      return file;
    },
    listSourceFiles({ vendorId } = {}) {
      if (!vendorId) return [...state.files];
      return state.files.filter((file) => file.vendorId === vendorId);
    },
  };
}

module.exports = {
  createSourceFileRepo,
};

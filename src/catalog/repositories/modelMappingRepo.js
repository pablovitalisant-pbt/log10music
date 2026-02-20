function createModelMappingRepo({ store } = {}) {
  const state = store || { mappings: [] };
  return {
    async addMapping(mapping) {
      state.mappings.push(mapping);
      return mapping;
    },
    async listMappings() {
      return [...state.mappings];
    },
  };
}

module.exports = {
  createModelMappingRepo,
};

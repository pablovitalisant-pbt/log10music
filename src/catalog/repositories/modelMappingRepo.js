function createModelMappingRepo({ store } = {}) {
  const state = store || { mappings: [] };
  return {
    addMapping(mapping) {
      state.mappings.push(mapping);
      return mapping;
    },
    listMappings() {
      return [...state.mappings];
    },
  };
}

module.exports = {
  createModelMappingRepo,
};

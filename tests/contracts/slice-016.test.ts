const { getTracingRequirement } = require('../../src/observability/tracingRequirement');

describe('slice-016: tracing', () => {
  it('declara que tracing no es requerido a esta escala', () => {
    expect(getTracingRequirement()).toBe('No requerido para esta escala.');
  });
});

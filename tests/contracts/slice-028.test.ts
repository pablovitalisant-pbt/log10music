const { getContainerizationPolicy } = require('../../src/cicd/containerizationPolicy');

describe('slice-028: containerización', () => {
  it('declara que no se requiere containerización', () => {
    expect(getContainerizationPolicy()).toBe('No requerida (uso de Serverless).');
  });
});

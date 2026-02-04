const { getTestFixtures } = require('../../src/testing/testFixtures');

describe('slice-024: test data', () => {
  it('define fixture base de leads', () => {
    expect(getTestFixtures()).toEqual({ leads: ['test@test.com'] });
  });
});

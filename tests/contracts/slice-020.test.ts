const { getUiUxContract } = require('../../src/frontend/uiUxContract');

describe('slice-020: ui/ux fidelidad stitch', () => {
  it('define design system, referencias absolutas y breakpoints responsive', () => {
    const uiux = getUiUxContract();
    expect(uiux.colors).toEqual({ primary: '#FF5F00', charcoal: '#0A0A0A' });
    expect(uiux.typography).toEqual({ titles: 'Archivo Black', body: 'Inter' });
    expect(uiux.references).toEqual(['docs/UI Design/screen.png', 'docs/UI Design/code.html']);
    expect(uiux.breakpoints).toEqual(['sm', 'md', 'lg', 'xl']);
  });
});

function getUiUxContract() {
  return {
    colors: { primary: '#FF5F00', charcoal: '#0A0A0A' },
    typography: { titles: 'Archivo Black', body: 'Inter' },
    references: ['docs/UI Design/screen.png', 'docs/UI Design/code.html'],
    breakpoints: ['sm', 'md', 'lg', 'xl']
  };
}

module.exports = { getUiUxContract };

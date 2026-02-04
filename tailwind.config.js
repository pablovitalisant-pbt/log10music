/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './docs/UI Design/code.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5F00',
        charcoal: '#0A0A0A',
        industrial: '#1A1A1A',
      },
      fontFamily: {
        display: ['var(--font-archivo-black)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

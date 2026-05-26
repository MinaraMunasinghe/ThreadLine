/**
 * Arienti-inspired ThreadLine palette (reference).
 * Active theme tokens live in src/styles.css (@theme) for Tailwind v4.
 * Keep this file out of the project root — Angular auto-loads root tailwind.config.js
 * and conflicts with @tailwindcss/postcss.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF9F7', dark: '#F3F1ED' },
        charcoal: { DEFAULT: '#2D2D2D', light: '#4A4A4A', muted: '#6B6B6B' },
        primary: { DEFAULT: '#2D2D2D', hover: '#1A1A1A', foreground: '#FFFFFF' },
        accent: { sage: '#9CAF88', 'sage-light': '#E8EDE4' },
        border: { DEFAULT: '#E8E6E3', dark: '#D4D1CC' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
};

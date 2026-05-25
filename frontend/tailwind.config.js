/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.18), 0 20px 60px rgba(15,23,42,0.55)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 30%), linear-gradient(135deg, rgba(2,6,23,0.98), rgba(8,15,35,0.94))',
      },
      colors: {
        steel: {
          950: '#020617',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

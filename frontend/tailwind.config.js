/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.transition-transform': {
          transition: 'transform 0.3s ease-in-out',
        }
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}


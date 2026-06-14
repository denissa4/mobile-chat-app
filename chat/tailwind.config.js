/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        user: {
          bg: '#2563EB',
          text: '#FFFFFF',
        },
        bot: {
          bg: {
            light: '#F3F4F6',
            dark: '#1F2937',
          },
          text: {
            light: '#111827',
            dark: '#F9FAFB',
          },
        },
      },
    },
  },
  plugins: [],
};

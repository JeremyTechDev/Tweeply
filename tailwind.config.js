/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#55acee',
        dark: '#292f32',
        grey: '#66757f',
        light: '#ccd6dd',
        white: '#e1e8ed',
      },
    },
  },
  plugins: [],
};

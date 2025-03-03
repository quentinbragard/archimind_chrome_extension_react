/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx,html}",
      "./public/**/*.html"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#1C4DEB',
            dark: '#153db8',
            light: '#4A6F85',
          },
          secondary: '#7B9EB3',
          background: '#E1EBEF',
          surface: '#ffffff',
          text: {
            DEFAULT: '#334854',
            secondary: '#607D8B',
          }
        },
        boxShadow: {
          sm: '0 2px 5px rgba(0, 0, 0, 0.1)',
          md: '0 4px 10px rgba(0, 0, 0, 0.12)',
          lg: '0 10px 25px rgba(51, 72, 84, 0.15)',
        },
        fontFamily: {
          sans: ['Roboto', 'Arial', 'sans-serif'],
          heading: ['Poppins', 'sans-serif'],
          mono: ['monospace'],
        },
      },
    },
    plugins: [],
  }
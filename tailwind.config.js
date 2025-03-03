/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx,html}",
	  "./public/**/*.html"
	],
	theme: {
	  extend: {
		colors: {
		  primary: '#1C4DEB',
		  'primary-dark': '#153db8',
		  'primary-light': '#4A6F85',
		  secondary: '#7B9EB3',
		  background: '#E1EBEF',
		  surface: '#ffffff',
		},
	  },
	},
	plugins: [],
  }
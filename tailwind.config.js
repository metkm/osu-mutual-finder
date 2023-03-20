module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "dark": "#101010"
      },
      borderWidth: {
        "5": "5px"
      }
    },
  },
  plugins: [],
}

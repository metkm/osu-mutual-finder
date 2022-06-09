module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        "scroll": "inset 0px 0px 10px 10px"
      }
    },
  },
  variants: {
    extend: {
      backgroundSize: ["hover"]
    },
  },
  plugins: [],
}

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        "-10": "-10"
      },
      backgroundPosition: {
        "45%": "50% 45%",
        "55%": "50% 55%"
      },
    },
  },
  variants: {
    extend: {
      backgroundSize: ["hover"]
    },
  },
  plugins: [],
}

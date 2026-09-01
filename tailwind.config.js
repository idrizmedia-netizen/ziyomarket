/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#233457",
        primaryDark: "#162340",
        accent: "#E8A33D",
        accentDark: "#C6811F",
        ink: "#20222E",
        muted: "#767A8A",
        border: "#E7E1D2",
        success: "#2F8F52",
        danger: "#C4483B",
        bg: "#FAF7F1",
      },
      fontFamily: {
        display: ['"Iowan Old Style"', "Georgia", '"Times New Roman"', "serif"],
      },
    },
  },
  plugins: [],
};

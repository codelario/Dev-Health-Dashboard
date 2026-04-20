/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        calmBlue: "#1D4ED8",
        cardBg: "#F8FAFC",
        ink: "#0F172A"
      }
    }
  },
  plugins: []
};

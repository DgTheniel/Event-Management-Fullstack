/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        managementBg: "#fcfcfd",
        managementAccent: "#51bc8f",
        publicPrimary: "#B91C1C",
        publicSecondary: "#F59E0B",
        publicBg: "#FFFBF0",
      },
    },
  },
  plugins: [],
};

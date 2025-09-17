/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // React + Vite ke liye sab cover
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI add
};

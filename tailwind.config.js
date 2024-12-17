/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flash: {
          "0%, 100%": {
            color: "#fff",
            textShadow: "0 0 7px #fff",
          },
          "90%": {
            color: "#484848",
            textShadow: "none",
          },
        },
      },
      animation: {
        flash: "flash 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

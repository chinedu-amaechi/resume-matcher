const config = {
  plugins: {
    autoprefixer: {},
    "@tailwindcss/postcss": {
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
      future: {
        hoverOnlyWhenSupported: true,
      },
    },
  },
};

export default config;

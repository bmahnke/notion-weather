/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
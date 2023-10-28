/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/tailwind/*.vue',
    './src/App.vue',
    // 其他文件...
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}


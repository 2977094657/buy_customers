/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/tailwind/*.vue',
    './src/App.vue',
    // 其他文件...
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#F1F2F3',
      },
    },
    screens: {
      'ssm': '0px',

      'lm': {'max': '640px'},

      'ld': {'max': '768px'},

      'llg': {'max': '1004px'},

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [
      require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}


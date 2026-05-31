import type { Config } from 'tailwindcss'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    tailwindScrollbarHide
  ]
} satisfies Config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F5138',
          deep: '#163D2B',
          fresh: '#3D8055',
          sage: '#DCE9DD',
          lightSage: '#EFF5EF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          background: '#F8FAF7',
          border: '#E8ECE8',
          muted: '#87918A',
          charcoal: '#26312B',
          darkCharcoal: '#18231D',
        },
        semantic: {
          success: '#23845B',
          warning: '#D99A32',
          error: '#C94C4C',
          info: '#3C78A5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Kannada', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2', // 기본 색상 확장
        secondary: '#14171A', // 보조 색상 확장
      },
      spacing: {
        '128': '32rem', // 커스텀 여백 추가
        '144': '36rem',
      },
    },
  },
  plugins: [],
};
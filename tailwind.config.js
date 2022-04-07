const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-sans': ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '4/5': '80%',
        '2/3': 'calc(2 / 3 * 100%)',
        '3/4': '75%',
      },
      colors: {
        // primary
        'reddit-orange': '#FF4500',
        'reddit-blue': '#0079D3',
        // secondary
        'reddit-body-dark': '#1A1A1B',
        'reddit-body-light': '#FFFFFF',
        // background
        'reddit-black': '030303',
        'reddit-light-gray': '#DAE0E6',
        //border
        'reddit-border-dark': '#474748',
        'reddit-border-light': '#CCCCCC',
        // text
        'reddit-text-dark': '#222222',
        'reddit-text-light': '#D7DADC',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

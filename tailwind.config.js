const { callbackify } = require('util');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			maxWidth: {
				'4/5': '80%',
				'2/3': 'calc(2 / 3 * 100%)',
				'3/4': '75%',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,jsx}"],
	theme: {
		extend: {
			colors: {
				bg: "#CCC8B6",
				bug: "#304980",
				bugLegs: "black",
				bugSecondary: "#3B5A9E",
				accent: "#3E4820",
				eyes: "#D22D2E",
                text: "#CCC8B6",
			},
			borderWidth: {
				borderThickness: "1em",
				borderThickness2: ".8em",
			},
		},
	},
	plugins: [],
};

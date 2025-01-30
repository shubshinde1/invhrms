/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/preline/dist/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin")],
};



// /** @type {import('tailwindcss').Config} */
// import preline from "preline/plugin";

// export default {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/preline/dist/*.js",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {},
//   },
//   plugins: [preline],
// };


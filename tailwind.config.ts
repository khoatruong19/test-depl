import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primaryColor: "#E35533",
        secondaryColor: "#2B4137"
      },
      screens:{
        'xs': '400px',
        'sm': '550px',
      }
    },
  },
  plugins: [],
} satisfies Config;

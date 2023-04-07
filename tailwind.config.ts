import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        primaryColor: "#E35533",
        secondaryColor: "#2B4137"
      }
    },
  },
  plugins: [],
} satisfies Config;

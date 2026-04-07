// tailwind.config.js
import { heroui } from "@heroui/theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/input/dist/**/*.{js,ts,jsx,tsx}",      // ← add
    "./node_modules/@heroui/button/dist/**/*.{js,ts,jsx,tsx}",     // ← add
    "./node_modules/@heroui/select/dist/**/*.{js,ts,jsx,tsx}",     // ← add
    "./node_modules/@heroui/modal/dist/**/*.{js,ts,jsx,tsx}",      // ← add
    // or use a wildcard to cover all of them at once:
  ],
  theme: { extend: {} },
  darkMode: "class",
  plugins: [heroui()],
};
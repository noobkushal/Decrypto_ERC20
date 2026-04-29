/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        foreground: "#000000",
        industrial: {
          emerald: "#10B981",
          crimson: "#EF4444",
          cyan: "#06B6D4",
          black: "#000000",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            500: "#6B7280",
            900: "#111827",
          }
        },
      },
    },
  },
  plugins: [],
};

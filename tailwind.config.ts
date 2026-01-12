import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        success: '#16A34A',
        danger: '#DC2626',
        accent: '#FACC15',
        dark: {
          bg: '#020617',
          card: '#111827',
          border: '#1F2937',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
        }
      },
    },
  },
  plugins: [],
};
export default config;
